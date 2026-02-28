# Step 17B: Frontend Strict Live UI

## Objective
Remove remaining frontend fallback generators/messages in active runtime paths so UI reflects only live data or explicit empty-state messaging.

## Changes Applied

### `src/components/PremiumWarsawDaily.tsx`
- Removed local fallback challenge and leaderboard builders.
- Challenge source now:
  - live payload (`weatherChallenge` / `wisdomChallenge`)
  - explicit "syncing" UI when unavailable
- Leaderboard source now:
  - live payload only
  - explicit "No live leaderboard entries yet" state when empty
- Preserved animation/layout/interaction behavior.

### `src/components/MorningBriefing.tsx`
- Replaced static narrative fallbacks with strict live/empty messaging:
  - weather/transit/city/tip/legal content now resolves from live payloads first
  - when unavailable, shows neutral "No live ... yet" messaging
- Updated footer note from static-fallback wording to `Live feed only`.

### Character Encoding Cleanup
- Removed mojibake degree symbol from home support challenge labels:
  - `api/_lib/data/homeSupportData.ts` now uses `°C`.
- Cleaned bullet separator mojibake in community card UI.

## Verification
- Run:
  - `npm run typecheck`
  - `npm run build`

## Notes
- This step does not yet move personality onboarding Groq calls fully server-side; that remains a dedicated follow-up to remove client-side fallback and key exposure.
