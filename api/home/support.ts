import { getHomeSupportData } from '../_lib/data/homeSupportData';
import { RATE_LIMIT_POLICIES, methodNotAllowed, withSecurity } from '../_lib/security';

export const config = {
  runtime: 'edge',
};

const handler = withSecurity(
  {
    routeId: 'home_support',
    requireAuth: false,
    rateLimit: RATE_LIMIT_POLICIES.read,
  },
  async (request, context) => {
    if (request.method !== 'GET') {
      throw methodNotAllowed();
    }
    return getHomeSupportData(context.auth.userId);
  },
);

export default handler;

