# Step 14: QA Gates, Staging Rollout, and Production Release

## Objective
Ship the current live-migrated app safely to production with explicit go/no-go gates, controlled rollout, and rollback readiness.

## Scope
- Frontend (Vite React PWA) on Vercel
- Backend APIs and database migrations
- Critical live modules:
  - Home pulse + briefing
  - Checklist
  - Guides
  - Directory + reviews
  - Community
  - AI tools (including lawyer request flow)
  - Marketplace
  - Student hubs
  - Vibes polls
  - Profile/Journey

## Release Gates (must all pass)

### Gate 1: Build and type safety
- `npm run typecheck`
- `npm run build`

Pass criteria:
- No type errors in active runtime code
- Production build completes

### Gate 2: PWA readiness
- `manifest.webmanifest` validates
- Service worker registration succeeds
- Offline fallback page renders when network is unavailable

Pass criteria:
- Install prompt available on mobile-supported browsers
- Offline navigation degrades gracefully

### Gate 3: API and data freshness
- Home pulse endpoint returns weather/fx/transit/immigration/legal data
- Daily briefing endpoint returns current briefing card payload
- Freshness metadata present (`updatedAt`, source/TTL where applicable)

Pass criteria:
- No critical card remains static-only in active runtime path
- Stale-feed behavior visibly communicates fallback state

### Gate 4: Core write flows
- Checklist task status updates persist
- Community post/reaction/comment writes persist
- Directory review submit persists
- AI contract analysis + lawyer request persist

Pass criteria:
- Data survives refresh and session restart
- API failures show controlled toast and rollback optimistic UI safely

### Gate 5: UX regression checks
- Navigation bar alignment and active states
- Morning briefing open/dismiss behavior
- Mood check schedule behavior
- Mobile layout and safe-area spacing
- Motion transitions remain intact

Pass criteria:
- No visual regressions in baseline screens
- No blocking console errors from app runtime

## Staging Rollout Plan
1. Deploy `main` to Vercel Preview.
2. Run full smoke tests on desktop + at least one physical phone.
3. Validate backend environment variables in Preview.
4. Freeze schema changes during final regression window.
5. Promote Preview to Production only after all gates pass.

## Production Rollout Plan
1. Create release tag.
2. Deploy to Vercel Production.
3. Run post-deploy smoke suite:
   - App loads
   - PWA install works
   - Home pulse live data visible
   - One write action per key module succeeds
4. Monitor first 60 minutes for:
   - API error spikes
   - failed ingestion jobs
   - service worker failures

## Rollback Plan
- Trigger Vercel rollback to previous healthy deployment.
- If migration-related issue:
  - disable affected feature flag/module route (if available)
  - keep read-only fallback where needed
- Restore service to last-known-good state before reattempting release.

## Exit Criteria for Step 14
- All release gates passed
- Staging signoff recorded
- Production deployment completed
- Rollback instructions validated and available
