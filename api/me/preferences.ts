import { RATE_LIMIT_POLICIES, methodNotAllowed, withSecurity } from '../_lib/security';
import { validateMePreferencesUpdate } from '../_lib/validation';
import { getMePreferencesData, updateMePreferencesData } from '../_lib/data/meData';

export const config = {
  runtime: 'edge',
};

const readHandler = withSecurity(
  {
    routeId: 'me_preferences_read',
    requireAuth: true,
    rateLimit: RATE_LIMIT_POLICIES.read,
  },
  async (request, context) => {
    if (request.method !== 'GET') {
      throw methodNotAllowed();
    }

    return getMePreferencesData(context.auth.userId!);
  },
);

const updateHandler = withSecurity(
  {
    routeId: 'me_preferences_update',
    requireAuth: true,
    validateBody: validateMePreferencesUpdate,
    rateLimit: RATE_LIMIT_POLICIES.write,
  },
  async (request, context) => {
    if (request.method !== 'PATCH') {
      throw methodNotAllowed();
    }

    return updateMePreferencesData(context.auth.userId!, context.body);
  },
);

export default async function routeHandler(request: Request): Promise<Response> {
  if (request.method === 'GET') return readHandler(request);
  if (request.method === 'PATCH') return updateHandler(request);
  return readHandler(request);
}

