import {
  RATE_LIMIT_POLICIES,
  methodNotAllowed,
  withSecurity,
} from '../../_lib/security';
import { validateCommunityCreatePost } from '../../_lib/validation';
import {
  createCommunityPostData,
  getCommunityPostsData,
} from '../../_lib/data/communityData';

type CommunityFilter = 'all' | 'hot' | 'new' | 'questions' | 'wins';

function parseFilter(request: Request): CommunityFilter {
  const url = new URL(request.url);
  const raw = (url.searchParams.get('filter') || 'all').toLowerCase();
  if (raw === 'hot' || raw === 'new' || raw === 'questions' || raw === 'wins') {
    return raw;
  }
  return 'all';
}

export const config = {
  runtime: 'edge',
};

const handler = withSecurity(
  {
    routeId: 'community_posts_read',
    requireAuth: false,
    rateLimit: RATE_LIMIT_POLICIES.read,
  },
  async (request) => {
    if (request.method !== 'GET') {
      throw methodNotAllowed();
    }
    return getCommunityPostsData(parseFilter(request));
  },
);

const createHandler = withSecurity(
  {
    routeId: 'community_posts_create',
    requireAuth: true,
    validateBody: validateCommunityCreatePost,
    rateLimit: RATE_LIMIT_POLICIES.write,
  },
  async (request, context) => {
    if (request.method !== 'POST') {
      throw methodNotAllowed();
    }
    return createCommunityPostData(context.auth.userId!, context.body);
  },
);

export default async function routeHandler(request: Request): Promise<Response> {
  if (request.method === 'GET') return handler(request);
  if (request.method === 'POST') return createHandler(request);
  return handler(request);
}
