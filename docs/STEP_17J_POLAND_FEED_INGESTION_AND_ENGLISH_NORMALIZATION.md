# Step 17J: Poland Feed Ingestion + English Normalization

## Objective
Make immigration/legal/transport/weather/exchange updates flow into the app from live Poland-focused sources, with output enforced in English.

## Changes Applied

### 1. Ingestion pipeline module
- Added `api/_lib/ingestion/polandFeeds.ts`
- Implements:
  - Weather ingestion from Open-Meteo (Warsaw)
  - FX ingestion from NBP (USD/PLN and EUR/PLN)
  - RSS/Atom ingestion for:
    - immigration feeds
    - legal/parliament feeds
    - transport disruption feeds
  - Feed XML parser for RSS + Atom
  - English normalization flow:
    - if item already likely English: keep/clean and classify severity
    - if likely non-English: translate/normalize via Groq JSON transform
    - if still non-English or translation fails: skip item
  - Upsert/write to existing Supabase tables:
    - `immigration_updates`
    - `legal_parliament_updates`
    - `transit_disruptions`
    - `weather_snapshots`
    - `fx_rates`

### 2. Secure ingestion endpoint
- Added `api/ingest/poland.ts`
- Endpoint: `POST /api/ingest/poland?kinds=...`
- Supported kinds:
  - `weather`
  - `fx`
  - `immigration`
  - `legal`
  - `transport`
  - `all` (or empty kinds -> all)
- Security:
  - requires secret via:
    - `x-ingest-secret` header, or
    - `Authorization: Bearer <secret>`, or
    - `?secret=<secret>` query param
  - secret resolves from `INGEST_CRON_SECRET` or `CRON_SECRET`
  - protected by rate limits and standard API security middleware

### 3. Cron scheduling
- Updated `vercel.json` with jobs:
  - every 15 min: `weather,fx`
  - every 30 min: `immigration,legal,transport`

### 4. Readiness checks
- Updated `scripts/readiness-check.mjs` to require:
  - `INGEST_CRON_SECRET`
  - `INGEST_IMMIGRATION_FEED_URLS`
  - `INGEST_LEGAL_FEED_URLS`
  - `INGEST_TRANSPORT_FEED_URLS`

## Required Environment Variables
- `INGEST_CRON_SECRET=<strong secret>`
- `INGEST_IMMIGRATION_FEED_URLS=<comma-separated URLs>`
- `INGEST_LEGAL_FEED_URLS=<comma-separated URLs>`
- `INGEST_TRANSPORT_FEED_URLS=<comma-separated URLs>`
- `GROQ_API_KEY=<key>` for non-English feed normalization to English

## Manual Run Example
```bash
curl -X POST "https://<your-domain>/api/ingest/poland?kinds=all" \
  -H "Authorization: Bearer <INGEST_CRON_SECRET>"
```

## Verification
- `npm run typecheck` passed.
- `npm run build` passed.

## Notes
- This step ensures feed output in app storage is English-first.
- If Groq is missing, non-English feed items are skipped instead of stored in Polish.
