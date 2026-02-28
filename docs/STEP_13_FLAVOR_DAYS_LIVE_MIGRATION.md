# Step 13: Flavor Days Live Migration

## Objective
Move Flavor Days from local generated service data to live backend APIs with persisted check-ins, activity feed, challenge progress, and leaderboard state.

## Scope Implemented

### Frontend
- Replaced local generator usage in `src/components/FlavorDays.tsx` with API hook runtime.
- Added live/non-live/error/loading states in Flavor Days UI.
- Added live check-in action per restaurant to trigger backend persistence and refresh feed data.

### API Client Layer
- Added Flavor contracts in `src/services/api/types.ts`:
  - `FlavorDayBundle`
  - `FlavorDaySummary`
  - `FlavorRestaurantSummary`
  - `FlavorActivitySummary`
  - `FlavorChallengeSummary`
  - `FlavorLeaderboardEntry`
  - `FlavorCheckinInput`
  - `FlavorCheckinResult`
- Added repository:
  - `src/services/api/repositories/flavorRepository.ts`
    - `getFlavorDayBundle()`
    - `getFlavorLeaderboard()`
    - `checkInFlavorRestaurant()`
- Added hook:
  - `src/services/api/hooks/useFlavorDays.ts`
- Exported hook from:
  - `src/services/api/hooks/index.ts`

### Backend/API
- Added data domain:
  - `api/_lib/data/flavorData.ts`
    - `getFlavorDayBundleData()`
    - `getFlavorLeaderboardData()`
    - `checkInFlavorRestaurantData()`
- Added routes:
  - `GET /api/flavor/day` -> `api/flavor/day.ts`
  - `GET /api/flavor/leaderboard` -> `api/flavor/leaderboard.ts`
  - `POST /api/flavor/checkin` -> `api/flavor/checkin.ts`
- Added validation:
  - `validateFlavorCheckin` in `api/_lib/validation/contracts.ts`

### Database
- Added migration:
  - `supabase/migrations/20260228_000008_flavor_days_live.sql`
- New tables:
  - `flavor_days`
  - `flavor_restaurants`
  - `flavor_activity_feed`
  - `flavor_challenges`
  - `flavor_user_challenge_progress`
  - `flavor_leaderboard`
  - `flavor_checkins`
- Includes:
  - RLS policies
  - updated_at triggers
  - baseline seed content

## Required Next Action
- Run migration:
  - `supabase/migrations/20260228_000008_flavor_days_live.sql`

## Validation
- Run:
  - `npm run typecheck`
  - `npm run build`

