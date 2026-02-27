import {
  RATE_LIMIT_POLICIES,
  badRequest,
  methodNotAllowed,
  withSecurity,
} from '../../../_lib/security';
import { createMarketplaceInterestData } from '../../../_lib/data/marketplaceData';
import { validateMarketplaceInterest } from '../../../_lib/validation';

export const config = {
  runtime: 'edge',
};

function extractListingId(request: Request): string | null {
  const match = request.url.match(/\/api\/marketplace\/listings\/([^/]+)\/interest(?:\?|$)/i);
  if (!match?.[1]) return null;
  const value = decodeURIComponent(match[1]).trim();
  return value || null;
}

const handler = withSecurity(
  {
    routeId: 'marketplace_interest_create',
    requireAuth: true,
    validateBody: validateMarketplaceInterest,
    rateLimit: RATE_LIMIT_POLICIES.write,
  },
  async (request, context) => {
    if (request.method !== 'POST') {
      throw methodNotAllowed();
    }

    const listingId = extractListingId(request);
    if (!listingId) {
      throw badRequest('Listing id is required');
    }

    await createMarketplaceInterestData(context.auth.userId!, listingId, context.body);
    return null;
  },
);

export default handler;
