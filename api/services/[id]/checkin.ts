import {
  RATE_LIMIT_POLICIES,
  badRequest,
  methodNotAllowed,
  unauthorized,
  withSecurity,
} from '../../_lib/security';
import { createServiceCheckinData } from '../../_lib/data/servicesData';

export const config = {
  runtime: 'edge',
};

function extractServiceId(request: Request): string | null {
  const match = request.url.match(/\/api\/services\/([^/]+)\/checkin(?:\?|$)/i);
  if (!match?.[1]) return null;
  const value = decodeURIComponent(match[1]).trim();
  return value || null;
}

const handler = withSecurity(
  {
    routeId: 'service_checkin_create',
    requireAuth: true,
    rateLimit: RATE_LIMIT_POLICIES.write,
  },
  async (request, context) => {
    if (request.method !== 'POST') {
      throw methodNotAllowed();
    }

    const serviceId = extractServiceId(request);
    if (!serviceId) {
      throw badRequest('Service id is required');
    }

    if (!context.auth.userId) {
      throw unauthorized();
    }

    await createServiceCheckinData(serviceId, context.auth.userId);
    return null;
  },
);

export default handler;
