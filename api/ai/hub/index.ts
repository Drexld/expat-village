import { RATE_LIMIT_POLICIES, methodNotAllowed, withSecurity } from '../../_lib/security';
import { getAIHubBundleData } from '../../_lib/data/aiHubData';

export const config = {
  runtime: 'edge',
};

const handler = withSecurity(
  {
    routeId: 'ai_hub_bundle',
    requireAuth: false,
    rateLimit: RATE_LIMIT_POLICIES.read,
  },
  async (request, context) => {
    if (request.method !== 'GET') {
      throw methodNotAllowed();
    }

    return getAIHubBundleData(context.auth.userId);
  },
);

export default handler;

