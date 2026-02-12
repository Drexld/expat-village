import { useEffect, useMemo, useState } from 'react';
import { hasApiBaseUrl } from '../http';
import {
  createMarketplaceListing,
  createMarketplaceListingInterest,
  createMarketplaceListingReview,
  getMarketplaceListings,
} from '../repositories/marketplaceRepository';
import type {
  MarketplaceCreateListingInput,
  MarketplaceInterestInput,
  MarketplaceListingSummary,
  MarketplaceReview,
  MarketplaceReviewInput,
} from '../types';

interface UseMarketplaceOptions {
  enabled?: boolean;
  refreshIntervalMs?: number;
}

interface UseMarketplaceResult {
  data: MarketplaceListingSummary[] | null;
  isLoading: boolean;
  error: Error | null;
  isLive: boolean;
  lastSyncedAt: string | null;
  createListing: (input: MarketplaceCreateListingInput) => Promise<MarketplaceListingSummary>;
  expressInterest: (listingId: string, input: MarketplaceInterestInput) => Promise<void>;
  submitReview: (listingId: string, input: MarketplaceReviewInput) => Promise<MarketplaceReview>;
}

const fallbackListings: MarketplaceListingSummary[] = [
  {
    id: '1',
    title: 'IKEA MALM Bed Frame (King)',
    price: 450,
    category: 'Furniture',
    condition: 'Like New',
    seller: { name: 'Sarah M.', trustScore: 4.9, reviews: 23, verified: true },
    distance: '1.2 km',
    postedAt: '2 hours ago',
    images: 4,
    description: 'Moving back to UK, bought 6 months ago. Perfect condition, non-smoking home.',
    hasAR: true,
    escrowAvailable: true,
    featured: true,
    aiScamScore: 5,
  },
  {
    id: '2',
    title: 'MacBook Air M2 (2023)',
    price: 4200,
    category: 'Electronics',
    condition: 'Good',
    seller: { name: 'Luca R.', trustScore: 4.7, reviews: 15, verified: true },
    distance: '3.5 km',
    postedAt: '1 day ago',
    images: 6,
    description: 'Upgrading to Pro. 8GB RAM, 256GB SSD. Original box & charger included.',
    hasAR: false,
    escrowAvailable: true,
    aiScamScore: 8,
  },
  {
    id: '3',
    title: 'Winter Coat - North Face',
    price: 280,
    category: 'Clothing',
    condition: 'Good',
    seller: { name: 'Maria K.', trustScore: 5.0, reviews: 8, verified: true },
    distance: '0.5 km',
    postedAt: '3 days ago',
    images: 3,
    description: 'Size M, warm for Warsaw winters. Worn one season.',
    hasAR: false,
    escrowAvailable: false,
    aiScamScore: 3,
  },
  {
    id: '4',
    title: 'Dyson V11 Vacuum Cleaner',
    price: 890,
    category: 'Home',
    condition: 'Like New',
    seller: { name: 'Alex P.', trustScore: 4.8, reviews: 12, verified: true },
    distance: '2.1 km',
    postedAt: '5 hours ago',
    images: 5,
    description: 'Used 3 times, too powerful for small apartment. All attachments.',
    hasAR: true,
    escrowAvailable: true,
    featured: true,
    aiScamScore: 4,
  },
];

export function useMarketplace(options: UseMarketplaceOptions = {}): UseMarketplaceResult {
  const { enabled = true, refreshIntervalMs = 5 * 60 * 1000 } = options;
  const [data, setData] = useState<MarketplaceListingSummary[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const shouldFetch = enabled && hasApiBaseUrl();

  useEffect(() => {
    if (!shouldFetch) {
      setData(fallbackListings);
      setLastSyncedAt(new Date().toISOString());
      return;
    }

    let mounted = true;

    const fetchListings = async () => {
      try {
        if (!data) setIsLoading(true);
        const next = await getMarketplaceListings();
        if (!mounted) return;
        setData(next);
        setError(null);
        setLastSyncedAt(new Date().toISOString());
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err : new Error('Failed to load marketplace listings'));
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    void fetchListings();
    const interval = window.setInterval(fetchListings, refreshIntervalMs);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, [shouldFetch, refreshIntervalMs]);

  const createListing = async (
    input: MarketplaceCreateListingInput,
  ): Promise<MarketplaceListingSummary> => {
    if (!shouldFetch) {
      const fallback: MarketplaceListingSummary = {
        id: `local-${Date.now()}`,
        title: input.title,
        price: input.price,
        category: input.category,
        condition: 'Good',
        seller: { name: 'You', trustScore: 5, reviews: 0, verified: true },
        distance: 'Nearby',
        postedAt: 'just now',
        images: 1,
        description: input.description,
        hasAR: false,
        escrowAvailable: input.escrowRequested ?? true,
        featured: false,
        aiScamScore: 8,
      };
      setData((prev) => [fallback, ...(prev || fallbackListings)]);
      return fallback;
    }

    const created = await createMarketplaceListing(input);
    setData((prev) => [created, ...(prev || [])]);
    return created;
  };

  const expressInterest = async (listingId: string, input: MarketplaceInterestInput) => {
    if (!shouldFetch) return;
    await createMarketplaceListingInterest(listingId, input);
  };

  const submitReview = async (listingId: string, input: MarketplaceReviewInput): Promise<MarketplaceReview> => {
    if (!shouldFetch) {
      return {
        id: `local-review-${Date.now()}`,
        listingId,
        userId: 'local-user',
        rating: input.rating,
        body: input.body,
        createdAt: new Date().toISOString(),
      };
    }
    return createMarketplaceListingReview(listingId, input);
  };

  return useMemo(
    () => ({
      data,
      isLoading,
      error,
      isLive: shouldFetch && Boolean(data),
      lastSyncedAt,
      createListing,
      expressInterest,
      submitReview,
    }),
    [data, isLoading, error, shouldFetch, lastSyncedAt],
  );
}

