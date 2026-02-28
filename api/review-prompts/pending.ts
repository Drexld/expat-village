import { RATE_LIMIT_POLICIES, methodNotAllowed, unauthorized, withSecurity } from '../_lib/security';
import { getPendingReviewPromptsData } from '../_lib/data/servicesData';

export const config = {
  runtime: 'edge',
};

const handler = withSecurity(
  {
    routeId: 'review_prompts_pending',
    requireAuth: true,
    rateLimit: RATE_LIMIT_POLICIES.read,
  },
  async (request, context) => {
    if (request.method !== 'GET') {
      throw methodNotAllowed();
    }

    if (!context.auth.userId) {
      throw unauthorized();
    }

    return getPendingReviewPromptsData(context.auth.userId);
  },
);

export default handler;
