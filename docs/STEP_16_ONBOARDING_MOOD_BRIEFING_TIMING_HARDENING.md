# Step 16: Onboarding + Mood + Briefing Timing Hardening

## Objective
Make onboarding and daily modal behavior deterministic across sessions/devices by moving state authority to backend profile/preferences, while keeping local cache for immediate UX.

## Scope Implemented

### Frontend
- Updated `src/App.tsx`:
  - Added Warsaw-time date key helper (`Europe/Warsaw`) for daily window checks.
  - Uses backend profile onboarding state as source of truth.
  - Keeps `sessionStorage` cache for fast startup UX.
  - Morning briefing trigger:
    - once per day
    - morning window `05:00-11:59` Warsaw
  - Mood check trigger:
    - once per day
    - noon window `12:00-14:59` Warsaw
  - Dismiss/update actions now persist seen dates through preferences API.
  - On onboarding completion:
    - writes local cache immediately
    - syncs `displayName`, `tribe`, `interest`, `onboardingCompleted` to backend profile.

### API Contracts + Types
- Updated `src/services/api/types.ts`:
  - `MeProfile`: added `tribe`, `interest`, `onboardingCompleted`
  - `MePreferences`: added `morningBriefingSeenDate`, `moodCheckSeenDate`
- Updated `src/services/api/repositories/meRepository.ts`:
  - `UpdateMeProfileInput`: supports `tribe`, `interest`, `onboardingCompleted`
  - `UpdateMePreferencesInput`: supports `morningBriefingSeenDate`, `moodCheckSeenDate`
- Updated `src/services/api/hooks/useMeProfileProgress.ts`:
  - expanded `saveProfile` / `savePreferences` input signatures to include new fields.

### Backend Data + Validation
- Updated `api/_lib/validation/contracts.ts`:
  - `validateMeProfileUpdate` now validates `tribe`, `interest`, `onboardingCompleted`
  - `validateMePreferencesUpdate` now validates modal seen date fields
- Updated `api/_lib/data/meData.ts`:
  - `getMeProfileData`: returns `tribe`, `interest`, `onboardingCompleted`
  - `updateMeProfileData`: persists onboarding fields in `users`
  - `getMePreferencesData`: returns modal seen date fields
  - `updateMePreferencesData`: persists modal seen date fields in `user_preferences`

### Database Migration
- Added `supabase/migrations/20260228_000009_onboarding_timing_state.sql`:
  - `user_preferences.morning_briefing_seen_on date`
  - `user_preferences.mood_check_seen_on date`

## Verification
- Run:
  - `npm run typecheck`
  - `npm run build`

## Notes
- This step intentionally keeps local cache keys, but backend values override cache when available.
- Endpoints remain auth-guarded; without auth token, backend sync calls can fail and local cache still preserves UX continuity.
