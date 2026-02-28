import {
  RATE_LIMIT_POLICIES,
  badRequest,
  methodNotAllowed,
  withSecurity,
} from '../../../_lib/security';
import { joinStudentGroupData } from '../../../_lib/data/studentData';

export const config = {
  runtime: 'edge',
};

function extractGroupId(request: Request): string | null {
  const match = request.url.match(/\/api\/student\/groups\/([^/]+)\/join(?:\?|$)/i);
  if (!match?.[1]) return null;
  const value = decodeURIComponent(match[1]).trim();
  return value || null;
}

const handler = withSecurity(
  {
    routeId: 'student_groups_join',
    requireAuth: true,
    rateLimit: RATE_LIMIT_POLICIES.write,
  },
  async (request, context) => {
    if (request.method !== 'POST') {
      throw methodNotAllowed();
    }

    const groupId = extractGroupId(request);
    if (!groupId) {
      throw badRequest('Group id is required');
    }

    await joinStudentGroupData(groupId, context.auth.userId!);
    return null;
  },
);

export default handler;
