import {
  RATE_LIMIT_POLICIES,
  badRequest,
  methodNotAllowed,
  unauthorized,
  withSecurity,
} from '../../../_lib/security';
import { validateCommunityComment } from '../../../_lib/validation';
import { createCommunityCommentData } from '../../../_lib/data/communityData';

export const config = {
  runtime: 'edge',
};

function extractPostId(request: Request): string | null {
  const match = request.url.match(/\/api\/community\/posts\/([^/]+)\/comments(?:\?|$)/i);
  if (!match?.[1]) return null;
  const id = decodeURIComponent(match[1]).trim();
  return id || null;
}

const handler = withSecurity(
  {
    routeId: 'community_comments_create',
    requireAuth: true,
    validateBody: validateCommunityComment,
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

    await createCommunityCommentData(postId, context.auth.userId, context.body);
    return null;
  },
);

export default handler;
