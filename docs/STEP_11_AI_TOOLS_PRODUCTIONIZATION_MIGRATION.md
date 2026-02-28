# Step 11: AI Tools Productionization Migration

## Objective
Harden AI Tools to API-first production behavior for contract analysis, document analysis, and lawyer review requests under Polish law context.

## Delivered
1. `src/services/api/hooks/useAITools.ts`
   - Removed all local mock/fallback AI outputs.
   - Enforced strict API-first behavior:
     - `analyzeContract()` throws when AI API is not configured.
     - `analyzeDocument()` throws when AI API is not configured.
     - `requestLawyerReview()` throws when AI API is not configured.

2. `src/components/AITools.tsx`
   - Removed preview-mode success messaging.
   - Added explicit `LIVE` badge when AI API is connected.
   - Added explicit non-live warning card when AI backend is unavailable.
   - Replaced toast labels that contained encoding artifacts with clean text.

3. `api/_lib/data/aiData.ts`
   - Enforced persistence guarantees for AI write flows:
     - `analyzeContractData()` now throws internal error if analysis row is not persisted.
     - `analyzeDocumentData()` now throws internal error if analysis row is not persisted.
     - `requestLawyerReviewData()` now throws internal error if request row is not persisted.
   - Polish-law analysis context remains enforced (`legalFramework: 'PL'`) in contract analysis flow.

4. `api/_lib/validation/contracts.ts`
   - Strengthened contract analysis request validation:
     - requires at least one of `documentText` or `documentUrl`.
   - Strengthened lawyer request validation:
     - requires at least one contact channel (`contactEmail` or `contactPhone`).
     - validates email shape (`@`) when provided.

## Verification
- `npm run typecheck` passed
- `npm run build` passed

## Acceptance status for Step 11
- AI tools are API-first (no active fallback analysis payloads).
- Contract and document analyses are persisted-or-fail.
- Lawyer request flow is persisted-or-fail.
- Polish-law context remains active in contract analyzer output.
- AI Tools screen now clearly indicates live/non-live runtime status.
