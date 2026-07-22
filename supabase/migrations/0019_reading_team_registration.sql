-- Independent 3-person / 6-person reading competition teams.
-- These tables intentionally do not reference profiles.small_group, pastoral_zone,
-- or the existing organisation statistics views.

CREATE TABLE IF NOT EXISTS public.reading_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  global_plan_id UUID NOT NULL REFERENCES public.global_plans(id) ON DELETE CASCADE,
  division SMALLINT NOT NULL CHECK (division IN (3, 6)),
  name TEXT NOT NULL CHECK (btrim(name) <> '' AND char_length(btrim(name)) <= 40),
  captain_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  invite_code TEXT NOT NULL UNIQUE CHECK (char_length(invite_code) BETWEEN 8 AND 16),
  status TEXT NOT NULL DEFAULT 'forming' CHECK (status IN ('forming', 'ready')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (id, global_plan_id)
);

CREATE TABLE IF NOT EXISTS public.reading_team_members (
  team_id UUID NOT NULL,
  global_plan_id UUID NOT NULL REFERENCES public.global_plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  member_role TEXT NOT NULL DEFAULT 'member' CHECK (member_role IN ('captain', 'member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (team_id, user_id),
  UNIQUE (global_plan_id, user_id),
  CONSTRAINT reading_team_members_team_plan_fk
    FOREIGN KEY (team_id, global_plan_id)
    REFERENCES public.reading_teams(id, global_plan_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_reading_teams_plan_division
  ON public.reading_teams(global_plan_id, division, status);
CREATE INDEX IF NOT EXISTS idx_reading_team_members_user
  ON public.reading_team_members(user_id, global_plan_id);

DROP TRIGGER IF EXISTS trg_reading_teams_updated_at ON public.reading_teams;
CREATE TRIGGER trg_reading_teams_updated_at
  BEFORE UPDATE ON public.reading_teams
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.reading_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_team_members ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_reading_team_member(p_team_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $reading_team_member$
  SELECT EXISTS (
    SELECT 1 FROM public.reading_team_members
    WHERE team_id = p_team_id AND user_id = p_user_id
  );
$reading_team_member$;

-- A member row is never created from a display name. user_id must resolve to
-- an existing profiles.id UUID, and names are read live from profiles for display.
-- Ordinary members may only see a team after they have joined it. Existing
-- organisation leaders keep their current stats permissions, but those scopes do
-- not grant access to unrelated competition teams.
DROP POLICY IF EXISTS reading_teams_own_team_read ON public.reading_teams;
CREATE POLICY reading_teams_own_team_read ON public.reading_teams
  FOR SELECT TO authenticated
  USING (
    public.is_reading_team_member(reading_teams.id, public.current_profile_id())
    OR (SELECT my_role FROM public.get_my_profile()) = 'admin'
  );

DROP POLICY IF EXISTS reading_team_members_own_team_read ON public.reading_team_members;
CREATE POLICY reading_team_members_own_team_read ON public.reading_team_members
  FOR SELECT TO authenticated
  USING (
    public.is_reading_team_member(reading_team_members.team_id, public.current_profile_id())
    OR (SELECT my_role FROM public.get_my_profile()) = 'admin'
  );

REVOKE ALL ON public.reading_teams FROM authenticated;
REVOKE ALL ON public.reading_team_members FROM authenticated;
REVOKE ALL ON FUNCTION public.is_reading_team_member(UUID, UUID) FROM PUBLIC;
GRANT SELECT ON public.reading_teams TO authenticated;
GRANT SELECT ON public.reading_team_members TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_reading_team_member(UUID, UUID) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.resolve_reading_team_actor(p_actor_id UUID DEFAULT NULL)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE actor_id UUID;
BEGIN
  IF p_actor_id IS NOT NULL AND auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'actor_override_forbidden';
  END IF;
  actor_id := COALESCE(p_actor_id, public.current_profile_id());
  IF actor_id IS NULL OR NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = actor_id) THEN
    RAISE EXCEPTION 'profile_required';
  END IF;
  RETURN actor_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_my_reading_team(
  p_global_plan_id UUID,
  p_actor_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  actor_id UUID;
  selected_team public.reading_teams%ROWTYPE;
  member_count INTEGER;
  members_json JSONB;
BEGIN
  actor_id := public.resolve_reading_team_actor(p_actor_id);

  SELECT team.* INTO selected_team
  FROM public.reading_teams team
  JOIN public.reading_team_members membership ON membership.team_id = team.id
  WHERE membership.user_id = actor_id
    AND membership.global_plan_id = p_global_plan_id
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('team', NULL, 'members', '[]'::JSONB);
  END IF;

  SELECT COUNT(*)::INTEGER INTO member_count
  FROM public.reading_team_members
  WHERE team_id = selected_team.id;

  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'userId', profile.id,
      'name', profile.name,
      'avatarUrl', profile.avatar_url,
      'role', membership.member_role,
      'isMe', profile.id = actor_id,
      'joinedAt', membership.joined_at,
      'hasJoinedPlan', plan.id IS NOT NULL,
      'currentRound', COALESCE(plan.current_round, 1),
      'chaptersRead', COALESCE(progress.chapters_read, 0),
      'todayRead', COALESCE(progress.today_read, 0),
      'lastReadAt', progress.last_read_at
    ) ORDER BY CASE WHEN membership.member_role = 'captain' THEN 0 ELSE 1 END, membership.joined_at
  ), '[]'::JSONB) INTO members_json
  FROM public.reading_team_members membership
  JOIN public.profiles profile ON profile.id = membership.user_id
  LEFT JOIN public.reading_plans plan
    ON plan.user_id = membership.user_id
   AND plan.global_plan_id = selected_team.global_plan_id
  LEFT JOIN LATERAL (
    SELECT
      COUNT(*) FILTER (WHERE log.round = COALESCE(plan.current_round, 1))::INTEGER AS chapters_read,
      COUNT(*) FILTER (
        WHERE log.round = COALESCE(plan.current_round, 1)
          AND log.read_at::DATE = CURRENT_DATE
      )::INTEGER AS today_read,
      MAX(log.read_at) AS last_read_at
    FROM public.reading_logs log
    WHERE log.plan_id = plan.id
  ) progress ON TRUE
  WHERE membership.team_id = selected_team.id;

  RETURN jsonb_build_object(
    'team', jsonb_build_object(
      'id', selected_team.id,
      'globalPlanId', selected_team.global_plan_id,
      'name', selected_team.name,
      'division', selected_team.division,
      'capacity', selected_team.division,
      'memberCount', member_count,
      'status', CASE WHEN member_count = selected_team.division THEN 'ready' ELSE 'forming' END,
      'captainId', selected_team.captain_id,
      'inviteCode', selected_team.invite_code,
      'createdAt', selected_team.created_at
    ),
    'members', members_json
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_reading_team_statistics(
  p_global_plan_id UUID,
  p_actor_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $reading_team_statistics$
DECLARE
  actor_id UUID;
  actor_role TEXT;
  teams_json JSONB;
BEGIN
  actor_id := public.resolve_reading_team_actor(p_actor_id);
  SELECT role INTO actor_role FROM public.profiles WHERE id = actor_id;
  IF actor_role <> 'admin' THEN
    RAISE EXCEPTION 'team_statistics_admin_required';
  END IF;

  WITH member_progress AS (
    SELECT
      team.id AS team_id, membership.user_id, membership.member_role, membership.joined_at,
      profile.name, COALESCE(plan.current_round, 1) AS current_round,
      COALESCE(progress.chapters_read, 0) AS chapters_read, progress.last_read_at
    FROM public.reading_teams team
    JOIN public.reading_team_members membership ON membership.team_id = team.id
    JOIN public.profiles profile ON profile.id = membership.user_id
    LEFT JOIN public.reading_plans plan
      ON plan.user_id = membership.user_id AND plan.global_plan_id = team.global_plan_id
    LEFT JOIN LATERAL (
      SELECT COUNT(*) FILTER (WHERE log.round = COALESCE(plan.current_round, 1))::INTEGER AS chapters_read,
             MAX(log.read_at) AS last_read_at
      FROM public.reading_logs log WHERE log.plan_id = plan.id
    ) progress ON TRUE
    WHERE team.global_plan_id = p_global_plan_id
  ), team_rollup AS (
    SELECT team.id, team.name, team.division, team.status, team.created_at,
      COUNT(member.user_id)::INTEGER AS member_count,
      COALESCE(SUM(member.chapters_read), 0)::INTEGER AS chapters_read,
      MAX(member.last_read_at) AS last_read_at,
      COALESCE(jsonb_agg(jsonb_build_object(
        'userId', member.user_id, 'name', member.name, 'role', member.member_role,
        'currentRound', member.current_round, 'chaptersRead', member.chapters_read,
        'lastReadAt', member.last_read_at
      ) ORDER BY CASE WHEN member.member_role = 'captain' THEN 0 ELSE 1 END, member.joined_at)
      FILTER (WHERE member.user_id IS NOT NULL), '[]'::JSONB) AS members
    FROM public.reading_teams team
    LEFT JOIN member_progress member ON member.team_id = team.id
    WHERE team.global_plan_id = p_global_plan_id
    GROUP BY team.id
  )
  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'id', id, 'name', name, 'division', division, 'status', status,
    'memberCount', member_count, 'chaptersRead', chapters_read,
    'lastReadAt', last_read_at, 'members', members
  ) ORDER BY division, name), '[]'::JSONB) INTO teams_json FROM team_rollup;

  RETURN jsonb_build_object(
    'summary', jsonb_build_object(
      'teamCount', (SELECT COUNT(*) FROM public.reading_teams WHERE global_plan_id = p_global_plan_id),
      'readyTeamCount', (SELECT COUNT(*) FROM public.reading_teams WHERE global_plan_id = p_global_plan_id AND status = 'ready'),
      'memberCount', (SELECT COUNT(*) FROM public.reading_team_members WHERE global_plan_id = p_global_plan_id),
      'division3Teams', (SELECT COUNT(*) FROM public.reading_teams WHERE global_plan_id = p_global_plan_id AND division = 3),
      'division6Teams', (SELECT COUNT(*) FROM public.reading_teams WHERE global_plan_id = p_global_plan_id AND division = 6)
    ),
    'teams', teams_json
  );
END;
$reading_team_statistics$;

CREATE OR REPLACE FUNCTION public.create_reading_team(
  p_global_plan_id UUID,
  p_division SMALLINT,
  p_name TEXT,
  p_actor_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  actor_id UUID;
  new_team public.reading_teams%ROWTYPE;
  generated_code TEXT;
BEGIN
  actor_id := public.resolve_reading_team_actor(p_actor_id);
  IF p_division NOT IN (3, 6) THEN RAISE EXCEPTION 'invalid_team_division'; END IF;
  IF btrim(COALESCE(p_name, '')) = '' OR char_length(btrim(p_name)) > 40 THEN
    RAISE EXCEPTION 'invalid_team_name';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.global_plans plan
    WHERE plan.id = p_global_plan_id
      AND plan.plan_kind = 'church_campaign_stage'
  ) THEN RAISE EXCEPTION 'team_plan_not_found'; END IF;
  IF EXISTS (
    SELECT 1 FROM public.reading_team_members
    WHERE global_plan_id = p_global_plan_id AND user_id = actor_id
  ) THEN RAISE EXCEPTION 'already_in_plan_team'; END IF;

  LOOP
    generated_code := upper(substr(replace(gen_random_uuid()::TEXT, '-', ''), 1, 10));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.reading_teams WHERE invite_code = generated_code);
  END LOOP;

  INSERT INTO public.reading_teams(global_plan_id, division, name, captain_id, invite_code)
  VALUES (p_global_plan_id, p_division, btrim(p_name), actor_id, generated_code)
  RETURNING * INTO new_team;

  INSERT INTO public.reading_team_members(team_id, global_plan_id, user_id, member_role)
  VALUES (new_team.id, p_global_plan_id, actor_id, 'captain');

  RETURN jsonb_build_object('teamId', new_team.id, 'inviteCode', new_team.invite_code, 'status', new_team.status);
