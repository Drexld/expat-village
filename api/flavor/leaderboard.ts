import { getFlavorLeaderboardData } from '../_lib/data/flavorData';
import { RATE_LIMIT_POLICIES, methodNotAllowed, withSecurity } from '../_lib/security';

export const config = {
  runtime: 'edge',
};

const handler = withSecurity(
  {
    routeId: 'flavor_leaderboard',
    requireAuth: false,
    rateLimit: RATE_LIMIT_POLICIES.read,
  },
  async (request) => {
    if (request.method !== 'GET') {
      throw methodNotAllowed();
    }

    return getFlavorLeaderboardData();
  },
);

export default handler;

