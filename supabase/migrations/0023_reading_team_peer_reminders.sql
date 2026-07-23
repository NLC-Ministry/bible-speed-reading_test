-- Allow registered members of the same reading competition team to encourage
-- one another without widening pastoral-zone or small-group permissions.

CREATE OR REPLACE FUNCTION public.send_reading_team_reminder(
  p_team_id UUID,
  p_recipient_id UUID,
  p_reason TEXT,
  p_message TEXT,
  p_global_plan_id UUID,
  p_actor_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $send_reading_team_reminder$
DECLARE
  actor_id UUID;
  clean_message TEXT;
  reminder_id UUID;
BEGIN
  -- Supabase-auth callers cannot impersonate another profile. The service-role
  -- edge function has no auth.uid() and supplies its already verified profile.
  IF auth.uid() IS NOT NULL THEN
    actor_id := public.resolve_reading_team_actor(NULL);
  ELSE
    actor_id := public.resolve_reading_team_actor(p_actor_id);
  END IF;
  clean_message := btrim(COALESCE(p_message, ''));

  IF actor_id = p_recipient_id THEN
    RAISE EXCEPTION 'team_reminder_self_not_allowed';
  END IF;
  IF p_reason NOT IN ('behind', 'inactive', 'care', 'encouragement') THEN
    RAISE EXCEPTION 'invalid_reminder_reason';
  END IF;
  IF char_length(clean_message) < 1 OR char_length(clean_message) > 300 THEN
    RAISE EXCEPTION 'invalid_reminder_message';
  END IF;
  IF NOT EXISTS (
    SELECT 1
    FROM public.reading_teams team
    JOIN public.reading_team_members sender
      ON sender.team_id = team.id
     AND sender.user_id = actor_id
    JOIN public.reading_team_members recipient
      ON recipient.team_id = team.id
     AND recipient.user_id = p_recipient_id
    WHERE team.id = p_team_id
      AND team.global_plan_id = p_global_plan_id
  ) THEN
    RAISE EXCEPTION 'team_reminder_same_team_required';
  END IF;

  BEGIN
    INSERT INTO public.care_reminders(
      sender_id, recipient_id, global_plan_id, plan_key,
      reason, message, status, sent_on
    )
    VALUES (
      actor_id, p_recipient_id, p_global_plan_id,
      'reading-team:' || p_team_id::TEXT,
      p_reason, clean_message, 'unread', CURRENT_DATE
    )
    RETURNING id INTO reminder_id;
  EXCEPTION WHEN unique_violation THEN
    RAISE EXCEPTION 'team_reminder_daily_limit';
  END;

  RETURN jsonb_build_object('id', reminder_id, 'sent', TRUE);
END;
$send_reading_team_reminder$;

REVOKE ALL ON FUNCTION public.send_reading_team_reminder(UUID, UUID, TEXT, TEXT, UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.send_reading_team_reminder(UUID, UUID, TEXT, TEXT, UUID, UUID)
  TO authenticated, service_role;

COMMENT ON FUNCTION public.send_reading_team_reminder(UUID, UUID, TEXT, TEXT, UUID, UUID) IS
  'Sends one daily encouragement to a UUID-linked member of the same reading competition team.';
