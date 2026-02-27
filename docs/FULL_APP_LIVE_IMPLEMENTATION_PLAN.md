# Full App Live Implementation Plan

## Objective
Convert Expat Village from mixed static/fallback UI to a fully live production app, page by page and section by section, with backend persistence, live feeds, and production AI workflows.

## Non-Negotiables
- No business-content static arrays in active runtime paths after final cutover.
- All cards must load from API-backed data or explicit empty states.
- All write actions (vote, review, post, task update, AI request) must persist.
- Existing design system, motion behavior, and layout must stay visually consistent.
- PWA install and runtime must remain stable on iOS and Android.

## Runtime Scope (Active Paths)
- App shell: `src/App.tsx`
- Home tab: `src/components/Home.tsx` + `PremiumHeader`, `PremiumDailyPulse`, `PremiumJourney`, `PremiumWarsawDaily`, `PremiumCommunityCards`
- Checklist tab: `src/components/EnhancedChecklist.tsx`
- Discover tab: `src/components/Discover.tsx` + `AITools`, `Marketplace`, `PremiumDirectory`, `EnhancedGuides`, `StudentHubs`, `VillageVibes`, `AIIntelligenceHub`, `FlavorDays`
- Community tab: `src/components/WarsawWhisperNetwork.tsx`
- Profile tab: `src/components/PremiumProfile.tsx`
- Modals/onboarding/voice: `MorningBriefing`, `MoodCheck`, `VoiceBubble`, `PersonalityOnboarding`
- API layer: `src/services/api/**/*`
- AI/local engines: `src/services/ai/*`, `src/services/onboarding/groqOnboarding.ts`, `src/services/flavorDays/service.ts`
- PWA: `index.html`, `public/manifest.webmanifest`, `public/sw.js`, `src/main.tsx`

## Current Audit Summary (What Is Still Static/Fallback)
1. Home
- `PremiumHeader`: notification list and greeting variants are local.
- `PremiumDailyPulse`: fallback AI cards still local when pulse highlights absent.
- `PremiumJourney`: fallback milestone and map payload.
- `PremiumWarsawDaily`: game content and leaderboard local.
- `PremiumCommunityCards`: local previews.

2. Checklist
- `EnhancedChecklist`: local fallback task catalog and category defaults.
- Some actions are local-only (buddy flow, AR map action, voice guide content).

3. Discover
- `AITools`: live hook exists, but fallback mock analysis/lawyer request exists in hook.
- `Marketplace`: hook has fallback listing catalog and local create/review behavior.
- `PremiumDirectory`: fallback business catalog plus local map/enrichment fields.
- `EnhancedGuides`: fallback guide catalog.
- `StudentHubs`: fallback universities/events/roommates + local discounts/groups arrays.
- `VillageVibes`: fallback poll payload.
- `AIIntelligenceHub`: fully local generated AI data.
- `FlavorDays`: fully local generated service/activity/challenge data.

4. Community
- `WarsawWhisperNetwork`: fallback post array and UI enrichments.

5. Profile
- `PremiumProfile`: fallback badges/journey/connections/insights arrays.
- `PremiumJourney`: text contains mojibake symbols from encoding corruption.

6. Cross-cutting
- `MorningBriefing`: mixes live props with static fallback statements.
- `MoodCheck` timing is session/local logic only.
- `PersonalityOnboarding`: direct Groq client-side fallback model.
- Several files show mojibake (e.g., `ðŸ...`) causing question-mark glyphs on device.
- API hooks depend on `VITE_API_BASE_URL`; no backend implementation is present in this repo.

## Backend/API Target

### Existing Contracts (already defined in frontend repositories)
- `/api/pulse/home`
- `/api/briefing/today`
- `/api/tasks`, `/api/tasks/:id/status`
- `/api/guides`, `/api/guides/updates/feed`, `/api/guides/:id/vote`
- `/api/services`, `/api/services/:id/checkin`, `/api/services/:id/reviews`
- `/api/marketplace/listings`, `/api/marketplace/listings/:id/interest`, `/api/marketplace/listings/:id/reviews`
- `/api/community/posts`, `/api/community/posts/:id/comments`, `/api/community/posts/:id/reactions`
- `/api/student/universities`, `/api/student/universities/:id/join`, `/api/student/events`, `/api/student/roommates`, `/api/student/roommates/swipe`
- `/api/polls/active`, `/api/polls/:id/vote`
- `/api/me`, `/api/me/profile`, `/api/me/progress`
- `/api/ai/contract/analyze`, `/api/ai/document/analyze`, `/api/ai/contract/lawyer-request`

