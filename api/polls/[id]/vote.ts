import {
  RATE_LIMIT_POLICIES,
  badRequest,
  methodNotAllowed,
  unauthorized,
  withSecurity,
} from '../../_lib/security';
import { validatePollVote } from '../../_lib/validation';
import { votePollData } from '../../_lib/data/pollsData';

export const config = {
  runtime: 'edge',
};

function extractPollId(request: Request): string | null {
  const match = request.url.match(/\/api\/polls\/([^/]+)\/vote(?:\?|$)/i);
  if (!match?.[1]) return null;
  const value = decodeURIComponent(match[1]).trim();
  return value || null;
}

const handler = withSecurity(
  {
    routeId: 'poll_vote',
    requireAuth: true,
    validateBody: validatePollVote,
    rateLimit: RATE_LIMIT_POLICIES.write,
  },
  async (request, context) => {
    if (request.method !== 'POST') {
      throw methodNotAllowed();
    }

    const pollId = extractPollId(request);
    if (!pollId) {
      throw badRequest('Poll id is required');
    }

    if (!context.auth.userId) {
      throw unauthorized();
    }

    const result = await votePollData(pollId, context.body.optionId, context.auth.userId);
    if (result === 'invalid_option') {
      throw badRequest('Selected poll option is invalid.');
    }
    if (result === 'already_voted') {
      throw badRequest('You already voted in this poll.');
    }
    return null;
  },
);

export default handler;
