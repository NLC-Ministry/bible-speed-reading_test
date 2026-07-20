-- Migration 0016: one versioned church campaign, editable rules, and 2-4 person small-home teams.
ALTER TABLE public.global_plans
  ADD COLUMN IF NOT EXISTS plan_kind TEXT NOT NULL DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS rules JSONB NOT NULL DEFAULT '{}'::JSONB,
  ADD COLUMN IF NOT EXISTS rule_version INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

ALTER TABLE public.global_plans
  DROP CONSTRAINT IF EXISTS global_plans_plan_kind_check,
  ADD CONSTRAINT global_plans_plan_kind_check CHECK (plan_kind IN ('standard', 'church_campaign')),
  DROP CONSTRAINT IF EXISTS global_plans_rule_version_check,
  ADD CONSTRAINT global_plans_rule_version_check CHECK (rule_version > 0);

CREATE TABLE IF NOT EXISTS public.plan_rule_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  global_plan_id UUID NOT NULL REFERENCES public.global_plans(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  snapshot JSONB NOT NULL,
  changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (global_plan_id, version)
);

CREATE TABLE IF NOT EXISTS public.small_home_teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  global_plan_id UUID NOT NULL REFERENCES public.global_plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (btrim(name) <> ''),
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_locked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.small_home_team_members (
  team_id UUID NOT NULL REFERENCES public.small_home_teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (team_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_plan_rule_versions_plan ON public.plan_rule_versions(global_plan_id, version DESC);
CREATE INDEX IF NOT EXISTS idx_small_home_teams_plan ON public.small_home_teams(global_plan_id);
CREATE INDEX IF NOT EXISTS idx_small_home_team_members_user ON public.small_home_team_members(user_id);

ALTER TABLE public.plan_rule_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.small_home_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.small_home_team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS plan_rule_versions_admin_read ON public.plan_rule_versions;
CREATE POLICY plan_rule_versions_admin_read ON public.plan_rule_versions
  FOR SELECT TO authenticated
  USING ((SELECT my_role FROM public.get_my_profile()) IN ('admin', 'senior_pastor'));

DROP POLICY IF EXISTS small_home_teams_read ON public.small_home_teams;
CREATE POLICY small_home_teams_read ON public.small_home_teams FOR SELECT TO authenticated USING (TRUE);
DROP POLICY IF EXISTS small_home_teams_create ON public.small_home_teams;
CREATE POLICY small_home_teams_create ON public.small_home_teams
  FOR INSERT TO authenticated WITH CHECK (created_by = public.current_profile_id());
DROP POLICY IF EXISTS small_home_teams_manage ON public.small_home_teams;
CREATE POLICY small_home_teams_manage ON public.small_home_teams
  FOR UPDATE TO authenticated
  USING (created_by = public.current_profile_id() OR (SELECT my_role FROM public.get_my_profile()) IN ('admin', 'senior_pastor'))
  WITH CHECK (created_by = public.current_profile_id() OR (SELECT my_role FROM public.get_my_profile()) IN ('admin', 'senior_pastor'));

DROP POLICY IF EXISTS small_home_team_members_read ON public.small_home_team_members;
CREATE POLICY small_home_team_members_read ON public.small_home_team_members FOR SELECT TO authenticated USING (TRUE);
DROP POLICY IF EXISTS small_home_team_members_manage ON public.small_home_team_members;
CREATE POLICY small_home_team_members_manage ON public.small_home_team_members
  FOR ALL TO authenticated
  USING (
    user_id = public.current_profile_id()
    OR EXISTS (
      SELECT 1 FROM public.small_home_teams team
      WHERE team.id = team_id
        AND (team.created_by = public.current_profile_id() OR (SELECT my_role FROM public.get_my_profile()) IN ('admin', 'senior_pastor'))
    )
  )
  WITH CHECK (
    user_id = public.current_profile_id()
    OR EXISTS (
      SELECT 1 FROM public.small_home_teams team
      WHERE team.id = team_id
        AND (team.created_by = public.current_profile_id() OR (SELECT my_role FROM public.get_my_profile()) IN ('admin', 'senior_pastor'))
    )
  );

GRANT SELECT ON public.plan_rule_versions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.small_home_teams TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.small_home_team_members TO authenticated;

CREATE OR REPLACE FUNCTION public.enforce_small_home_team_capacity()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE max_members INTEGER; current_members INTEGER;
BEGIN
  SELECT COALESCE((gp.rules #>> '{rules,teamRules,smallHome,max}')::INTEGER, 4)
    INTO max_members
  FROM public.small_home_teams team
  JOIN public.global_plans gp ON gp.id = team.global_plan_id
  WHERE team.id = NEW.team_id;
  SELECT COUNT(*) INTO current_members FROM public.small_home_team_members WHERE team_id = NEW.team_id;
  IF current_members >= max_members THEN RAISE EXCEPTION 'small_home_team_full'; END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_small_home_team_capacity ON public.small_home_team_members;
CREATE TRIGGER trg_small_home_team_capacity
  BEFORE INSERT ON public.small_home_team_members
  FOR EACH ROW EXECUTE FUNCTION public.enforce_small_home_team_capacity();

CREATE OR REPLACE FUNCTION public.publish_global_plan_rules(
  p_plan_id UUID,
  p_expected_version INTEGER,
  p_definition JSONB,
  p_actor_id UUID DEFAULT NULL
)
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE current_plan public.global_plans%ROWTYPE; next_version INTEGER; caller_role TEXT; actor_id UUID;
BEGIN
  IF p_actor_id IS NOT NULL AND auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'actor_override_forbidden';
  END IF;
  actor_id := COALESCE(p_actor_id, public.current_profile_id());
  SELECT role INTO caller_role FROM public.profiles WHERE id = actor_id;
  IF caller_role NOT IN ('admin', 'senior_pastor') THEN RAISE EXCEPTION 'permission_denied'; END IF;
  SELECT * INTO current_plan FROM public.global_plans WHERE id = p_plan_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'plan_not_found'; END IF;
  IF current_plan.rule_version <> p_expected_version THEN RAISE EXCEPTION 'version_conflict'; END IF;
  IF p_definition->>'planKind' <> 'church_campaign' THEN RAISE EXCEPTION 'invalid_plan_kind'; END IF;
  IF jsonb_typeof(p_definition->'stages') <> 'array' OR jsonb_array_length(p_definition->'stages') = 0 THEN RAISE EXCEPTION 'stages_required'; END IF;
  IF jsonb_typeof(p_definition->'segments') <> 'array' OR jsonb_array_length(p_definition->'segments') = 0 THEN RAISE EXCEPTION 'segments_required'; END IF;
  IF (p_definition #>> '{rules,teamRules,smallHome,min}')::INTEGER < 2
     OR (p_definition #>> '{rules,teamRules,smallHome,max}')::INTEGER > 4
     OR (p_definition #>> '{rules,teamRules,smallHome,min}')::INTEGER > (p_definition #>> '{rules,teamRules,smallHome,max}')::INTEGER
     THEN RAISE EXCEPTION 'invalid_small_home_rule'; END IF;
  IF (p_definition #>> '{rules,teamRules,smallGroup,min}')::INTEGER < 6
     OR (p_definition #> '{rules,teamRules,smallGroup,max}') <> 'null'::JSONB
     OR p_definition #>> '{rules,teamRules,smallGroup,source}' <> 'profile.small_group'
     THEN RAISE EXCEPTION 'invalid_small_group_rule'; END IF;

  INSERT INTO public.plan_rule_versions(global_plan_id, version, snapshot, changed_by)
  VALUES (p_plan_id, current_plan.rule_version, current_plan.rules, actor_id)
  ON CONFLICT (global_plan_id, version) DO NOTHING;

  next_version := current_plan.rule_version + 1;
  UPDATE public.global_plans
  SET name = p_definition->>'name',
      description = p_definition->>'description',
      start_date = (p_definition->>'startDate')::DATE,
      end_date = (p_definition->>'endDate')::DATE,
      target_books = ARRAY(
        SELECT DISTINCT reading->>'book'
        FROM jsonb_array_elements(p_definition->'segments') segment
        CROSS JOIN LATERAL jsonb_array_elements(segment->'readings') reading
        ORDER BY reading->>'book'
      ),
      plan_kind = 'church_campaign',
      rules = p_definition,
      rule_version = next_version,
      published_at = NOW()
  WHERE id = p_plan_id;

  UPDATE public.reading_plans
  SET name = p_definition->>'name',
      start_date = (p_definition->>'startDate')::DATE,
      end_date = (p_definition->>'endDate')::DATE,
      target_books = ARRAY(
        SELECT DISTINCT reading->>'book'
        FROM jsonb_array_elements(p_definition->'segments') segment
        CROSS JOIN LATERAL jsonb_array_elements(segment->'readings') reading
        ORDER BY reading->>'book'
      )
  WHERE global_plan_id = p_plan_id;

  RETURN next_version;
END;
$$;

REVOKE ALL ON FUNCTION public.publish_global_plan_rules(UUID, INTEGER, JSONB, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.publish_global_plan_rules(UUID, INTEGER, JSONB, UUID) TO authenticated, service_role;

INSERT INTO public.global_plans(
  id, name, description, start_date, end_date, target_books,
  is_hidden, plan_kind, rules, rule_version, published_at
)
VALUES (
  '00000000-0000-0000-c026-000000002029',
  'church_2026_2029',
  'Versioned church-wide Bible reading campaign',
  DATE '2026-08-01',
  DATE '2029-08-31',
  ARRAY[]::TEXT[],
  FALSE,
  'church_campaign',
  '{}'::JSONB,
  1,
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  is_hidden = FALSE,
  plan_kind = 'church_campaign',
  published_at = COALESCE(public.global_plans.published_at, EXCLUDED.published_at);

UPDATE public.global_plans SET is_hidden = TRUE
WHERE id::TEXT LIKE '00000000-0000-0000-a000-%';