### Required Additions for Full Live Coverage
- `/api/ai/hub/*` for Predictive, DNA, Advisor, Coach, Luck, Shadow, Student AI cards.
- `/api/flavor/*` for flavor day, restaurants, activity, challenges, leaderboard.
- `/api/review-prompts/pending` for post-checkin review nudges.
- `/api/news/immigration`, `/api/news/transport`, `/api/news/legal-parliament` for audit/debug and freshness checks.
- `/api/meta/freshness` optional endpoint for dashboard and ops monitoring.

### Data Layer
- Use `supabase/migrations/20260212_000001_initial_schema.sql` as baseline.
- Add follow-up migrations for missing entities:
  - ai_hub_signals
  - flavor_day_rotation, flavor_partners, flavor_activity, flavor_challenges, flavor_leaderboard
  - review_prompt_jobs and prompt delivery state
  - ingestion_runs (source, started_at, completed_at, status, records_count, error)

## Cross-Cutting Technical Workstreams

### Workstream A: Platform and Auth
- Implement backend runtime (Vercel Functions or Edge handlers) for `/api/*`.
- Connect authenticated user context from Supabase JWT in API handlers.
- Add request auth in frontend API client (`Authorization` bearer), with safe unauth mode for preview if needed.
- Add consistent error envelope and freshness metadata in responses.

### Workstream B: Ingestion and Freshness
- Scheduled jobs for:
  - immigration updates
  - transit disruptions
  - legal/parliament updates
  - weather snapshots
  - FX rates
  - guides updates
- Stamp each feed with `updatedAt`, `source`, `ttlSeconds`.
- Expose stale state in UI badges if TTL exceeded.

### Workstream C: Encoding and Content Quality
- Enforce UTF-8 and replace mojibake content (`ðŸ...`) with valid symbols or text.
- Replace symbol-dependent UI markers with Lucide icons where possible.
- Add lint/check script to detect replacement characters and mojibake patterns before release.

### Workstream D: Fallback Policy
- Keep fallback only for explicit offline mode and true API failure.
- Remove fallback as default initialization path in active runtime components.
- Add user-visible stale/offline labels when fallback is used.

## Step-by-Step Execution Plan

### Step 01: Backend Runtime Skeleton
- Create `/api/*` handlers matching current repository contracts.
- Return typed envelopes compatible with `src/services/api/types.ts`.
- Done when every existing repository call returns 200 in local dev.

### Step 02: Auth and Me Domain
- Implement `/api/me`, `/api/me/profile`, `/api/me/progress`.
- Wire profile save path from `PremiumProfile` and onboarding completion.
- Done when refresh preserves profile/bio/progress from backend.

### Step 03: Home Pulse + Briefing Feeds
- Implement `/api/pulse/home` and `/api/briefing/today` from DB snapshots.
- Integrate ingestion freshness metadata.
- Done when Home pulse cards render from API only and show freshness.

### Step 04: Checklist Live Migration
- Implement `/api/tasks` and `/api/tasks/:id/status`.
- Replace `EnhancedChecklist` fallback task path with backend data for normal runtime.
- Keep only empty-state UI when no tasks exist.
- Done when task completion persists and survives reload.

### Step 05: Community Feed and Composer
- Implement community posts/comments/reactions endpoints with sorting/filtering.
- Replace `FALLBACK_POSTS` usage in normal runtime.
- Done when create/like/join thread all persist and counts round-trip.

### Step 06: Directory + Reviews + Prompt Engine
- Implement services list, check-in, reviews endpoints.
- Add review prompt creation after successful check-in.
- Surface pending prompt card on Home/Profile (or notifications).
- Done when check-in triggers review prompt and review affects score/ranking.

### Step 07: Marketplace Live Flows
- Implement listing feed/create/interest/review endpoints.
- Remove fallback listings for standard runtime.
- Add anti-scam scoring source field and confidence.
- Done when list item appears for all users and reviews persist.

### Step 08: Guides Live and Update Feed
- Implement guides + guide updates + vote endpoints.
- Connect ingest-driven updates feed and last-updated badges.
- Remove `FALLBACK_GUIDES` default runtime usage.
- Done when guide cards update from backend and votes persist.

### Step 09: Student Hubs Live Core
- Implement universities/events/roommates/join/swipe endpoints.
- Move discounts/groups from local arrays to backend tables.
- Replace fallback roommate deck in normal runtime.
- Done when joins/swipes/events are fully backend-backed.

