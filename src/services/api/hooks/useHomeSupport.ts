import { useEffect, useMemo, useState } from 'react';
import { hasApiBaseUrl } from '../http';
import { getHomeSupportPayloadEnvelope } from '../repositories/homeRepository';
import type { FreshnessMeta, HomeSupportPayload } from '../types';

interface UseHomeSupportOptions {
  enabled?: boolean;
  refreshIntervalMs?: number;
}

interface UseHomeSupportResult {
  data: HomeSupportPayload | null;
  freshness: FreshnessMeta | null;
  isLoading: boolean;
  error: Error | null;
  isLive: boolean;
  lastSyncedAt: string | null;
}

export function useHomeSupport(options: UseHomeSupportOptions = {}): UseHomeSupportResult {
  const { enabled = true, refreshIntervalMs = 2 * 60 * 1000 } = options;
  const [data, setData] = useState<HomeSupportPayload | null>(null);
  const [freshness, setFreshness] = useState<FreshnessMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const shouldFetch = enabled && hasApiBaseUrl();

  useEffect(() => {
    if (!shouldFetch) return;

    let mounted = true;

    const fetchData = async () => {
      try {
        if (!data) setIsLoading(true);
        const nextEnvelope = await getHomeSupportPayloadEnvelope();
        if (!mounted) return;
        setData(nextEnvelope.data);
        setFreshness(nextEnvelope.freshness || null);
        setError(null);
        setLastSyncedAt(nextEnvelope.freshness?.updatedAt || new Date().toISOString());
      } catch (errorValue) {
        if (!mounted) return;
        setError(
          errorValue instanceof Error
            ? errorValue
            : new Error('Failed to load home supporting cards'),
        );
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    void fetchData();
    const interval = window.setInterval(fetchData, refreshIntervalMs);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, [refreshIntervalMs, shouldFetch]);

  return useMemo(
    () => ({
      data,
      freshness,
      isLoading,
      error,
      isLive: shouldFetch && Boolean(data),
      lastSyncedAt,
    }),
    [data, freshness, error, isLoading, lastSyncedAt, shouldFetch],
  );
}
