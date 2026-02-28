# Step 17E: Auth Transport and PWA Hardening

## Objective
Reduce static-feel behavior caused by unauthorized API calls and mobile shell overlap issues by hardening auth transport and PWA runtime behavior.

## Changes Applied

### 1. API auth token transport baseline
- Added `src/services/auth/tokenStore.ts`:
  - `getAccessToken()`
  - `setAccessToken(token)`
  - `clearAccessToken()`
- Updated `src/services/api/http.ts`:
  - Automatically adds `Authorization: Bearer <token>` when token exists.
  - Keeps manual authorization override if already provided.

### 2. Mobile/PWA safe-area hardening
- Updated `index.html` viewport:
  - Added `viewport-fit=cover` for proper iOS/standalone safe area handling.
- Updated `src/components/Navigation.tsx`:
  - Bottom padding now uses `env(safe-area-inset-bottom)`.
- Updated `src/App.tsx` main container:
  - Bottom padding now accounts for nav height + safe-area inset.

### 3. Service worker API cache safety
- Updated `public/sw.js`:
  - Authenticated `/api/*` requests (with `Authorization` header) are now **network-only**.
  - These responses are no longer cached to avoid stale/cross-user behavior.
  - Public unauthenticated API requests remain network-first with cache fallback.

## Outcome
- App is prepared for live auth token propagation to backend APIs.
- Mobile standalone layout is safer around notch/home-indicator areas.
- Authenticated API flows are protected from service-worker stale cache contamination.
