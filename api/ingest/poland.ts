import { runPolandFeedIngestion } from '../_lib/ingestion/polandFeeds';
import {
  RATE_LIMIT_POLICIES,
  badRequest,
  forbidden,
  methodNotAllowed,
  withSecurity,
} from '../_lib/security';

export const config = {
  runtime: 'edge',
};

type FeedKind = 'weather' | 'fx' | 'immigration' | 'legal' | 'transport';
const ALLOWED_KINDS: FeedKind[] = ['weather', 'fx', 'immigration', 'legal', 'transport'];

function envValue(name: string): string {
  const maybeProcess = globalThis as unknown as {
    process?: { env?: Record<string, string | undefined> };
  };
  return maybeProcess.process?.env?.[name]?.trim() || '';
}

function getExpectedSecret(): string {
  return envValue('INGEST_CRON_SECRET') || envValue('CRON_SECRET');
}

function extractBearerSecret(request: Request): string {
  const auth = request.headers.get('authorization') || '';
  const [scheme, value] = auth.split(' ');
  if (!scheme || !value) return '';
  if (scheme.toLowerCase() !== 'bearer') return '';
  return value.trim();
}

function assertIngestSecret(request: Request): void {
  const expected = getExpectedSecret();
  if (!expected) {
    throw forbidden('Ingestion secret is not configured');
  }

  const url = new URL(request.url);
  const provided =
    (request.headers.get('x-ingest-secret') || '').trim() ||
    extractBearerSecret(request) ||
    (url.searchParams.get('secret') || '').trim();

  if (!provided || provided !== expected) {
    throw forbidden('Invalid ingestion secret');
  }
}

function parseKinds(request: Request): FeedKind[] {
  const rawKinds = new URL(request.url).searchParams.get('kinds') || '';
  const requested = rawKinds
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  if (!requested.length || requested.includes('all')) {
    return [...ALLOWED_KINDS];
  }

  const invalid = requested.filter((item) => !ALLOWED_KINDS.includes(item as FeedKind));
  if (invalid.length) {
    throw badRequest('Invalid ingestion kinds', { invalidKinds: invalid });
  }

  return requested as FeedKind[];
}

const handler = withSecurity(
  {
    routeId: 'ingest_poland_feeds',
    requireAuth: false,
    rateLimit: RATE_LIMIT_POLICIES.write,
  },
  async (request) => {
    if (request.method !== 'POST') {
      throw methodNotAllowed();
    }

    assertIngestSecret(request);
    const kinds = parseKinds(request);
    const result = await runPolandFeedIngestion({ kinds });

    return {
      data: result,
      freshness: {
        source: 'poland-ingestion-run',
        updatedAt: result.finishedAt,
        ttlSeconds: 60,
      },
    };
  },
);

export default handler;
