# NLC Session Edge Function

This function bridges New Life Church Logto login to the app's Supabase RLS model.

Flow:
1. Frontend completes Logto PKCE login and receives a Logto access token.
2. Frontend calls `/functions/v1/nlc-session` with that access token.
3. The function verifies the token through Logto `userinfo`.
4. The function upserts `profiles` and `user_identities` with the Supabase service role.
5. The function returns a short-lived Supabase-compatible JWT signed with `NLC_SUPABASE_JWT_SECRET`.
6. Frontend recreates the Supabase client with that JWT, so RLS can resolve `current_profile_id()`.

Required Supabase Edge Function secrets:

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="..."
supabase secrets set NLC_SUPABASE_JWT_SECRET="..."
supabase secrets set NLC_LOGTO_ISSUER="https://sso.newlife.org.tw/oidc"
supabase secrets set NLC_MEMBER_HUB_URL="https://member.newlife.org.tw"
supabase secrets set APP_ORIGIN="https://bible.newlife.org.tw"
```

Deploy:

```bash
supabase functions deploy nlc-session
```

Important: `supabase/config.toml` sets `verify_jwt = false` for this function because the first token sent to the function is a Logto token, not a Supabase token. The function still verifies the Logto token itself before touching the database.
