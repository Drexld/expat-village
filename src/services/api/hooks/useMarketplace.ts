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

export function useMarketplace(options: UseMarketplaceOptions = {}): UseMarketplaceResult {
  const { enabled = true, refreshIntervalMs = 5 * 60 * 1000 } = options;
  const [data, setData] = useState<MarketplaceListingSummary[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const shouldFetch = enabled && hasApiBaseUrl();

  useEffect(() => {
    if (!shouldFetch) return;

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
      throw new Error('Marketplace API is not configured.');
    }

    const created = await createMarketplaceListing(input);
    setData((prev) => [created, ...(prev || [])]);
    return created;
  };

  const expressInterest = async (listingId: string, input: MarketplaceInterestInput) => {
    if (!shouldFetch) {
      throw new Error('Marketplace API is not configured.');
    }
    await createMarketplaceListingInterest(listingId, input);
  };

  const submitReview = async (listingId: string, input: MarketplaceReviewInput): Promise<MarketplaceReview> => {
    if (!shouldFetch) {
      throw new Error('Marketplace API is not configured.');
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
