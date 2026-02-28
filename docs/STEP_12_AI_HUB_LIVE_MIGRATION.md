# Step 12: AI Hub Live Migration

## Objective
Replace local AI Hub generators in active runtime with API-backed live data and persist user-specific AI Hub snapshots server-side.

## Scope Implemented

### Frontend
- Converted `src/components/AIIntelligenceHub.tsx` to consume live API data through hook-based runtime.
- Removed direct runtime dependency on `src/services/ai/expatVillageAI.ts` from AI Hub UI.
- Added explicit non-live, loading, and error states.
- Added live scenario re-analysis flow for Advisor tab.

### API Client Layer
- Added AI Hub types in `src/services/api/types.ts`:
  - `AIHubBundle`
  - `AIHubDecisionAdvice`
  - `AIHubAdvisorInput`
  - and related sub-types.
- Extended `src/services/api/repositories/aiRepository.ts`:
  - `getAIHubBundle()` -> `GET /api/ai/hub`
  - `analyzeAIHubScenario()` -> `POST /api/ai/hub/advisor`
- Added hook `src/services/api/hooks/useAIHub.ts`:
  - periodic refresh support
  - live status tracking
  - scenario analysis mutation
- Exported new hook from `src/services/api/hooks/index.ts`.

### Backend/API
- Added AI Hub data domain: `api/_lib/data/aiHubData.ts`
  - Generates AI Hub bundle payload
  - Supports advisor re-analysis
  - Persists snapshots for authenticated users
  - Reads persisted snapshots when available
- Added endpoints:
  - `api/ai/hub/index.ts` (`GET`)
  - `api/ai/hub/advisor.ts` (`POST`)
- Added request validation:
  - `validateAIHubAdvisor` in `api/_lib/validation/contracts.ts`

### Database
- Added migration:
  - `supabase/migrations/20260228_000007_ai_hub_snapshots.sql`
- New table:
  - `public.ai_hub_snapshots`
  - unique key `(user_id, module)`
  - JSON snapshot payload, confidence, source, TTL
  - RLS enabled with self-access policy

## Verification
- `npm run typecheck` passes.
- `npm run build` passes.

## Required Next Action
- Run the new migration in Supabase:
  - `supabase/migrations/20260228_000007_ai_hub_snapshots.sql`

## Notes
- AI Hub personalization persistence is active for authenticated users.
- Unauthenticated users still receive live API-generated hub payload, but persistence is not user-bound without auth.

