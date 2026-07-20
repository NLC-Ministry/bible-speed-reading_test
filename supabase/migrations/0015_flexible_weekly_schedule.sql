-- Migration 0015: Store each participant's flexible weekly reading schedule.
ALTER TABLE public.reading_plans ADD COLUMN IF NOT EXISTS reading_days_per_week SMALLINT NOT NULL DEFAULT 7;
ALTER TABLE public.reading_plans ADD COLUMN IF NOT EXISTS rest_weekdays SMALLINT[] NOT NULL DEFAULT ARRAY[]::SMALLINT[];

ALTER TABLE public.reading_plans
  DROP CONSTRAINT IF EXISTS reading_plans_reading_days_per_week_check,
  ADD CONSTRAINT reading_plans_reading_days_per_week_check CHECK (reading_days_per_week BETWEEN 1 AND 7),
  DROP CONSTRAINT IF EXISTS reading_plans_rest_weekdays_check,
  ADD CONSTRAINT reading_plans_rest_weekdays_check CHECK (
    rest_weekdays <@ ARRAY[0, 1, 2, 3, 4, 5, 6]::SMALLINT[]
    AND cardinality(rest_weekdays) = 7 - reading_days_per_week
  );

COMMENT ON COLUMN public.reading_plans.rest_weekdays IS 'Sunday=0 through Saturday=6';
