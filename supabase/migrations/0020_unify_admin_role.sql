-- Retire the separate senior-pastor application role.
-- Existing accounts keep equivalent access by being converted to admin first.

UPDATE public.profiles
SET role = 'admin', updated_at = NOW()
WHERE role = 'senior_pastor';

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('member', 'group_leader', 'zone_leader', 'great_zone_leader', 'admin'));

COMMENT ON COLUMN public.profiles.role IS
  'Application role. Full-system access uses admin; organisation leaders retain scoped access.';
