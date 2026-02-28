import { useEffect, useMemo, useState } from 'react';
import { hasApiBaseUrl } from '../http';
import { getHomeSupportPayload } from '../repositories/homeRepository';
import type { HomeSupportPayload } from '../types';

interface UseHomeSupportOptions {
  enabled?: boolean;
  refreshIntervalMs?: number;
}

interface UseHomeSupportResult {
  data: HomeSupportPayload | null;
  isLoading: boolean;
  error: Error | null;
  isLive: boolean;
  lastSyncedAt: string | null;
}

export function useHomeSupport(options: UseHomeSupportOptions = {}): UseHomeSupportResult {
  const { enabled = true, refreshIntervalMs = 2 * 60 * 1000 } = options;
  const [data, setData] = useState<HomeSupportPayload | null>(null);
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
        const next = await getHomeSupportPayload();
        if (!mounted) return;
        setData(next);
        setError(null);
        setLastSyncedAt(new Date().toISOString());
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
      isLoading,
      error,
      isLive: shouldFetch && Boolean(data),
      lastSyncedAt,
    }),
    [data, error, isLoading, lastSyncedAt, shouldFetch],
  );
}
