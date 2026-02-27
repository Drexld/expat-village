import { RATE_LIMIT_POLICIES, methodNotAllowed, withSecurity } from '../_lib/security';
import { getDailyBriefingData } from '../_lib/data/pulseData';

export const config = {
  runtime: 'edge',
};

const handler = withSecurity(
  {
    routeId: 'briefing_today',
    requireAuth: false,
    rateLimit: RATE_LIMIT_POLICIES.read,
  },
  async (request) => {
    if (request.method !== 'GET') {
      throw methodNotAllowed();
    }

    return getDailyBriefingData();
  },
);

export default handler;
