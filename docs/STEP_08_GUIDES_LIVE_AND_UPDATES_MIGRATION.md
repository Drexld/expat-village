# Step 08: Guides Live and Update Feed Migration

## Objective
Move Guides page to API-first runtime for guide feed + updates + voting, and remove active static fallback guide content.

## Delivered
1. `api/_lib/data/guidesData.ts`
   - Removed backend `FALLBACK_GUIDES` runtime dataset.
   - `getGuidesData()` now returns `[]` when no live guide rows exist.
   - `getGuideUpdatesFeed()` now returns `[]` when updates are unavailable instead of injecting static fallback updates.

2. `src/services/api/hooks/useGuides.ts`
   - Enforced API-first vote flow: `submitVote()` now throws when Guides API is not configured.

3. `src/components/EnhancedGuides.tsx`
   - Removed frontend `FALLBACK_GUIDES` runtime dataset.
   - Initializes `guides` with empty list and hydrates only from live API payload.
   - Removed fallback-by-title enrichment path.
   - Added `updatedAtIso` to mapped guide model and fixed "recent" sort to use real timestamps.
   - Upvote flow now optimistically updates UI, then requires backend vote success; reverts on failure.
   - Added explicit runtime status cards:
     - guides API not connected
     - guide feed load error

## Verification
- `npm run typecheck` passed
- `npm run build` passed

## Acceptance status for Step 08
- Guide feed and updates are API-first.
- Active static fallback guide content removed from runtime paths.
- Vote writes require backend success and are reverted on failure.
- Empty/non-live/error states are explicit and visible.
