# Step 07: Marketplace Live Flows Migration

## Objective
Move marketplace listing, create, interest, and review flows to API-first runtime and remove active static fallback listing paths.

## Delivered
1. `src/services/api/hooks/useMarketplace.ts`
   - Removed in-hook static `fallbackListings` runtime dataset.
   - Enforced API-first behavior for write paths:
     - `createListing` now throws when API is not configured.
     - `expressInterest` now throws when API is not configured.
     - `submitReview` now throws when API is not configured.
   - Read flow now hydrates from backend only (or stays empty if unavailable).

2. `api/_lib/data/marketplaceData.ts`
   - Removed backend static listing fallback return path.
   - `getMarketplaceListingsData` now returns true empty list when no DB rows exist.
   - Removed fake success fallbacks for create listing/review when DB insert returns no row; now throws explicit errors.
   - Added anti-scam metadata fields to API mapping:
     - `aiScamSource`
     - `aiScamConfidence`

3. `src/services/api/types.ts`
   - Extended `MarketplaceListingSummary` with:
     - `aiScamSource: string`
     - `aiScamConfidence: number`

4. `src/components/Marketplace.tsx`
   - Removed preview-mode messaging for live write actions.
   - Added explicit non-live warning card when marketplace API is not connected.
   - Added explicit error card when listing feed fails.
   - Added default category taxonomy IDs so list-item modal remains usable even when feed is empty.

## Verification
- `npm run typecheck` passed
- `npm run build` passed

## Acceptance status for Step 07
- Marketplace feed and write flows are API-first.
- Active static listing fallback content removed from runtime paths.
- Empty/error/non-live states are explicit and user-visible.
