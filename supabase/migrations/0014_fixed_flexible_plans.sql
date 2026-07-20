-- Migration 0014: Add fixed/flexible schedule types.
ALTER TABLE public.global_plans ADD COLUMN IF NOT EXISTS is_fixed BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE public.reading_plans ADD COLUMN IF NOT EXISTS is_fixed BOOLEAN NOT NULL DEFAULT TRUE;
