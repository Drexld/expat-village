import {
  RATE_LIMIT_POLICIES,
  badRequest,
  methodNotAllowed,
  unauthorized,
  withSecurity,
} from '../../_lib/security';
import { validateServiceReview } from '../../_lib/validation';
import { createServiceReviewData, getServiceReviewsData } from '../../_lib/data/servicesData';

export const config = {
  runtime: 'edge',
};

function extractServiceId(request: Request): string | null {
  const match = request.url.match(/\/api\/services\/([^/]+)\/reviews(?:\?|$)/i);
  if (!match?.[1]) return null;
  const value = decodeURIComponent(match[1]).trim();
  return value || null;
}

const readHandler = withSecurity(
  {
    routeId: 'service_reviews_list',
    requireAuth: false,
    rateLimit: RATE_LIMIT_POLICIES.read,
  },
  async (request) => {
    if (request.method !== 'GET') {
      throw methodNotAllowed();
    }

    const serviceId = extractServiceId(request);
    if (!serviceId) {
      throw badRequest('Service id is required');
    }

    return getServiceReviewsData(serviceId);
  },
);

const writeHandler = withSecurity(
  {
    routeId: 'service_reviews_create',
    requireAuth: true,
    validateBody: validateServiceReview,
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

    return createServiceReviewData(serviceId, context.auth.userId, context.body);
  },
);

export default async function routeHandler(request: Request): Promise<Response> {
  if (request.method === 'GET') return readHandler(request);
  if (request.method === 'POST') return writeHandler(request);
  return readHandler(request);
}
