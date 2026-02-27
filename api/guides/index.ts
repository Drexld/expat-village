import { RATE_LIMIT_POLICIES, methodNotAllowed, withSecurity } from '../_lib/security';
import { getGuidesData } from '../_lib/data/guidesData';

export const config = {
  runtime: 'edge',
};

const handler = withSecurity(
  {
    routeId: 'guides_list',
    requireAuth: false,
    rateLimit: RATE_LIMIT_POLICIES.read,
  },
  async (request) => {
    if (request.method !== 'GET') {
      throw methodNotAllowed();
    }

    return getGuidesData();
  },
);

export default handler;
