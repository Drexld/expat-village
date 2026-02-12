import { useEffect, useMemo, useState } from 'react';
import { hasApiBaseUrl } from '../http';
import {
  createServiceCheckin,
  createServiceReview,
  getServiceReviews,
  getServices,
} from '../repositories/servicesRepository';
import type { ServiceReview, ServiceReviewInput, ServiceSummary } from '../types';

interface UseServicesOptions {
  enabled?: boolean;
  refreshIntervalMs?: number;
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
}

export function useServices(options: UseServicesOptions = {}): UseServicesResult {
  const { enabled = true, refreshIntervalMs = 5 * 60 * 1000 } = options;
  const [data, setData] = useState<ServiceSummary[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const shouldFetch = enabled && hasApiBaseUrl();

  useEffect(() => {
    if (!shouldFetch) return;

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
  }, [shouldFetch, refreshIntervalMs]);

  const checkIn = async (serviceId: string) => {
    if (!shouldFetch) return;
    await createServiceCheckin(serviceId);
  };

  const loadReviews = async (serviceId: string): Promise<ServiceReview[]> => {
    if (!shouldFetch) return [];
    return getServiceReviews(serviceId);
  };

  const submitReview = async (serviceId: string, input: ServiceReviewInput): Promise<ServiceReview> => {
    if (!shouldFetch) {
      return {
        id: `local-${Date.now()}`,
        serviceId,
        userId: 'local-user',
        rating: input.rating,
        title: input.title,
        body: input.body,
        tags: input.tags || [],
        createdAt: new Date().toISOString(),
      };
    }
    return createServiceReview(serviceId, input);
  };

  return useMemo(
    () => ({
      data,
      isLoading,
      error,
      isLive: shouldFetch && Boolean(data),
      lastSyncedAt,
      checkIn,
      loadReviews,
      submitReview,
    }),
    [data, isLoading, error, shouldFetch, lastSyncedAt],
  );
}