### Step 10: Village Vibes Polling
- Implement active poll retrieval + vote endpoint.
- Remove fallback poll defaults in normal runtime.
- Ensure vote lock per user and period.
- Done when poll percentages and totals are backend-authoritative.

### Step 11: AI Tools Productionization
- Implement contract and document analysis with real model pipeline.
- Enforce Polish law analysis context in contract analyzer prompt/agent.
- Keep lawyer request endpoint live with triage state machine.
- Done when analysis result includes legal framework, risk flags, and persisted request IDs.

### Step 12: AI Hub Live Migration
- Replace local AI generators in `AIIntelligenceHub` with `/api/ai/hub/*`.
- Persist user-specific AI recommendations and confidence/freshness.
- Done when all 7 AI hub tabs are served from backend.

### Step 13: Flavor Days Live Migration
- Replace `src/services/flavorDays/service.ts` local generators with `/api/flavor/*`.
- Add partner feed, activity feed, challenge progress, leaderboard persistence.
- Done when all Flavor Days cards are backend-fed.

### Step 14: Home Supporting Cards
- Replace static game/community snippets:
  - `PremiumWarsawDaily`
  - `PremiumCommunityCards`
  - Quick actions recommendations (context-aware API)
- Done when Home has no static business-content cards.

### Step 15: Profile Full Live Migration
- Replace profile fallback arrays (badges, journey, connections, insights).
- Wire settings actions to real user prefs endpoints.
- Done when profile page fully reflects backend state.

### Step 16: Onboarding + Mood + Briefing Timing Hardening
- Move onboarding storage from session-only to backend profile state.
- Keep local cache for immediate UX, but backend as source of truth.
- Enforce modal timing rules:
  - morning briefing once per day morning window
  - mood check once per day during noon window
- Done when modal behavior is deterministic across devices and sessions.

### Step 17: Remove Static Debt and Dead Paths
- Remove or gate static fallback arrays from active runtime.
- Keep controlled offline fallback behind explicit offline checks.
- Audit and clean unused legacy components that can confuse maintenance.
- Done when no active runtime module depends on static business arrays.

### Step 18: PWA and Mobile Hardening
- Finalize icon assets and splash consistency.
- Verify service worker caching strategy with API stale handling.
- Fix bottom-nav overlap and safe-area edge cases on real devices.
- Done when install/open/offline/refresh behavior is stable on iOS + Android.

### Step 19: Observability and QA Gates
- Add logging/tracing for API handlers and ingestion jobs.
- Add release checks:
  - build + typecheck
  - endpoint smoke tests
  - no-mojibake check
  - stale-feed behavior
- Done when all release gates pass in preview.

### Step 20: Production Rollout
- Deploy backend + frontend to Vercel production.
- Run post-release smoke tests from physical phone and desktop.
- Monitor first hour metrics and rollback triggers.
- Done when all tabs run live with no static business content.

## Per-Page Completion Checklist

### Home
- Header notifications from API.
- Pulse weather/fx/highlights from API with freshness.
- Journey milestone from `/api/me/progress`.
- Warsaw daily game and leaderboard from API.
- Community cards from API.

### Checklist
- Categories/tasks/status from API.
- Voice/AR/buddy metadata from task payload.
- Badge unlock events persisted.

### Discover
- AI Tools live analysis + lawyer request.
- Marketplace live feed + create + review.
- Directory live list + check-in + review prompt.
- Guides live feed + updates + vote.
- Student hubs live universities/events/roommates/discounts/groups.
- Village vibes live polls/votes/results.
- AI hub live (all tabs).
- Flavor days live partner ecosystem.

### Community
- Live feed filters.
- Live create post, reactions, comments, ranking.

### Profile
- Live profile, journey, badges, insights, connections.
- Live preference/settings updates.

## Definition of Done
1. Each active tab and modal uses backend data for business content.
2. All write actions persist and survive reload/new session.
3. No mojibake/question-mark glyph regressions in production UI.
4. Ingestion-fed updates (immigration, transport, legal/parliament, guides) show freshness.
5. Review engine prompts users after check-ins and influences rankings.
6. AI features run via server-side integrations with traceable request IDs and errors.
7. PWA install on phone shows correct icon and stable standalone behavior.

## Execution Order We Will Follow
Start with Step 01 and continue sequentially through Step 20.  
No step is marked complete until its acceptance criteria are verified in localhost preview and then Vercel preview.
