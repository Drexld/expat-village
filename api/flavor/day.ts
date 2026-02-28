import { getFlavorDayBundleData } from '../_lib/data/flavorData';
import { RATE_LIMIT_POLICIES, methodNotAllowed, withSecurity } from '../_lib/security';

export const config = {
  runtime: 'edge',
};

const handler = withSecurity(
  {
    routeId: 'flavor_day',
    requireAuth: false,
    rateLimit: RATE_LIMIT_POLICIES.read,
  },
  async (request, context) => {
    if (request.method !== 'GET') {
      throw methodNotAllowed();
    }

    return getFlavorDayBundleData(context.auth.userId);
  },
);

export default handler;

