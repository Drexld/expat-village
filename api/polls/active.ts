import { RATE_LIMIT_POLICIES, methodNotAllowed, withSecurity } from '../_lib/security';
import { getActivePollsData } from '../_lib/data/pollsData';

export const config = {
  runtime: 'edge',
};

const handler = withSecurity(
  {
    routeId: 'polls_active',
    requireAuth: false,
    rateLimit: RATE_LIMIT_POLICIES.read,
  },
  async (request) => {
    if (request.method !== 'GET') {
      throw methodNotAllowed();
    }
    return getActivePollsData();
  },
);

export default handler;
