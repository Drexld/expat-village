import {
  RATE_LIMIT_POLICIES,
  badRequest,
  methodNotAllowed,
  unauthorized,
  withSecurity,
} from '../../_lib/security';
import { validateGuideVote } from '../../_lib/validation';
import { setGuideVote } from '../../_lib/data/guidesData';

export const config = {
  runtime: 'edge',
};

function extractGuideId(request: Request): string | null {
  const match = request.url.match(/\/api\/guides\/([^/]+)\/vote(?:\?|$)/i);
  if (!match?.[1]) return null;
  const value = decodeURIComponent(match[1]).trim();
  return value || null;
}

const handler = withSecurity(
  {
    routeId: 'guides_vote',
    requireAuth: true,
    validateBody: validateGuideVote,
    rateLimit: RATE_LIMIT_POLICIES.write,
  },
  async (request, context) => {
    if (request.method !== 'POST') {
      throw methodNotAllowed();
    }

    const guideId = extractGuideId(request);
    if (!guideId) {
      throw badRequest('Guide id is required');
    }

    if (!context.auth.userId) {
      throw unauthorized();
    }

    await setGuideVote(guideId, context.auth.userId, context.body.vote);

    return null;
  },
);

export default handler;
