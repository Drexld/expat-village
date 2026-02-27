# Step 05: Community Feed and Composer Live Migration

## Objective
Move community feed and write flows to API-first runtime and remove active static fallback post content.

## Delivered
1. `src/services/api/hooks/useCommunity.ts`
   - Removed local fake post creation fallback.
   - `createPost`, `reactToPost`, and `addComment` now throw when API is not configured instead of silently no-op/local fallback.

2. `src/components/WarsawWhisperNetwork.tsx`
   - Removed `FALLBACK_POSTS` static dataset from active runtime.
   - Feed now initializes empty and hydrates from live API data only.
   - Removed fallback mapping logic (`fallbackByTitle` and fallback-dependent field mapping).
   - Kept optimistic UI for create/like/join, with rollback on API failure.
   - Added explicit states:
     - live feed error state
     - empty feed state

## Verification
- `npm run typecheck` passed
- `npm run build` passed

## Acceptance status for Step 05
- Community feed is API-first.
- Composer/reaction/comment paths require backend success to persist.
- Static fallback post content removed from normal runtime path.
