-- Forward-only compatibility for databases that applied an earlier 0019.
-- Never recreate members by name: every membership remains tied to profile UUIDs
-- and the same global-plan UUID as its parent team.

DO $migration$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.reading_teams'::regclass
      AND conname IN ('reading_teams_id_global_plan_key', 'reading_teams_id_global_plan_id_key')
  ) THEN
    ALTER TABLE public.reading_teams
      ADD CONSTRAINT reading_teams_id_global_plan_key UNIQUE (id, global_plan_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.reading_team_members'::regclass
      AND conname = 'reading_team_members_team_plan_fk'
  ) THEN
    ALTER TABLE public.reading_team_members
      ADD CONSTRAINT reading_team_members_team_plan_fk
      FOREIGN KEY (team_id, global_plan_id)
      REFERENCES public.reading_teams(id, global_plan_id)
      ON DELETE CASCADE;
  END IF;
END;
$migration$;
