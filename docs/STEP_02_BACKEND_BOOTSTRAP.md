# Step 02: Backend Bootstrap and Contracts

## Objective
Introduce backend foundation artifacts without changing current UI behavior, layout, animation, or interaction logic.

## Delivered

### 1. Environment and runtime config
- `.env.example`
- `src/config/runtime.ts`

What this gives us:
- explicit runtime contract for `VITE_API_BASE_URL`, Supabase keys, region, and environment
- startup-safe validation surface for missing config

### 2. Baseline database migration
- `supabase/migrations/20260212_000001_initial_schema.sql`

What this includes:
- core table shells for identity, pulse feeds, checklist, guides, directory/reviews, community, and AI legal workflows
- timestamp trigger function (`set_updated_at`)
- baseline RLS posture:
  - public read policies for feed/reference tables
  - user-owned access policies for user-scoped tables

### 3. Frontend API scaffold (not wired to UI yet)
- `src/services/api/http.ts`
- `src/services/api/types.ts`
- `src/services/api/repositories/*`

Repository coverage added:
- home pulse + briefing
- me/profile/progress
- checklist
- guides + votes
- services/check-ins/reviews
- community posts/comments/reactions
- AI contract/document analysis + lawyer request

## Non-breaking guarantee for this step
- No component rendering logic changed.
- No motion/animation class changes.
- No tab/navigation behavior changed.
- Existing static UI remains active until each migration step wires repositories in.

## Next step (Step 03)
Wire `Home` data providers:
- `GET /api/pulse/home`
- `GET /api/briefing/today`

with adapter transforms so current card props remain stable.
