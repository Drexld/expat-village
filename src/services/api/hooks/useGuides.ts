import { useEffect, useMemo, useState } from 'react';
import { hasApiBaseUrl } from '../http';
import { getGuides, getGuideUpdates, voteGuide } from '../repositories/guidesRepository';
import type { GuideSummary } from '../types';

interface UseGuidesOptions {
  enabled?: boolean;
  refreshIntervalMs?: number;
}

interface UseGuidesResult {
  data: GuideSummary[] | null;
  isLoading: boolean;
  error: Error | null;
  isLive: boolean;
  lastSyncedAt: string | null;
  submitVote: (guideId: string, vote: -1 | 1) => Promise<void>;
}

function mergeGuides(base: GuideSummary[], updates: GuideSummary[]): GuideSummary[] {
  if (!updates.length) return base;

  const updatesById = new Map(updates.map((item) => [item.id, item]));

  return base.map((guide) => {
    const update = updatesById.get(guide.id);
    if (!update) return guide;
    return {
      ...guide,
      realTimeData: update.realTimeData || guide.realTimeData,
      updatedAt: update.updatedAt || guide.updatedAt,
      trending: update.trending ?? guide.trending,
    };
  });
}

export function useGuides(options: UseGuidesOptions = {}): UseGuidesResult {
  const { enabled = true, refreshIntervalMs = 10 * 60 * 1000 } = options;
  const [data, setData] = useState<GuideSummary[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const shouldFetch = enabled && hasApiBaseUrl();

  useEffect(() => {
    if (!shouldFetch) return;

    let mounted = true;

    const fetchGuides = async () => {
      try {
        if (!data) setIsLoading(true);
        const [guides, updates] = await Promise.all([getGuides(), getGuideUpdates()]);
        if (!mounted) return;
        setData(mergeGuides(guides, updates));
        setError(null);
        setLastSyncedAt(new Date().toISOString());
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err : new Error('Failed to load guides'));
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    void fetchGuides();
    const interval = window.setInterval(fetchGuides, refreshIntervalMs);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, [shouldFetch, refreshIntervalMs]);

  const submitVote = async (guideId: string, vote: -1 | 1) => {
    if (!shouldFetch) return;
    await voteGuide(guideId, vote);
  };

  return useMemo(
    () => ({
      data,
      isLoading,
      error,
      isLive: shouldFetch && Boolean(data),
      lastSyncedAt,
      submitVote,
    }),
    [data, isLoading, error, shouldFetch, lastSyncedAt],
  );
}
