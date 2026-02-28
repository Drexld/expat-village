#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const envFiles = ['.env.local', '.env'];

function parseEnvFile(content) {
  const parsed = {};
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
    parsed[key] = value;
  }
  return parsed;
}

function loadEnvFromFiles() {
  const merged = {};
  for (const filename of envFiles) {
    const filePath = path.join(rootDir, filename);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf8');
    Object.assign(merged, parseEnvFile(content));
  }
  return merged;
}

function readEnv(key, loaded) {
  const runtime = process.env[key];
  if (runtime && runtime.trim()) return runtime.trim();
  const file = loaded[key];
  if (file && file.trim()) return file.trim();
  return '';
}

const loaded = loadEnvFromFiles();

const checks = [
  {
    key: 'VITE_API_BASE_URL',
    label: 'Frontend API base URL',
    required: true,
  },
  {
    key: 'SUPABASE_URL',
    label: 'Server Supabase URL',
    required: true,
  },
  {
    key: 'SUPABASE_SERVICE_ROLE_KEY',
    label: 'Server Supabase service role key',
    required: true,
  },
  {
    key: 'SUPABASE_ANON_KEY',
    label: 'Server Supabase anon key for token verification',
    required: true,
  },
  {
    key: 'VITE_SUPABASE_URL',
    label: 'Client Supabase URL',
    required: true,
  },
  {
    key: 'VITE_SUPABASE_ANON_KEY',
    label: 'Client Supabase anon key',
    required: true,
  },
  {
    key: 'API_CORS_ORIGINS',
    label: 'API CORS allowlist',
    required: true,
  },
  {
    key: 'GROQ_API_KEY',
    label: 'Server AI key (Groq)',
    required: false,
  },
  {
    key: 'STRIPE_SECRET_KEY',
    label: 'Stripe secret key',
    required: false,
  },
  {
    key: 'REVENUECAT_SECRET_KEY',
    label: 'RevenueCat secret key',
    required: false,
  },
  {
    key: 'INGEST_CRON_SECRET',
    label: 'Secret for scheduled ingestion endpoint',
    required: true,
  },
  {
    key: 'INGEST_IMMIGRATION_FEED_URLS',
    label: 'Poland immigration feed URLs (comma-separated)',
    required: true,
  },
  {
    key: 'INGEST_LEGAL_FEED_URLS',
    label: 'Poland legal/parliament feed URLs (comma-separated)',
    required: true,
  },
  {
    key: 'INGEST_TRANSPORT_FEED_URLS',
    label: 'Poland transport disruption feed URLs (comma-separated)',
    required: true,
  },
];

let hasBlockingFailure = false;

console.log('Expat Village Readiness Check');
console.log('-----------------------------');

for (const check of checks) {
  const value = readEnv(check.key, loaded);
  const ok = Boolean(value);
  const status = ok ? 'OK' : check.required ? 'MISSING (BLOCKER)' : 'MISSING (optional for now)';
  if (!ok && check.required) {
    hasBlockingFailure = true;
  }

  console.log(`${status.padEnd(26)} ${check.key} - ${check.label}`);
}

console.log('\nNext action order:');
console.log('1) Configure all BLOCKER env vars locally and in Vercel.');
console.log('2) Deploy and verify /api/health + /api/pulse/home.');
console.log('3) Run security smoke: npm run security:smoke -- https://<your-url>.');
console.log('4) Enable AI keys, then billing keys.');
console.log('5) Configure ingestion secret + Poland feed source URLs for live updates.');

if (hasBlockingFailure) {
  process.exitCode = 1;
}
