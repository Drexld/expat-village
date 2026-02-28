# Step 17D: Onboarding Strict-Live Mode

## Objective
Remove static onboarding AI fallbacks from active runtime and make onboarding depend on live backend AI responses.

## Changes Applied

### Backend strict-live onboarding
- Updated `api/_lib/data/onboardingData.ts`:
  - Removed static fallback quiz and fallback final banter generation.
  - If `GROQ_API_KEY` is missing, onboarding endpoints now return server error.
  - If Groq response is invalid/incomplete, onboarding endpoints now return server error.

### Frontend onboarding service strict mode
- Updated `src/services/onboarding/groqOnboarding.ts`:
  - Removed local fallback quiz/badge/banter generators.
  - `generateOnboardingContent` now throws when API unavailable or incomplete.
  - `generateFinalBanter` now throws when API unavailable or empty.

### Frontend UX error handling
- Updated `src/components/PersonalityOnboarding.tsx`:
  - Added `try/catch` around onboarding content generation.
  - Added `try/catch` around final banter generation.
  - Added explicit user feedback toast on API failures.
  - Added neutral fallback status text in result card when final banter call fails.

## Outcome
- Onboarding quiz and banter are now live-backend driven.
- Static generated onboarding business content is removed from active runtime path.
- Failures are surfaced as errors instead of silently switching to static data.
