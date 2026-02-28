# Step 17C: Onboarding AI API Migration

## Objective
Move personality onboarding AI generation from browser-side Groq calls to secured backend API routes, and keep the onboarding UX operational with controlled fallback behavior.

## What Changed

### 1. New backend onboarding AI endpoints
- Added `POST /api/ai/onboarding/content`
  - File: `api/ai/onboarding/content.ts`
  - Security wrapper: `withSecurity`
  - Validation: `validateOnboardingContent`
  - Rate limit policy: `RATE_LIMIT_POLICIES.ai`

- Added `POST /api/ai/onboarding/final-banter`
  - File: `api/ai/onboarding/final-banter.ts`
  - Security wrapper: `withSecurity`
  - Validation: `validateOnboardingFinalBanter`
  - Rate limit policy: `RATE_LIMIT_POLICIES.ai`

### 2. Backend onboarding AI data service
- Added `api/_lib/data/onboardingData.ts`
  - Server-side Groq call via `GROQ_API_KEY`.
  - Strict JSON extraction + quiz normalization for content generation.
  - Final banter generation for quiz completion.
  - Controlled server fallback if key/provider is unavailable.

### 3. Request validation contracts
- Updated `api/_lib/validation/contracts.ts`:
  - `validateOnboardingContent`
  - `validateOnboardingFinalBanter`

### 4. Frontend API repository + type contracts
- Added `src/services/api/repositories/onboardingRepository.ts`.
- Exported from `src/services/api/repositories/index.ts`.
- Added onboarding API types in `src/services/api/types.ts`:
  - `OnboardingContentInput`
  - `OnboardingContent`
  - `OnboardingQuizQuestion`
  - `OnboardingFinalBanterInput`
  - `OnboardingFinalBanterResult`

### 5. Removed browser-side Groq usage
- Refactored `src/services/onboarding/groqOnboarding.ts`:
  - No direct calls to Groq from browser.
  - Calls backend onboarding endpoints instead.
  - Local fallback retained only for resilience when API is unavailable.

### 6. Encoding cleanup in onboarding UI
- Updated `src/components/PersonalityOnboarding.tsx`:
  - Replaced corrupted emoji literals with Unicode escape sequences.
  - Replaced corrupted bullet separator with ASCII `-`.

## Security/Operational Impact
- Groq API key is no longer required in browser runtime for onboarding flow.
- Server-side validation and rate limiting now guard onboarding AI inputs.
- Backends can be audited and rotated without exposing provider keys client-side.

## Remaining Requirement to be fully live
- Set `GROQ_API_KEY` in Vercel for true live AI generation.
- Without that key, fallback onboarding responses are returned by design.
