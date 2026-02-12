# Step 01: Foundation Freeze and Live Migration Plan

## Objective
Establish the full production blueprint for converting the Expat Village app from UI-rich static/mocked data to fully live data and AI-backed workflows, while preserving the current design, animations, and interaction behavior.

This document is the execution baseline for step-by-step delivery.

## Scope of Active Runtime

### Top-level app flow
- `src/App.tsx`
  - Tabs: `home`, `checklist`, `discover`, `community`, `profile`
  - Modals: `MorningBriefing`, `MoodCheck`
  - Floating: `VoiceBubble` on home
  - Onboarding gate: `PersonalityOnboarding`
  - Current session persistence: `sessionStorage`

### Home tab module tree
- `src/components/Home.tsx`
  - `PremiumHeader`
  - `PremiumDailyPulse`
  - `PremiumJourney`
  - `PremiumWarsawDaily`
  - `PremiumCommunityCards`
  - quick actions and briefing launcher

### Checklist tab module tree
- `src/components/EnhancedChecklist.tsx`

### Discover tab module tree
- `src/components/Discover.tsx`
  - `AIIntelligenceHub`
  - `FlavorDays`
  - `AITools`
  - `Marketplace`
  - `PremiumDirectory`
  - `EnhancedGuides`
  - `StudentHubs`
  - `VillageVibes`

### Community tab module tree
- `src/components/WarsawWhisperNetwork.tsx`

### Profile tab module tree
- `src/components/PremiumProfile.tsx`

### Cross-cutting runtime
- `src/components/Navigation.tsx`
- `src/main.tsx`, `public/sw.js`, `public/manifest.webmanifest`

## Current Data Reality (Freeze Snapshot)

### Live external API calls currently present
- Groq only (onboarding):
  - `src/services/onboarding/groqOnboarding.ts`

### Static/mocked domain data present across app
- Home pulse/news/visa/transit snippets: static content in `PremiumDailyPulse`, `PremiumHeader`, `MorningBriefing`
- Checklist tasks/categories/progress logic: local static arrays
- Discover modules:
  - AI Hub: computed mock service data (`src/services/ai/expatVillageAI.ts`)
  - Flavor Days: local generated/static service data (`src/services/flavorDays/service.ts`)
  - AI Tools: simulated analysis results and request toasts
  - Directory/Marketplace/Guides/Student/Vibes: static arrays and local state
- Community feed (`WarsawWhisperNetwork`): static post list
- Profile/Journey badges/timeline/forecast cards: static arrays and local state

### Persistence today
- Session-based only for selected flows in `App.tsx`:
  - onboarding profile and completion flag
  - mood selection and daily mood date
  - morning briefing seen date

## Product Requirement Translation
Every feature/card must be live (no static remains for business content). "Live" means:
1. Data is loaded from backend repositories (not local arrays) in standard runtime.
2. User actions write to backend and round-trip to UI.
3. Time-sensitive cards carry freshness metadata (`updated_at`, source, TTL).
4. Fallbacks are graceful degradation only, not default behavior.

## Target Production Architecture

### Frontend
- Vite React app (existing) deployed on Vercel.
- Move all domain data loading to repository layer under `src/services/api/*`.
- Maintain current motion and UI classes; only swap data source and action handlers.

### Backend
- Supabase stack:
  - Postgres
  - Auth
  - Row Level Security
  - Realtime
  - Storage (media)
  - Edge Functions
- Vercel Cron + Edge Functions for scheduled ingestion.

### AI orchestration
- Server-side provider adapters (Groq first, extensible).
- Prompt templates and schema validation server-side.
- No client-side secret exposure.

### Observability and reliability
- Error tracking (Sentry or equivalent)
- Structured logs for ingestion and AI jobs
- Health endpoint and freshness monitors

## Canonical Domain Model (Whole App)

### Identity and progression
- `users`
- `user_profiles`
- `user_preferences`
- `user_progress`
- `badges`
- `user_badges`
- `journey_events`

### Daily pulse and city signal feeds
- `weather_snapshots`
- `fx_rates`
- `transit_disruptions`
- `immigration_updates`
- `legal_parliament_updates`
- `daily_briefings`

### Checklist
- `task_categories`
- `tasks`
- `task_steps`
- `user_task_status`

### Guides
- `guides`
- `guide_revisions`
- `guide_updates`
- `guide_votes`
- `guide_views`

### Directory and reviews
- `service_categories`
- `services`
- `service_checkins`
- `service_reviews`
- `review_prompts`
- `review_votes`

### Marketplace
- `marketplace_listings`
- `listing_media`
- `listing_safety_scores`
- `escrow_events`
- `listing_reviews`

### Community
- `community_topics`
- `community_posts`
- `community_comments`
- `community_reactions`
- `community_reports`

### Student hubs
- `universities`
- `university_memberships`
- `university_events`
- `roommate_profiles`
- `roommate_swipes`
- `roommate_matches`

### Village vibes/polls
- `polls`
- `poll_options`
- `poll_votes`
- `poll_leaderboards`

### AI tools and legal workflows
- `contract_analyses`
- `contract_clauses`
- `document_analyses`
- `lawyer_review_requests`
- `lawyer_review_status_events`

