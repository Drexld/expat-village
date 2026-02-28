import { RATE_LIMIT_POLICIES, methodNotAllowed, withSecurity } from './_lib/security';

export const config = {
  runtime: 'edge',
};

function envValue(name: string): string {
  const maybeProcess = globalThis as unknown as {
    process?: { env?: Record<string, string | undefined> };
  };
  return maybeProcess.process?.env?.[name]?.trim() || '';
}

const handler = withSecurity(
  {
    routeId: 'health_check',
    requireAuth: false,
    rateLimit: RATE_LIMIT_POLICIES.read,
  },
  async (request) => {
    if (request.method !== 'GET') {
      throw methodNotAllowed();
    }

    return {
      ok: true,
      service: 'expat-village-api',
      now: new Date().toISOString(),
      environment: {
        hasApiBaseUrl: Boolean(envValue('VITE_API_BASE_URL')),
        hasSupabaseUrl: Boolean(envValue('SUPABASE_URL')),
        hasSupabaseServiceRoleKey: Boolean(envValue('SUPABASE_SERVICE_ROLE_KEY')),
        hasIngestSecret: Boolean(envValue('INGEST_CRON_SECRET') || envValue('CRON_SECRET')),
      },
    };
  },
);

export default handler;
