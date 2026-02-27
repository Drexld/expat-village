import { RATE_LIMIT_POLICIES, methodNotAllowed, withSecurity } from '../_lib/security';
import { getServicesData } from '../_lib/data/servicesData';

export const config = {
  runtime: 'edge',
};

const handler = withSecurity(
  {
    routeId: 'services_list',
    requireAuth: false,
    rateLimit: RATE_LIMIT_POLICIES.read,
  },
  async (request) => {
    if (request.method !== 'GET') {
      throw methodNotAllowed();
    }

    const url = new URL(request.url);
    return getServicesData({
      query: url.searchParams.get('q') || undefined,
      category: url.searchParams.get('category') || undefined,
      district: url.searchParams.get('district') || undefined,
    });
  },
);

export default handler;
