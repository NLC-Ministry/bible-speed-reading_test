-- ============================================================
-- Migration: 0011_account_identity_links.sql
-- Purpose:
--   Separate the app user profile from login identities.
--   A single profile can be linked to Google/Supabase, NLC Logto,
--   and future identity providers without losing reading history.
-- ============================================================

-- Profiles are the stable app user record. They should not be treated
-- as a login-provider record. Existing IDs are preserved.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;

-- The original schema tied profiles.id directly to auth.users(id).
-- Keep existing IDs, but allow a profile to be linked to multiple identity providers.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_schema = 'public'
      AND table_name = 'profiles'
      AND constraint_name = 'profiles_id_fkey'
  ) THEN
    ALTER TABLE public.profiles DROP CONSTRAINT profiles_id_fkey;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.user_identities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_user_id TEXT NOT NULL,
  email TEXT,
  display_name TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  last_seen_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  CONSTRAINT user_identities_provider_check CHECK (provider IN ('supabase', 'google', 'logto', 'nlc', 'email', 'manual')),
  CONSTRAINT user_identities_provider_subject_unique UNIQUE (provider, provider_user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_identities_profile_id
  ON public.user_identities(profile_id);

CREATE INDEX IF NOT EXISTS idx_user_identities_email
  ON public.user_identities(LOWER(email))
  WHERE email IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_identities_one_primary_per_profile
  ON public.user_identities(profile_id)
  WHERE is_primary;

COMMENT ON TABLE public.user_identities IS 'Login identities linked to one stable app profile. This prevents data loss when users move from Google/Supabase login to NLC Logto.';
COMMENT ON COLUMN public.user_identities.profile_id IS 'Stable app profile that owns reading plans, logs, roles, and church grouping.';
COMMENT ON COLUMN public.user_identities.provider IS 'Login provider such as supabase, google, logto, nlc, email, or manual.';
COMMENT ON COLUMN public.user_identities.provider_user_id IS 'Provider subject/user id. For Supabase Auth this is the JWT sub/auth user id; for Logto this is the OIDC sub.';

-- Backfill existing Supabase-auth-based users as identities.
INSERT INTO public.user_identities (profile_id, provider, provider_user_id, display_name, is_primary, last_seen_at)
SELECT id, 'supabase', id::text, name, TRUE, NOW()
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1
  FROM public.user_identities ui
  WHERE ui.provider = 'supabase'
    AND ui.provider_user_id = p.id::text
);

-- Resolve the current Supabase-authenticated request to the stable app profile.
-- This keeps RLS compatible after identities are introduced.
CREATE OR REPLACE FUNCTION public.current_profile_id()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ui.profile_id
  FROM public.user_identities ui
  WHERE ui.provider_user_id = (auth.jwt() ->> 'sub')
  ORDER BY
    CASE ui.provider WHEN 'supabase' THEN 0 WHEN 'google' THEN 1 ELSE 2 END,
    ui.is_primary DESC,
    ui.created_at ASC
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_my_profile()
RETURNS TABLE(
  my_role TEXT,
  my_great_region TEXT,
  my_pastoral_zone TEXT,
  my_small_group TEXT
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role, great_region, pastoral_zone, small_group
  FROM public.profiles
  WHERE id = public.current_profile_id();
$$;

-- Drop old auth.uid()-based policies on the main user-owned tables.
DO $$
DECLARE
  policy_record RECORD;
BEGIN
  FOR policy_record IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('profiles', 'reading_plans', 'reading_logs')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', policy_record.policyname, policy_record.schemaname, policy_record.tablename);
  END LOOP;
END $$;

ALTER TABLE public.user_identities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "identity_select_own_or_admin" ON public.user_identities;
CREATE POLICY "identity_select_own_or_admin"
  ON public.user_identities FOR SELECT
  TO authenticated
  USING (
    profile_id = public.current_profile_id()
    OR (SELECT my_role FROM public.get_my_profile()) IN ('admin', 'senior_pastor')
  );

DROP POLICY IF EXISTS "identity_manage_admin_only" ON public.user_identities;
CREATE POLICY "identity_manage_admin_only"
  ON public.user_identities FOR ALL
  TO authenticated
  USING ((SELECT my_role FROM public.get_my_profile()) IN ('admin', 'senior_pastor'))
  WITH CHECK ((SELECT my_role FROM public.get_my_profile()) IN ('admin', 'senior_pastor'));

CREATE POLICY "profiles_manage_own"
  ON public.profiles FOR ALL
  TO authenticated
  USING (id = public.current_profile_id())
  WITH CHECK (id = public.current_profile_id());

CREATE POLICY "profiles_manage_admin"
  ON public.profiles FOR ALL
  TO authenticated
  USING ((SELECT my_role FROM public.get_my_profile()) IN ('admin', 'senior_pastor'))
  WITH CHECK ((SELECT my_role FROM public.get_my_profile()) IN ('admin', 'senior_pastor'));

CREATE POLICY "profiles_select_by_role"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    id = public.current_profile_id()
    OR (SELECT my_role FROM public.get_my_profile()) IN ('admin', 'senior_pastor')
    OR ((SELECT my_role FROM public.get_my_profile()) = 'great_zone_leader' AND great_region = ANY(string_to_array((SELECT my_great_region FROM public.get_my_profile()), ',')))
    OR ((SELECT my_role FROM public.get_my_profile()) = 'zone_leader' AND pastoral_zone = ANY(string_to_array((SELECT my_pastoral_zone FROM public.get_my_profile()), ',')))
    OR ((SELECT my_role FROM public.get_my_profile()) IN ('group_leader', 'member') AND pastoral_zone = ANY(string_to_array((SELECT my_pastoral_zone FROM public.get_my_profile()), ',')) AND small_group = ANY(string_to_array((SELECT my_small_group FROM public.get_my_profile()), ',')))
  );

