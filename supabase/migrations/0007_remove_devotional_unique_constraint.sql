-- Migration: 0007_remove_devotional_unique_constraint.sql
-- Description: Remove the UNIQUE constraint from devotional_notes to allow users to post multiple notes/sharing comments a day.

ALTER TABLE public.devotional_notes DROP CONSTRAINT IF EXISTS devotional_notes_user_id_note_date_key;
