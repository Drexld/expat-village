import { RATE_LIMIT_POLICIES, methodNotAllowed, withSecurity } from '../_lib/security';
import { getHomePulseBundleData } from '../_lib/data/pulseData';

export const config = {
  runtime: 'edge',
};

const handler = withSecurity(
  {
    routeId: 'pulse_home',
    requireAuth: false,
    rateLimit: RATE_LIMIT_POLICIES.read,
  },
  async (request) => {
    if (request.method !== 'GET') {
      throw methodNotAllowed();
    }

    return getHomePulseBundleData();
  },
);

export default handler;
