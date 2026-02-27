import { RATE_LIMIT_POLICIES, methodNotAllowed, withSecurity } from '../_lib/security';
import { getChecklistTasksData } from '../_lib/data/tasksData';

export const config = {
  runtime: 'edge',
};

const handler = withSecurity(
  {
    routeId: 'tasks_list',
    requireAuth: false,
    rateLimit: RATE_LIMIT_POLICIES.read,
  },
  async (request, context) => {
    if (request.method !== 'GET') {
      throw methodNotAllowed();
    }

    return getChecklistTasksData(context.auth.userId);
  },
);

export default handler;
