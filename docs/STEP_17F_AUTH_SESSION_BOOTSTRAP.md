# Step 17F: Auth Session Bootstrap

## Objective
Enable real-account session continuity so authenticated API routes can run live without manual token wiring.

## Changes Applied

### 1. Supabase auth session bootstrap service
- Added `src/services/auth/supabaseAuth.ts`:
  - Captures Supabase auth tokens from URL hash (`#access_token`, `#refresh_token`, `#expires_in`).
  - Persists session in local storage (`ev_auth_session`).
  - Hydrates API bearer token via `tokenStore`.
  - Refreshes expiring access tokens via Supabase Auth REST:
    - `POST /auth/v1/token?grant_type=refresh_token`
  - Clears invalid/expired sessions safely.
  - Removes token hash from URL after capture.

### 2. App startup integration
- Updated `src/main.tsx`:
  - Runs `bootstrapSupabaseAuthSession()` before rendering the app.
  - Guarantees token is available for API requests as early as possible.

## Outcome
- Existing `withSecurity(... requireAuth: true)` API routes can now be reached with a persisted real user session.
- Token refresh is automatic in the background.
- Session from magic-link/hash callbacks is consumed automatically.

## Notes
- This step does not add sign-in/sign-up UI yet; it enables session lifecycle once tokens are present.
- Next account step: explicit auth UI flows (email/password + magic link), sign-out action, and protected-route UX.
