# Step 17I: Home Live Status + Freshness Envelopes

## Objective
Remove remaining static Home promo messaging and drive Home status UI from backend freshness metadata.

## Changes Applied

### Backend freshness envelope support
- `api/_lib/security/types.ts`
  - Added `FreshnessMeta`.
  - Extended success envelope to optionally include `freshness`.
  - Added `HandlerResultWithFreshness<T>` for handlers that return payload + freshness.
- `api/_lib/security/response.ts`
  - `jsonOk` now accepts optional `freshness` and returns it in the API envelope.
- `api/_lib/security/middleware.ts`
  - Added detection for handler results shaped as `{ data, freshness }`.
  - Automatically maps those into standard success envelopes.

### Home endpoints now return freshness
- `api/_lib/data/pulseData.ts`
  - Added `getHomePulseBundleData()` returning:
    - `data: HomePulse`
    - `freshness: { source, updatedAt, ttlSeconds }`
  - `getHomePulseData()` now delegates to the bundle function.
- `api/pulse/home.ts`
  - Now returns bundle result (`data + freshness`) through secure middleware.
- `api/_lib/data/homeSupportData.ts`
  - Added `getHomeSupportBundleData()` returning:
    - `data: HomeSupportPayload`
    - `freshness: { source, updatedAt, ttlSeconds }`
  - `getHomeSupportData()` now delegates to the bundle function.
  - Included `created_at` in review prompt select for better freshness calculation.
- `api/home/support.ts`
  - Now returns bundle result (`data + freshness`) through secure middleware.

### Frontend API client + hooks
- `src/services/api/http.ts`
  - Added `apiRequestEnvelope<T>()` and `apiGetEnvelope<T>()` to preserve `freshness` from API responses.
- `src/services/api/repositories/homePulseRepository.ts`
  - Added `getHomePulseEnvelope()`.
- `src/services/api/repositories/homeRepository.ts`
  - Added `getHomeSupportPayloadEnvelope()`.
- `src/services/api/hooks/useHomePulse.ts`
  - Stores and exposes `freshness`.
- `src/services/api/hooks/useHomeSupport.ts`
  - Stores and exposes `freshness`.

### Home UI static promo removal
- `src/components/Home.tsx`
  - Removed static “COMPLETE AI BUILD” promo block.
  - Added live “POLAND LIVE FEEDS” status card:
    - Pulse feed freshness state
    - Home support freshness state
    - stale warning indicator when TTL is exceeded
  - Status text is fully English.
- `src/App.tsx`
  - Passes `homePulse.freshness` into `Home`.

## Verification
- `npm run typecheck` passed.
- `npm run build` passed.

## Notes
- This step enables operational visibility of feed freshness directly in Home.
- Next step should wire scheduled ingestion jobs and source connectors for Polish immigration/legal/transport/weather feeds with English-normalized output only.
