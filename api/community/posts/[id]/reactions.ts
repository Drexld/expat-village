import {
  RATE_LIMIT_POLICIES,
  badRequest,
  methodNotAllowed,
  unauthorized,
  withSecurity,
} from '../../../_lib/security';
import { validateCommunityReaction } from '../../../_lib/validation';
import { createCommunityReactionData } from '../../../_lib/data/communityData';

export const config = {
  runtime: 'edge',
};

function extractPostId(request: Request): string | null {
  const match = request.url.match(/\/api\/community\/posts\/([^/]+)\/reactions(?:\?|$)/i);
  if (!match?.[1]) return null;
  const id = decodeURIComponent(match[1]).trim();
  return id || null;
}

const handler = withSecurity(
  {
    routeId: 'community_reactions_create',
    requireAuth: true,
    validateBody: validateCommunityReaction,
    rateLimit: RATE_LIMIT_POLICIES.write,
  },
  async (request, context) => {
    if (request.method !== 'POST') {
      throw methodNotAllowed();
    }

    const postId = extractPostId(request);
    if (!postId) {
      throw badRequest('Post id is required');
    }

    if (!context.auth.userId) {
      throw unauthorized();
    }

    await createCommunityReactionData(postId, context.auth.userId, context.body);
    return null;
  },
);

export default handler;
