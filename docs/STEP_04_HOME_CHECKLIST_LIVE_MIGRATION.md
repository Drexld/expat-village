# Step 04: Home + Checklist Live Migration (Phase 1)

## Objective
Remove active runtime static business-content fallback from Home pulse/journey/checklist and keep only API data + explicit empty states.

## Delivered
1. `src/components/PremiumDailyPulse.tsx`
   - Removed static AI card fallback payloads.
   - Removed static city highlight defaults.
   - Replaced static weather/exchange display defaults with neutral placeholders (`--`) until live data arrives.
   - Added explicit "no live AI brief items yet" empty state.

2. `src/components/PremiumJourney.tsx`
   - Removed hardcoded fallback milestone (`PESEL` static payload).
   - Removed mojibake characters and replaced tier badge rendering with clean text tokens.
   - Uses `journeyData` as source-of-truth; shows explicit empty states when milestone/subtasks are unavailable.
   - Journey map modal now reflects live milestone availability.

3. `src/components/EnhancedChecklist.tsx`
   - Removed static fallback task catalog from active runtime path.
   - Removed enrichment that injected static location/service data.
   - Initializes with empty task list and populates only from API.
   - Added explicit empty state card when no live tasks exist.
   - Blocks task completion when checklist is not live, to avoid fake local progress.

## Validation
- `npm run typecheck` passed
- `npm run build` passed

## Notes
- Checklist write persistence (`/api/tasks/:id/status`) still requires authenticated user context.
- Remaining static content in other Home cards (e.g. `PremiumWarsawDaily`, `PremiumCommunityCards`) is tracked for subsequent steps.
