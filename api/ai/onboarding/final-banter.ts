import { generateOnboardingFinalBanterData } from '../../_lib/data/onboardingData';
import { RATE_LIMIT_POLICIES, methodNotAllowed, withSecurity } from '../../_lib/security';
import { validateOnboardingFinalBanter } from '../../_lib/validation';

export const config = {
  runtime: 'edge',
};

const handler = withSecurity(
  {
    routeId: 'ai_onboarding_final_banter',
    requireAuth: false,
    validateBody: validateOnboardingFinalBanter,
    rateLimit: RATE_LIMIT_POLICIES.ai,
  },
  async (request, context) => {
    if (request.method !== 'POST') {
      throw methodNotAllowed();
    }

    return generateOnboardingFinalBanterData(context.body);
  },
);

export default handler;
