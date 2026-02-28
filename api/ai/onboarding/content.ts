import { generateOnboardingContentData } from '../../_lib/data/onboardingData';
import { RATE_LIMIT_POLICIES, methodNotAllowed, withSecurity } from '../../_lib/security';
import { validateOnboardingContent } from '../../_lib/validation';

export const config = {
  runtime: 'edge',
};

const handler = withSecurity(
  {
    routeId: 'ai_onboarding_content',
    requireAuth: false,
    validateBody: validateOnboardingContent,
    rateLimit: RATE_LIMIT_POLICIES.ai,
  },
  async (request, context) => {
    if (request.method !== 'POST') {
      throw methodNotAllowed();
    }

    return generateOnboardingContentData(context.body);
  },
);

export default handler;
