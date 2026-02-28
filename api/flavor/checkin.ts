import { checkInFlavorRestaurantData } from '../_lib/data/flavorData';
import { RATE_LIMIT_POLICIES, methodNotAllowed, withSecurity } from '../_lib/security';
import { validateFlavorCheckin } from '../_lib/validation';

export const config = {
  runtime: 'edge',
};

const handler = withSecurity(
  {
    routeId: 'flavor_checkin',
    requireAuth: true,
    validateBody: validateFlavorCheckin,
    rateLimit: RATE_LIMIT_POLICIES.write,
  },
  async (request, context) => {
    if (request.method !== 'POST') {
      throw methodNotAllowed();
    }

    return checkInFlavorRestaurantData(context.auth.userId!, context.body.restaurantId);
  },
);

export default handler;

