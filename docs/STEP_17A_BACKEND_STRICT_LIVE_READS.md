# Step 17A: Backend Strict Live Reads

## Objective
Remove active backend fallback payloads so runtime behavior is strictly live-data or explicit empty state.

## Changes Applied

### `api/_lib/data/pulseData.ts`
- Removed hardcoded `fallbackHomePulse()` and `fallbackBriefing()` payloads.
- `/api/pulse/home` now returns:
  - live weather/exchange when present
  - neutral placeholders only for missing scalar fields
  - `highlights: []` when no live highlights exist
- `/api/briefing/today` now returns an explicit empty briefing (`cards: []`) when no live row exists.

### `api/_lib/data/homeSupportData.ts`
- Removed `fallbackPayload()` runtime dataset.
- `getHomeSupportData()` now always derives output from current live DB state:
  - no synthetic leaderboard/topic/preview injections
  - `activeCount` and `viewingCount` no longer forced to non-zero defaults
  - weather/wisdom challenge construction still works with empty task/weather inputs

### `api/_lib/data/communityData.ts`
- Removed fallback post catalog from read path.
- `getCommunityPostsData()` returns `[]` when no live posts exist.
- `createCommunityPostData()` now throws if persistence fails (no synthetic success object).

### `api/_lib/data/tasksData.ts`
- Removed fallback checklist dataset.
- `getChecklistTasksData()` returns empty categories/tasks when live tables are empty.

## Verification
- `npm run typecheck` passed.
- `npm run build` passed.

## Notes
- This step removes fake-live behavior.
- UX now depends on real seed/ingested data, so empty states are expected until data is populated.
