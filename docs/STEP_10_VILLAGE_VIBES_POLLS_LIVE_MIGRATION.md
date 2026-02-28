# Step 10: Village Vibes Polls Live Migration

## Objective
Move Village Vibes polling to API-first runtime, remove active fallback poll data, and enforce one-vote-per-user lock per poll.

## Delivered
1. `api/_lib/data/pollsData.ts`
   - Removed backend fallback poll payloads from runtime path.
   - `getActivePollsData()` now returns real empty array when no polls/options are available.
   - Reworked `votePollData()` to enforce vote lock:
     - validates option belongs to poll
     - checks if user already voted in the poll
     - inserts vote once (no upsert overwrite)
     - returns `ok | already_voted | invalid_option`

2. `api/polls/[id]/vote.ts`
   - Added strict handling for new vote outcomes:
     - invalid option -> `BAD_REQUEST`
     - already voted -> `BAD_REQUEST`

3. `src/services/api/hooks/usePolls.ts`
   - Removed frontend fallback poll dataset.
   - Poll feed now hydrates only from live API.
   - `submitVote()` now throws when API is not configured.
   - `submitVote()` now requires poll data to be loaded before optimistic mutation.

4. `src/components/VillageVibes.tsx`
   - Removed preview-mode vote success messaging.
   - Added `LIVE` badge when polls feed is connected.
   - Added explicit non-live state card when polls API is not connected.
   - Added explicit feed error state card.

## Verification
- `npm run typecheck` passed
- `npm run build` passed

## Acceptance status for Step 10
- Poll feed and vote flow are API-first.
- Active fallback poll content removed from runtime paths.
- Vote lock per user/poll is enforced backend-side.
- Non-live/error states are explicit in Village Vibes UI.
