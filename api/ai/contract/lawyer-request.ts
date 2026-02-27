import { RATE_LIMIT_POLICIES, methodNotAllowed, withSecurity } from '../../_lib/security';
import { requestLawyerReviewData } from '../../_lib/data/aiData';
import { validateLawyerRequest } from '../../_lib/validation';

export const config = {
  runtime: 'edge',
};

const handler = withSecurity(
  {
    routeId: 'ai_contract_lawyer_request',
    requireAuth: true,
    validateBody: validateLawyerRequest,
    rateLimit: RATE_LIMIT_POLICIES.ai,
  },
  async (request, context) => {
    if (request.method !== 'POST') {
      throw methodNotAllowed();
    }

    return requestLawyerReviewData(context.auth.userId!, context.body);
  },
);

export default handler;
