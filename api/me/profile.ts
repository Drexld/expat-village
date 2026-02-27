import { RATE_LIMIT_POLICIES, methodNotAllowed, withSecurity } from '../_lib/security';
import { validateMeProfileUpdate } from '../_lib/validation';
import { updateMeProfileData } from '../_lib/data/meData';

export const config = {
  runtime: 'edge',
};

const handler = withSecurity(
  {
    routeId: 'me_profile_update',
    requireAuth: true,
    validateBody: validateMeProfileUpdate,
    rateLimit: RATE_LIMIT_POLICIES.write,
  },
  async (request, context) => {
    if (request.method !== 'PATCH') {
      throw methodNotAllowed();
    }

    return updateMeProfileData(context.auth.userId!, context.body);
  },
);

export default handler;
