-- Care reminders ("戳一下") sent by pastoral leaders to members.
-- Recipients can read and acknowledge their own reminders. Senders can only
-- target profiles inside their authorized organizational scope.

CREATE TABLE IF NOT EXISTS public.care_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  global_plan_id UUID REFERENCES public.global_plans(id) ON DELETE SET NULL,
  plan_key TEXT NOT NULL DEFAULT '',
  reason TEXT NOT NULL DEFAULT 'behind',
  message TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'unread',
  sent_on DATE NOT NULL DEFAULT CURRENT_DATE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  CONSTRAINT care_reminders_no_self_reminder CHECK (sender_id <> recipient_id),
  CONSTRAINT care_reminders_reason_check CHECK (reason IN ('behind', 'inactive', 'care', 'encouragement')),
  CONSTRAINT care_reminders_status_check CHECK (status IN ('unread', 'read', 'dismissed')),
  CONSTRAINT care_reminders_read_at_check CHECK (
    (status = 'unread' AND read_at IS NULL)
    OR (status IN ('read', 'dismissed') AND read_at IS NOT NULL)
  ),
  CONSTRAINT care_reminders_daily_unique UNIQUE (sender_id, recipient_id, plan_key, sent_on)
);

CREATE INDEX IF NOT EXISTS idx_care_reminders_recipient_status_created
  ON public.care_reminders(recipient_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_care_reminders_sender_created
  ON public.care_reminders(sender_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_care_reminders_plan_key
  ON public.care_reminders(plan_key)
  WHERE plan_key <> '';

DROP TRIGGER IF EXISTS trg_care_reminders_updated_at ON public.care_reminders;
CREATE TRIGGER trg_care_reminders_updated_at
  BEFORE UPDATE ON public.care_reminders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Centralized scope check used by the INSERT policy. SECURITY DEFINER avoids
-- profiles RLS recursion while still deriving the sender from the session.
CREATE OR REPLACE FUNCTION public.can_send_care_reminder(target_profile_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles sender
    JOIN public.profiles recipient ON recipient.id = target_profile_id
    WHERE sender.id = public.current_profile_id()
      AND sender.id <> recipient.id
      AND recipient.is_active = TRUE
      AND (
        sender.role IN ('admin', 'senior_pastor')
        OR (
          sender.role = 'great_zone_leader'
          AND recipient.great_region = ANY(string_to_array(sender.great_region, ','))
        )
        OR (
          sender.role = 'zone_leader'
          AND recipient.pastoral_zone = ANY(string_to_array(sender.pastoral_zone, ','))
        )
        OR (
          sender.role = 'group_leader'
          AND recipient.pastoral_zone = ANY(string_to_array(sender.pastoral_zone, ','))
          AND recipient.small_group = ANY(string_to_array(sender.small_group, ','))
        )
      )
  );
$$;

REVOKE ALL ON FUNCTION public.can_send_care_reminder(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_send_care_reminder(UUID) TO authenticated;

ALTER TABLE public.care_reminders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS care_reminders_select_participant ON public.care_reminders;
CREATE POLICY care_reminders_select_participant
  ON public.care_reminders
  FOR SELECT
  TO authenticated
  USING (
    recipient_id = public.current_profile_id()
    OR sender_id = public.current_profile_id()
  );

DROP POLICY IF EXISTS care_reminders_insert_authorized_leader ON public.care_reminders;
CREATE POLICY care_reminders_insert_authorized_leader
  ON public.care_reminders
  FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = public.current_profile_id()
    AND public.can_send_care_reminder(recipient_id)
    AND status = 'unread'
    AND read_at IS NULL
    AND sent_on = CURRENT_DATE
  );

DROP POLICY IF EXISTS care_reminders_update_recipient ON public.care_reminders;
CREATE POLICY care_reminders_update_recipient
  ON public.care_reminders
  FOR UPDATE
  TO authenticated
  USING (recipient_id = public.current_profile_id())
  WITH CHECK (recipient_id = public.current_profile_id());

-- Do not grant DELETE: reminders are retained as an audit trail.
GRANT SELECT, INSERT ON public.care_reminders TO authenticated;
GRANT UPDATE (status, read_at, updated_at) ON public.care_reminders TO authenticated;

COMMENT ON TABLE public.care_reminders IS
  'Pastoral care reminders sent to members who may need encouragement or follow-up.';
COMMENT ON COLUMN public.care_reminders.plan_key IS
  'Stable frontend plan context key when no shared global_plan_id is available.';
COMMENT ON COLUMN public.care_reminders.sent_on IS
  'Calendar date used to rate-limit duplicate reminders to once per sender/recipient/plan/day.';