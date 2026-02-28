import { useEffect, useMemo, useState } from 'react';
import { hasApiBaseUrl } from '../http';
import { getHomePulseEnvelope } from '../repositories/homePulseRepository';
import type { FreshnessMeta, HomePulse } from '../types';

interface UseHomePulseOptions {
  enabled?: boolean;
  refreshIntervalMs?: number;
}

interface UseHomePulseResult {
  data: HomePulse | null;
  freshness: FreshnessMeta | null;
  isLoading: boolean;
  error: Error | null;
  isLive: boolean;
  lastSyncedAt: string | null;
}

export function useHomePulse(options: UseHomePulseOptions = {}): UseHomePulseResult {
  const { enabled = true, refreshIntervalMs = 5 * 60 * 1000 } = options;
  const [data, setData] = useState<HomePulse | null>(null);
  const [freshness, setFreshness] = useState<FreshnessMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const shouldFetch = enabled && hasApiBaseUrl();

  useEffect(() => {
    if (!shouldFetch) {
      return;
    }

    let mounted = true;

    const fetchPulse = async () => {
      try {
        if (!data) {
          setIsLoading(true);
        }
        const nextEnvelope = await getHomePulseEnvelope();
        if (!mounted) return;
        setData(nextEnvelope.data);
        setFreshness(nextEnvelope.freshness || null);
        setError(null);
        setLastSyncedAt(nextEnvelope.freshness?.updatedAt || new Date().toISOString());
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err : new Error('Failed to load home pulse'));
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    void fetchPulse();
    const interval = window.setInterval(fetchPulse, refreshIntervalMs);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, [shouldFetch, refreshIntervalMs]);

  return useMemo(
    () => ({
      data,
      freshness,
      isLoading,
      error,
      isLive: shouldFetch && Boolean(data),
      lastSyncedAt,
    }),
    [data, freshness, isLoading, error, shouldFetch, lastSyncedAt],
  );
}
