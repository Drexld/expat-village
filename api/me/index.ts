import { RATE_LIMIT_POLICIES, methodNotAllowed, withSecurity } from '../_lib/security';
import { getMeProfileData } from '../_lib/data/meData';

export const config = {
  runtime: 'edge',
};

const handler = withSecurity(
  {
    routeId: 'me_profile_read',
    requireAuth: true,
    rateLimit: RATE_LIMIT_POLICIES.read,
  },
  async (request, context) => {
    if (request.method !== 'GET') {
      throw methodNotAllowed();
    }

    return getMeProfileData(context.auth.userId!);
  },
);

export default handler;