### Flavor days
- `flavor_days`
- `flavor_restaurants`
- `flavor_challenges`
- `flavor_user_challenge_progress`
- `flavor_activity_feed`
- `flavor_leaderboard`

## API Contract Map (first-class endpoints)

### App shell
- `GET /api/me`
- `PATCH /api/me/profile`
- `GET /api/me/progress`

### Home pulse
- `GET /api/pulse/home`
  - weather, fx, transit, immigration, legal/parliament highlights
  - freshness metadata per block
- `GET /api/briefing/today`

### Checklist
- `GET /api/tasks`
- `PATCH /api/tasks/:taskId/status`

### Guides
- `GET /api/guides`
- `GET /api/guides/:id`
- `POST /api/guides/:id/vote`
- `GET /api/guides/updates/feed`

### Directory and review engine
- `GET /api/services`
- `POST /api/services/:id/checkin`
- `POST /api/services/:id/reviews`
- `GET /api/services/:id/reviews`
- `POST /api/review-prompts/:id/respond`

### Marketplace
- `GET /api/marketplace/listings`
- `POST /api/marketplace/listings`
- `POST /api/marketplace/listings/:id/interest`
- `POST /api/marketplace/listings/:id/reviews`

### Community
- `GET /api/community/posts`
- `POST /api/community/posts`
- `POST /api/community/posts/:id/reactions`
- `POST /api/community/posts/:id/comments`

### Student
- `GET /api/student/universities`
- `POST /api/student/universities/:id/join`
- `GET /api/student/events`
- `POST /api/student/roommates/swipe`

### Vibes/polls
- `GET /api/polls/active`
- `POST /api/polls/:id/vote`

### AI tools
- `POST /api/ai/contract/analyze`
- `POST /api/ai/document/analyze`
- `POST /api/ai/contract/lawyer-request`

### Flavor
- `GET /api/flavor/day`
- `GET /api/flavor/restaurants`
- `POST /api/flavor/checkin`
- `GET /api/flavor/leaderboard`

## Scheduled Ingestion and Jobs

### Required jobs
1. Immigration updates ingestion
2. Transport disruption ingestion
3. Legal/parliament update ingestion
4. Weather snapshots
5. FX rates snapshots
6. Guide update refresh and indexer
7. Service review prompt generator after check-in completion window

### Job requirements
- each run stores source URL, fetch time, parser version, checksum
- dedupe by external id/hash
- explicit TTL for each feed type
- failed runs alert to monitoring channel

## Frontend Migration Strategy (No Design Breakage)

### Rule
Replace data source and action handlers only. Keep structure, class names, and motion behavior unchanged unless bug fix is required.

### Migration adapter pattern
- Introduce repository hooks:
  - `useHomePulse()`, `useBriefing()`, `useTasks()`, `useGuides()`, `useServices()`, etc.
- Component receives same shape as today where possible.
- Add transform layer so UI props remain stable during backend rollout.

## Step-by-Step Execution Order

### Step 1 (current)
- Foundation freeze and contracts (this document).
- Identify static debt per module and conversion owner.

### Step 2
- Backend bootstrap and schema migration baseline.
- Auth/session and environment separation.

### Step 3
- Home pulse live data (weather/fx/transit/immigration/legal).
- Morning briefing feed live.

### Step 4
- Checklist live tasks and progress writes.

### Step 5
- Guides live feed and auto-updates.

### Step 6
- Directory live services and review engine (check-in -> prompt -> review).

### Step 7
- Community live posts/comments/reactions.

### Step 8
- AI tools live analysis persistence and lawyer-request pipeline.

### Step 9
- Marketplace live listings/trust flows.

### Step 10
- Student hubs and roommate flows live.

### Step 11
- Vibes polls live.

### Step 12
- Profile and journey cards fully backend-driven.

### Step 13
- PWA data caching hardening and offline policy.

### Step 14
- QA gates, staging rollout, production release.

## Static Debt Register (high priority)
- Home cards and briefings: static narrative snippets and metrics.
- EnhancedChecklist: task catalog static array.
- EnhancedGuides: guide catalog and update metadata static array.
- PremiumDirectory and Directory: business catalogs and reviews static arrays.
- Marketplace: listing catalog static array.
- WarsawWhisperNetwork: post feed static array.
- StudentHubs: universities/events/roommates/discounts/groups static arrays.
- VillageVibes: poll payload static arrays.
- PremiumProfile and PremiumJourney: badges, timeline, forecast data static arrays.
- AIIntelligenceHub + flavor services: currently generated local mock data.

## Definition of Done for "Fully Live"
1. No business-content static arrays remain in active runtime components.
2. All key cards have backend `updated_at` and freshness indicator.
3. User actions persist and are visible after refresh/login.
4. Critical feeds (immigration/legal/transit) are ingestion-driven, timestamped, and monitored.
5. Review engine influences ranking/recommendation in directory and related cards.

## Risks and Controls
- Risk: visual regressions during data migration.
  - Control: component contract adapters + screenshot checks.
- Risk: stale critical legal/transit data.
  - Control: TTL, source timestamp, alerting.
- Risk: AI legal overreach.
  - Control: legal disclaimer + human lawyer escalation path.
- Risk: rollout instability.
  - Control: feature flags by module, staged deployment.

## Deliverables from Step 1
- This document
- Agreed migration order
- Backend schema and API contract ready for implementation in Step 2
