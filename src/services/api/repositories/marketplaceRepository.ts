import { apiGet, apiPost } from '../http';
import type {
  MarketplaceCreateListingInput,
  MarketplaceInterestInput,
  MarketplaceListingSummary,
  MarketplaceReview,
  MarketplaceReviewInput,
} from '../types';

export interface MarketplaceListingsParams {
  query?: string;
  category?: string;
}

function encodeQuery(params: MarketplaceListingsParams): string {
  const qp = new URLSearchParams();
  if (params.query) qp.set('q', params.query);
  if (params.category) qp.set('category', params.category);
  const query = qp.toString();
  return query ? `?${query}` : '';
}

export async function getMarketplaceListings(
  params: MarketplaceListingsParams = {},
): Promise<MarketplaceListingSummary[]> {
  return apiGet<MarketplaceListingSummary[]>(`/api/marketplace/listings${encodeQuery(params)}`);
}

export async function createMarketplaceListing(
  input: MarketplaceCreateListingInput,
): Promise<MarketplaceListingSummary> {
  return apiPost<MarketplaceListingSummary>('/api/marketplace/listings', input);
}

export async function createMarketplaceListingInterest(
  listingId: string,
  input: MarketplaceInterestInput,
): Promise<void> {
  await apiPost<void>(`/api/marketplace/listings/${listingId}/interest`, input);
}

export async function createMarketplaceListingReview(
  listingId: string,
  input: MarketplaceReviewInput,
): Promise<MarketplaceReview> {
  return apiPost<MarketplaceReview>(`/api/marketplace/listings/${listingId}/reviews`, input);
}

