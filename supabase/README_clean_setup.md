# Supabase clean database setup

This folder now contains the clean baseline schema for a fresh Supabase project.

## What changed

Legacy test-period migrations were moved to:

- `supabase/migrations_legacy/`

The active migration folder now starts from a clean schema:

- `supabase/migrations/0001_clean_schema.sql`

Use this for a new Supabase project instead of replaying old test migrations.

## Recommended reset flow

1. Create a new Supabase project.
2. Configure Auth providers / OIDC before public launch.
3. Apply `supabase/migrations/0001_clean_schema.sql`.
4. Update Vercel environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `NLC_CLIENT_ID`
   - `NLC_LOGTO_ISSUER`
   - `NLC_MEMBER_HUB_URL`
   - `NLC_SCOPES`
5. Redeploy without build cache.

## Core design

- `profiles` is the stable app user record.
- `user_identities` links login methods to one profile.
- `reading_plans`, `reading_logs`, and `devotional_notes` always belong to `profiles.id`.
- RLS resolves the current user through `current_profile_id()`.

This prevents data loss when a user changes login method, for example from Google to NLC Logto.

## First admin

After first login, promote the first real admin manually in Supabase SQL Editor:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-admin-email@example.com';
```

If the profile has no email, inspect users with:

```sql
SELECT id, name, email, role, created_at
FROM public.profiles
ORDER BY created_at DESC;
```

## Useful checks

```sql
SELECT *
FROM public.profile_identity_overview
ORDER BY name, provider;
```

```sql
SELECT *
FROM public.member_reading_summary
ORDER BY name;
```
