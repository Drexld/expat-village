# Step 03: Backend Provisioning and API Activation

## Objective
Provision the minimum backend environment so deployed `/api/*` routes are live and testable.

This step is intentionally scoped for your current constraints:
- no working database yet
- no AI provider key yet
- no Stripe/RevenueCat keys yet

## Why this step comes next
Without active backend env + deployed API routes, the app cannot complete live migration and security verification (`/api/*` returns 404).

## Scope
1. Provision Supabase project.
2. Apply migrations.
3. Configure local + Vercel env variables.
4. Deploy API routes.
5. Validate health/read endpoints and security smoke.

## Deliverables
1. Supabase project exists and is reachable.
2. Migrations applied:
   - `supabase/migrations/20260212_000001_initial_schema.sql`
   - `supabase/migrations/20260213_000002_marketplace.sql`
   - `supabase/migrations/20260213_000003_student_hub.sql`
   - `supabase/migrations/20260213_000004_polls.sql`
   - `supabase/migrations/20260213_000005_me_profile_bio.sql`
3. Env vars configured in local and Vercel:
   - required now:
     - `VITE_API_BASE_URL`
     - `SUPABASE_URL`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `SUPABASE_ANON_KEY`
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `API_CORS_ORIGINS`
   - optional for later steps:
     - `GROQ_API_KEY`
     - `STRIPE_SECRET_KEY`
     - `REVENUECAT_SECRET_KEY`
4. API routes deployed and returning responses (not 404).

## Commands

### Local readiness gate
```bash
npm run readiness:check
```

### Build/type gate
```bash
npm run typecheck
npm run build
```

### Security smoke (after deploy)
```bash
npm run security:smoke -- https://<your-vercel-url>
```

## Verification checklist
1. `npm run readiness:check` shows no `MISSING (BLOCKER)`.
2. `GET https://<url>/api/pulse/home` returns `200` or valid API error envelope, not `404`.
3. `GET https://<url>/api/me` returns `401` without token.
4. `npm run security:smoke -- https://<url>` passes.

## Acceptance criteria (Go/No-Go)
1. `/api/*` is deployed and reachable.
2. Required env vars exist in local and Vercel.
3. Security smoke can execute against live deployment.
4. No step in `FULL_APP_LIVE_IMPLEMENTATION_PLAN.md` proceeds to AI/billing until this step is green.

## Next Step
Step 04: Data onboarding and static-to-live replacement phase 1 (Home + Checklist), now against active backend.
