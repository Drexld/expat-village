# Step 14: Home Supporting Cards Live Migration

## Objective
Migrate Home supporting cards from local static content to live backend payloads:
- `PremiumWarsawDaily`
- `PremiumCommunityCards`
- context-aware Quick Actions

## Scope Implemented

### Frontend
- Added new hook: `src/services/api/hooks/useHomeSupport.ts`
- Added new repository: `src/services/api/repositories/homeRepository.ts`
- Added Home support API types in `src/services/api/types.ts`
- Updated `src/components/Home.tsx`:
  - pulls live Home support payload
  - wires Warsaw Daily card data from API
  - wires Town Hall/Hot Topics snippets from API
  - renders quick actions from API recommendations (no static runtime array)
- Reworked `src/components/PremiumWarsawDaily.tsx`:
  - accepts live weather/wisdom challenge + leaderboard props
  - preserves UI behavior and answer flow
- Reworked `src/components/PremiumCommunityCards.tsx`:
  - accepts live Town Hall and Hot Topics props
  - preserves premium card style and interaction states

### Backend/API
- Added data aggregator: `api/_lib/data/homeSupportData.ts`
  - builds Warsaw Daily challenges from live weather/tasks
  - builds leaderboard from `user_profiles` + `users`
  - builds Town Hall previews from `community_posts` + `community_comments`
  - builds hot topics from community keyword trends
  - builds context-aware quick actions from pending tasks/community/review prompts
- Added route: `GET /api/home/support`
  - file: `api/home/support.ts`

### Hook Exports
- Updated `src/services/api/hooks/index.ts` to export `useHomeSupport`.

## Data Sources Used
- `weather_snapshots`
- `tasks`
- `user_task_status`
- `user_profiles`
- `users`
- `community_posts`
- `community_comments`
- `review_prompts`

## Verification
- Run:
  - `npm run typecheck`
  - `npm run build`

## Notes
- No new database migration was required for Step 14 because Home support payload is derived from existing live tables.
- API returns fallback payload only when core tables are empty/unavailable, so UI remains stable during bootstrap.

