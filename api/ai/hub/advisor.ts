import { analyzeAIHubAdvisorData } from '../../_lib/data/aiHubData';
import { RATE_LIMIT_POLICIES, methodNotAllowed, withSecurity } from '../../_lib/security';
import { validateAIHubAdvisor } from '../../_lib/validation';

export const config = {
  runtime: 'edge',
};

const handler = withSecurity(
  {
    routeId: 'ai_hub_advisor',
    requireAuth: false,
    validateBody: validateAIHubAdvisor,
    rateLimit: RATE_LIMIT_POLICIES.ai,
  },
  async (request, context) => {
    if (request.method !== 'POST') {
      throw methodNotAllowed();
    }

    return analyzeAIHubAdvisorData(context.body.scenario, context.auth.userId);
  },
);

export default handler;

