import {
  RATE_LIMIT_POLICIES,
  badRequest,
  methodNotAllowed,
  unauthorized,
  withSecurity,
} from '../../_lib/security';
import { validateTaskStatusUpdate } from '../../_lib/validation';
import { setChecklistTaskStatus } from '../../_lib/data/tasksData';

export const config = {
  runtime: 'edge',
};

function extractTaskId(request: Request): string | null {
  const match = request.url.match(/\/api\/tasks\/([^/]+)\/status(?:\?|$)/i);
  if (!match?.[1]) return null;
  const id = decodeURIComponent(match[1]).trim();
  return id || null;
}

const handler = withSecurity(
  {
    routeId: 'tasks_status_update',
    requireAuth: true,
    validateBody: validateTaskStatusUpdate,
    rateLimit: RATE_LIMIT_POLICIES.write,
  },
  async (request, context) => {
    if (request.method !== 'PATCH') {
      throw methodNotAllowed();
    }

    const taskId = extractTaskId(request);
    if (!taskId) {
      throw badRequest('Task id is required');
    }

    if (!context.auth.userId) {
      throw unauthorized();
    }

    await setChecklistTaskStatus(taskId, context.auth.userId, context.body.status);
    return null;
  },
);

export default handler;
