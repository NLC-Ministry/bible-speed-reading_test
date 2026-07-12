-- Migration 0011: Decouple leader responsibility scope from personal profile fields
-- Add dedicated managed_* columns to public.profiles table

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS managed_regions TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS managed_zones TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS managed_groups TEXT NOT NULL DEFAULT '';

-- Update RLS and database defense function to protect these new privileged fields
CREATE OR REPLACE FUNCTION public.protect_profile_privileged_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  actor_id UUID;
  actor_role TEXT;
BEGIN
  IF COALESCE(auth.role(), '') <> 'authenticated' THEN
    RETURN NEW;
  END IF;

  SELECT p.id, p.role
  INTO actor_id, actor_role
  FROM public.profiles p
  WHERE p.auth_user_id = auth.uid()
  LIMIT 1;

  IF actor_role IN ('admin', 'senior_pastor') THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NEW.role <> 'member'
       OR NEW.is_demo <> FALSE
       OR NEW.is_active <> TRUE
       OR NEW.nlc_member_id IS NOT NULL
       OR NEW.managed_regions <> ''
       OR NEW.managed_zones <> ''
       OR NEW.managed_groups <> ''
       OR (NEW.auth_user_id IS NOT NULL AND NEW.auth_user_id IS DISTINCT FROM auth.uid()) THEN
      RAISE EXCEPTION 'privileged profile fields cannot be supplied by a member'
        USING ERRCODE = '42501';
    END IF;
  ELSE
    IF NEW.id IS DISTINCT FROM OLD.id
       OR NEW.role IS DISTINCT FROM OLD.role
       OR NEW.is_demo IS DISTINCT FROM OLD.is_demo
       OR NEW.is_active IS DISTINCT FROM OLD.is_active
       OR NEW.auth_user_id IS DISTINCT FROM OLD.auth_user_id
       OR NEW.nlc_member_id IS DISTINCT FROM OLD.nlc_member_id
       OR NEW.managed_regions IS DISTINCT FROM OLD.managed_regions
       OR NEW.managed_zones IS DISTINCT FROM OLD.managed_zones
       OR NEW.managed_groups IS DISTINCT FROM OLD.managed_groups THEN
      RAISE EXCEPTION 'privileged profile fields can only be changed by an administrator'
        USING ERRCODE = '42501';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;
