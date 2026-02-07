# Expat Village

A digital village for expats in Poland, starting with Warsaw.

## What is this?

Expat Village replaces scattered blogs, Facebook groups, and outdated expat guides with one trusted, living platform.

## Features

- **Get Things Done** - Bank accounts, PESEL, residency permits, contracts reviewed
- **Insurance & Health** - NFZ explained, private insurance options
- **Live Your Life** - Salons, gyms, restaurants, events
- **Housing** - Trusted rentals, English-speaking agents, scam warnings
- **Town Hall** - Community space for real expat connections

## Tech Stack

- React + Vite
- Tailwind CSS
- React Router

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:5173
```

## Status

Currently in development

## Spark Onboarding Render

- Preview route: `/spark-onboarding`
- Timeline: 14 seconds at 60fps (vertical 9:16)

### Render commands

```bash
# Capture PNG frames (1080x1920, 840 frames)
npm run render:spark:frames

# Capture frames + encode mp4 (requires ffmpeg in PATH)
npm run render:spark:mp4

# Optional: use an already-running app URL instead of auto-starting vite
node scripts/render-spark-onboarding.mjs --mp4 --url=http://127.0.0.1:5173/spark-onboarding
```

### Prerequisites

- `playwright` installed from `devDependencies`
- Chromium installed for Playwright:

```bash
npx playwright install chromium
```

- `ffmpeg` installed and available on PATH for mp4 encoding

---

Made with love in Warsaw