EXCEPTION
  WHEN unique_violation THEN RAISE EXCEPTION 'already_in_plan_team';
END;
$$;

CREATE OR REPLACE FUNCTION public.join_reading_team_by_code(
  p_global_plan_id UUID,
  p_invite_code TEXT,
  p_actor_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  actor_id UUID;
  selected_team public.reading_teams%ROWTYPE;
  current_count INTEGER;
BEGIN
  actor_id := public.resolve_reading_team_actor(p_actor_id);
  IF EXISTS (
    SELECT 1 FROM public.reading_team_members
    WHERE global_plan_id = p_global_plan_id AND user_id = actor_id
  ) THEN RAISE EXCEPTION 'already_in_plan_team'; END IF;

  SELECT * INTO selected_team
  FROM public.reading_teams
  WHERE global_plan_id = p_global_plan_id
    AND invite_code = upper(btrim(COALESCE(p_invite_code, '')))
  FOR UPDATE;

  IF NOT FOUND THEN RAISE EXCEPTION 'team_invite_not_found'; END IF;
  SELECT COUNT(*)::INTEGER INTO current_count
  FROM public.reading_team_members WHERE team_id = selected_team.id;
  IF current_count >= selected_team.division OR selected_team.status = 'ready' THEN
    RAISE EXCEPTION 'reading_team_full';
  END IF;

  INSERT INTO public.reading_team_members(team_id, global_plan_id, user_id, member_role)
  VALUES (selected_team.id, p_global_plan_id, actor_id, 'member');
  current_count := current_count + 1;

  IF current_count = selected_team.division THEN
    UPDATE public.reading_teams SET status = 'ready' WHERE id = selected_team.id;
  END IF;

  RETURN jsonb_build_object(
    'teamId', selected_team.id,
    'memberCount', current_count,
    'capacity', selected_team.division,
    'status', CASE WHEN current_count = selected_team.division THEN 'ready' ELSE 'forming' END
  );
EXCEPTION
  WHEN unique_violation THEN RAISE EXCEPTION 'already_in_plan_team';
END;
$$;

CREATE OR REPLACE FUNCTION public.leave_reading_team(
  p_team_id UUID,
  p_actor_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  actor_id UUID;
  selected_team public.reading_teams%ROWTYPE;
BEGIN
  actor_id := public.resolve_reading_team_actor(p_actor_id);
  SELECT * INTO selected_team FROM public.reading_teams WHERE id = p_team_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'reading_team_not_found'; END IF;
  IF selected_team.status = 'ready' THEN RAISE EXCEPTION 'ready_team_roster_locked'; END IF;
  IF selected_team.captain_id = actor_id THEN RAISE EXCEPTION 'captain_must_disband_team'; END IF;
  DELETE FROM public.reading_team_members WHERE team_id = p_team_id AND user_id = actor_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'not_a_team_member'; END IF;
  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.disband_reading_team(
  p_team_id UUID,
  p_actor_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  actor_id UUID;
  selected_team public.reading_teams%ROWTYPE;
  actor_role TEXT;
BEGIN
  actor_id := public.resolve_reading_team_actor(p_actor_id);
  SELECT role INTO actor_role FROM public.profiles WHERE id = actor_id;
  SELECT * INTO selected_team FROM public.reading_teams WHERE id = p_team_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'reading_team_not_found'; END IF;
  IF selected_team.status = 'ready' AND actor_role <> 'admin' THEN
    RAISE EXCEPTION 'ready_team_roster_locked';
  END IF;
  IF selected_team.captain_id <> actor_id AND actor_role <> 'admin' THEN
    RAISE EXCEPTION 'team_captain_required';
  END IF;
  DELETE FROM public.reading_teams WHERE id = p_team_id;
  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.resolve_reading_team_actor(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_my_reading_team(UUID, UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_reading_team_statistics(UUID, UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.create_reading_team(UUID, SMALLINT, TEXT, UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.join_reading_team_by_code(UUID, TEXT, UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.leave_reading_team(UUID, UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.disband_reading_team(UUID, UUID) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.get_my_reading_team(UUID, UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_reading_team_statistics(UUID, UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.create_reading_team(UUID, SMALLINT, TEXT, UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.join_reading_team_by_code(UUID, TEXT, UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.leave_reading_team(UUID, UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.disband_reading_team(UUID, UUID) TO authenticated, service_role;
