import {
  RATE_LIMIT_POLICIES,
  methodNotAllowed,
  withSecurity,
} from '../../_lib/security';
import {
  createMarketplaceListingData,
  getMarketplaceListingsData,
} from '../../_lib/data/marketplaceData';
import { validateMarketplaceCreateListing } from '../../_lib/validation';

export const config = {
  runtime: 'edge',
};

const readHandler = withSecurity(
  {
    routeId: 'marketplace_listings_read',
    requireAuth: false,
    rateLimit: RATE_LIMIT_POLICIES.read,
  },
  async (request) => {
    if (request.method !== 'GET') {
      throw methodNotAllowed();
    }

    const url = new URL(request.url);
    return getMarketplaceListingsData({
      query: url.searchParams.get('q') || undefined,
      category: url.searchParams.get('category') || undefined,
    });
  },
);

const writeHandler = withSecurity(
  {
    routeId: 'marketplace_listings_create',
    requireAuth: true,
    validateBody: validateMarketplaceCreateListing,
    rateLimit: RATE_LIMIT_POLICIES.write,
  },
  async (request, context) => {
    if (request.method !== 'POST') {
      throw methodNotAllowed();
    }

    return createMarketplaceListingData(context.auth.userId!, context.body);
  },
);

export default async function routeHandler(request: Request): Promise<Response> {
  if (request.method === 'GET') return readHandler(request);
  if (request.method === 'POST') return writeHandler(request);
  return readHandler(request);
}
