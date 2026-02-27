import {
  RATE_LIMIT_POLICIES,
  badRequest,
  methodNotAllowed,
  withSecurity,
} from '../../../_lib/security';
import { joinStudentUniversityData } from '../../../_lib/data/studentData';

export const config = {
  runtime: 'edge',
};

function extractUniversityId(request: Request): string | null {
  const match = request.url.match(/\/api\/student\/universities\/([^/]+)\/join(?:\?|$)/i);
  if (!match?.[1]) return null;
  const value = decodeURIComponent(match[1]).trim();
  return value || null;
}

const handler = withSecurity(
  {
    routeId: 'student_university_join',
    requireAuth: true,
    rateLimit: RATE_LIMIT_POLICIES.write,
  },
  async (request, context) => {
    if (request.method !== 'POST') {
      throw methodNotAllowed();
    }

    const universityId = extractUniversityId(request);
    if (!universityId) {
      throw badRequest('University id is required');
    }

    await joinStudentUniversityData(universityId, context.auth.userId!);
    return null;
  },
);

export default handler;