CREATE POLICY "reading_plans_manage_own"
  ON public.reading_plans FOR ALL
  TO authenticated
  USING (user_id = public.current_profile_id())
  WITH CHECK (user_id = public.current_profile_id());

CREATE POLICY "reading_plans_select_by_role"
  ON public.reading_plans FOR SELECT
  TO authenticated
  USING (
    user_id = public.current_profile_id()
    OR (SELECT my_role FROM public.get_my_profile()) IN ('admin', 'senior_pastor')
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = user_id AND (
        (SELECT my_role FROM public.get_my_profile()) = 'great_zone_leader' AND p.great_region = ANY(string_to_array((SELECT my_great_region FROM public.get_my_profile()), ','))
        OR (SELECT my_role FROM public.get_my_profile()) = 'zone_leader' AND p.pastoral_zone = ANY(string_to_array((SELECT my_pastoral_zone FROM public.get_my_profile()), ','))
        OR (SELECT my_role FROM public.get_my_profile()) IN ('group_leader', 'member') AND p.pastoral_zone = ANY(string_to_array((SELECT my_pastoral_zone FROM public.get_my_profile()), ',')) AND p.small_group = ANY(string_to_array((SELECT my_small_group FROM public.get_my_profile()), ','))
      )
    )
  );

CREATE POLICY "reading_logs_manage_own"
  ON public.reading_logs FOR ALL
  TO authenticated
  USING (user_id = public.current_profile_id())
  WITH CHECK (user_id = public.current_profile_id());

CREATE POLICY "reading_logs_select_by_role"
  ON public.reading_logs FOR SELECT
  TO authenticated
  USING (
    user_id = public.current_profile_id()
    OR (SELECT my_role FROM public.get_my_profile()) IN ('admin', 'senior_pastor')
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = user_id AND (
        (SELECT my_role FROM public.get_my_profile()) = 'great_zone_leader' AND p.great_region = ANY(string_to_array((SELECT my_great_region FROM public.get_my_profile()), ','))
        OR (SELECT my_role FROM public.get_my_profile()) = 'zone_leader' AND p.pastoral_zone = ANY(string_to_array((SELECT my_pastoral_zone FROM public.get_my_profile()), ','))
        OR (SELECT my_role FROM public.get_my_profile()) IN ('group_leader', 'member') AND p.pastoral_zone = ANY(string_to_array((SELECT my_pastoral_zone FROM public.get_my_profile()), ',')) AND p.small_group = ANY(string_to_array((SELECT my_small_group FROM public.get_my_profile()), ','))
      )
    )
  );

-- Helper view for admins to inspect account links and find duplicate/new-login cases.
CREATE OR REPLACE VIEW public.profile_identity_overview AS
SELECT
  p.id AS profile_id,
  p.name,
  p.role,
  p.pastoral_zone,
  p.small_group,
  ui.provider,
  ui.provider_user_id,
  ui.email,
  ui.is_primary,
  ui.last_seen_at,
  p.created_at AS profile_created_at
FROM public.profiles p
LEFT JOIN public.user_identities ui ON ui.profile_id = p.id;
