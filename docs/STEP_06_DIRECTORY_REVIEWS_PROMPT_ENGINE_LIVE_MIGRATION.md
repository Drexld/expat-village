# Step 06: Directory + Reviews + Prompt Engine Live Migration

## Objective
Move Warsaw Concierge directory/check-in/review flows to API-first runtime and add pending review prompts after service check-ins.

## Delivered
1. `api/_lib/data/servicesData.ts`
   - Added `ReviewPromptRow` and `ReviewPromptSummary` types.
   - Added `getPendingReviewPromptsData(userId)` query for unresolved prompts.
   - Removed active runtime static directory fallback injection.

2. `api/review-prompts/pending.ts`
   - Added authenticated endpoint: `GET /api/review-prompts/pending`.
   - Returns pending prompts for the current user only.

3. `src/services/api/types.ts`
   - Added `ReviewPromptSummary` frontend contract.

4. `src/services/api/repositories/servicesRepository.ts`
   - Added `getPendingReviewPrompts()` repository call.

5. `src/services/api/hooks/useServices.ts`
   - Added `loadPendingReviewPrompts()` to hook API.
   - Enforced API-first writes (`checkIn`, `loadReviews`, `submitReview`) with explicit errors when API is not configured.
   - Added `fetchList` option so screens can consume prompt/review APIs without forcing service-list polling.

6. `src/components/PremiumDirectory.tsx`
   - Removed active static fallback business catalog from runtime path.
   - Hydrates directory business cards from live service summaries.
   - Added pending review prompt reminder card.
   - Added explicit directory feed error state.
   - Check-in now creates prompt flow via backend and refreshes pending prompts.
   - Review submit path is backend-only with persisted ranking update behavior.

7. `src/components/Home.tsx`
   - Added pending review prompt count reminder card.
   - Uses `useServices({ fetchList: false })` so Home can query prompt counts without directory list polling.

## Verification
- `npm run typecheck` passed
- `npm run build` passed

## Acceptance status for Step 06
- Directory list, check-in, reviews, and prompt reminders are API-first.
- Static directory fallback content is removed from active runtime flow.
- Pending review prompts are surfaced in both Directory and Home.
