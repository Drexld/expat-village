import { useEffect, useMemo, useState } from 'react';
import { hasApiBaseUrl } from '../http';
import { getTodayBriefing } from '../repositories/homePulseRepository';
import type { DailyBriefing } from '../types';

interface UseDailyBriefingOptions {
  enabled?: boolean;
  refreshIntervalMs?: number;
}

interface UseDailyBriefingResult {
  data: DailyBriefing | null;
  isLoading: boolean;
  error: Error | null;
  isLive: boolean;
  lastSyncedAt: string | null;
}

export function useDailyBriefing(options: UseDailyBriefingOptions = {}): UseDailyBriefingResult {
  const { enabled = true, refreshIntervalMs = 15 * 60 * 1000 } = options;
  const [data, setData] = useState<DailyBriefing | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const shouldFetch = enabled && hasApiBaseUrl();

  useEffect(() => {
    if (!shouldFetch) {
      return;
    }

    let mounted = true;

    const fetchBriefing = async () => {
      try {
        if (!data) {
          setIsLoading(true);
        }
        const next = await getTodayBriefing();
        if (!mounted) return;
        setData(next);
        setError(null);
        setLastSyncedAt(new Date().toISOString());
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err : new Error('Failed to load briefing'));
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    void fetchBriefing();
    const interval = window.setInterval(fetchBriefing, refreshIntervalMs);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, [shouldFetch, refreshIntervalMs]);

  return useMemo(
    () => ({
      data,
      isLoading,
      error,
      isLive: shouldFetch && Boolean(data),
      lastSyncedAt,
    }),
    [data, isLoading, error, shouldFetch, lastSyncedAt],
  );
}
