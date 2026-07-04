-- Migration: Add daily verse likes support and atomic functions
-- Description: Creates verse_likes table, configures RLS, adds increment/decrement functions, and grants permissions.

-- 1. Create verse_likes table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.verse_likes (
  source text PRIMARY KEY,
  like_count bigint NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.verse_likes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read like counts
CREATE POLICY "Allow public read access"
  ON public.verse_likes FOR SELECT
  USING (true);

-- Create policy to allow everyone to insert/update like counts
CREATE POLICY "Allow public write access"
  ON public.verse_likes FOR ALL
  USING (true)
  WITH CHECK (true);

-- 2. Create increment_likes RPC function
CREATE OR REPLACE FUNCTION public.increment_likes(verse_source text)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count bigint;
BEGIN
  INSERT INTO public.verse_likes (source, like_count)
  VALUES (verse_source, 1)
  ON CONFLICT (source)
  DO UPDATE SET like_count = public.verse_likes.like_count + 1
  RETURNING like_count INTO new_count;
  
  RETURN new_count;
END;
$$;

-- 3. Create decrement_likes RPC function
CREATE OR REPLACE FUNCTION public.decrement_likes(verse_source text)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count bigint;
BEGIN
  INSERT INTO public.verse_likes (source, like_count)
  VALUES (verse_source, 0)
  ON CONFLICT (source)
  DO UPDATE SET like_count = greatest(0, public.verse_likes.like_count - 1)
  RETURNING like_count INTO new_count;
  
  RETURN new_count;
END;
$$;

-- 4. Grant table and function permissions to client roles
GRANT SELECT, INSERT, UPDATE ON public.verse_likes TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_likes(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.decrement_likes(text) TO anon, authenticated;
