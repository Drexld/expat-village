import { RATE_LIMIT_POLICIES, methodNotAllowed, withSecurity } from '../_lib/security';
import { getMeProgressData } from '../_lib/data/meData';

export const config = {
  runtime: 'edge',
};

const handler = withSecurity(
  {
    routeId: 'me_progress_read',
    requireAuth: true,
    rateLimit: RATE_LIMIT_POLICIES.read,
  },
  async (request, context) => {
    if (request.method !== 'GET') {
      throw methodNotAllowed();
    }

    return getMeProgressData(context.auth.userId!);
  },
);

export default handler;
