# Step 17G: Account Controls and Auth UI

## Objective
Expose real account actions in the app so users can create/authenticate sessions and unlock authenticated API routes.

## Changes Applied

### 1. Auth service actions
- Extended `src/services/auth/supabaseAuth.ts` with:
  - `signInWithPassword(email, password)`
  - `signUpWithPassword(email, password)`
  - `sendMagicLink(email)`
  - `signOutSupabaseAuthSession()`
  - `getCurrentSupabaseAuthSession()`
- Session behavior:
  - Stores refreshed session tokens.
  - Updates API bearer token store automatically.
  - Maintains refresh lifecycle.

### 2. In-app account controls
- Updated `src/components/PremiumProfile.tsx`:
  - Added **Account Session** panel under Settings > Account & Privacy.
  - Added UI controls for:
    - Sign In (email/password)
    - Create Account
    - Send Magic Link
    - Sign Out
  - Shows signed-in/signed-out status.
  - Reloads app after sign-in/sign-out to rehydrate protected data quickly.

## Outcome
- Users can now authenticate directly from the app UI.
- Protected routes (`/api/me/*`, writes, AI protected endpoints) can be accessed with real sessions.
- Auth bootstrap + token transport + UI controls now form one end-to-end account path.
