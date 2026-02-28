import { useEffect, useMemo, useState } from 'react';
import { hasApiBaseUrl } from '../http';
import {
  createServiceCheckin,
  createServiceReview,
  getPendingReviewPrompts,
  getServiceReviews,
  getServices,
} from '../repositories/servicesRepository';
import type { ReviewPromptSummary, ServiceReview, ServiceReviewInput, ServiceSummary } from '../types';

interface UseServicesOptions {
  enabled?: boolean;
  refreshIntervalMs?: number;
  fetchList?: boolean;
}

interface UseServicesResult {
  data: ServiceSummary[] | null;
  isLoading: boolean;
  error: Error | null;
  isLive: boolean;
  lastSyncedAt: string | null;
  checkIn: (serviceId: string) => Promise<void>;
  loadReviews: (serviceId: string) => Promise<ServiceReview[]>;
  submitReview: (serviceId: string, input: ServiceReviewInput) => Promise<ServiceReview>;
  loadPendingReviewPrompts: () => Promise<ReviewPromptSummary[]>;
}

export function useServices(options: UseServicesOptions = {}): UseServicesResult {
  const { enabled = true, refreshIntervalMs = 5 * 60 * 1000, fetchList = true } = options;
  const [data, setData] = useState<ServiceSummary[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const shouldFetch = enabled && hasApiBaseUrl();
  const shouldFetchList = shouldFetch && fetchList;

  useEffect(() => {
    if (!shouldFetchList) return;

    let mounted = true;

    const fetchServices = async () => {
      try {
        if (!data) setIsLoading(true);
        const next = await getServices();
        if (!mounted) return;
        setData(next);
        setError(null);
        setLastSyncedAt(new Date().toISOString());
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err : new Error('Failed to load services'));
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    void fetchServices();
    const interval = window.setInterval(fetchServices, refreshIntervalMs);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, [shouldFetchList, refreshIntervalMs]);

  const checkIn = async (serviceId: string) => {
    if (!shouldFetch) {
      throw new Error('Services API is not configured.');
    }
    await createServiceCheckin(serviceId);
  };

  const loadReviews = async (serviceId: string): Promise<ServiceReview[]> => {
    if (!shouldFetch) {
      throw new Error('Services API is not configured.');
    }
    return getServiceReviews(serviceId);
  };

  const submitReview = async (serviceId: string, input: ServiceReviewInput): Promise<ServiceReview> => {
    if (!shouldFetch) {
      throw new Error('Services API is not configured.');
    }
    return createServiceReview(serviceId, input);
  };

  const loadPendingReviewPrompts = async (): Promise<ReviewPromptSummary[]> => {
    if (!shouldFetch) return [];
    return getPendingReviewPrompts();
  };

  return useMemo(
    () => ({
      data,
      isLoading,
      error,
      isLive: shouldFetch && (fetchList ? Boolean(data) : true),
      lastSyncedAt,
      checkIn,
      loadReviews,
      submitReview,
      loadPendingReviewPrompts,
    }),
    [data, isLoading, error, shouldFetch, fetchList, lastSyncedAt],
  );
}
