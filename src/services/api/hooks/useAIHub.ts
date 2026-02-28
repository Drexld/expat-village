import { useEffect, useMemo, useState } from 'react';
import { hasApiBaseUrl } from '../http';
import { analyzeAIHubScenario, getAIHubBundle } from '../repositories/aiRepository';
import type { AIHubBundle } from '../types';

interface UseAIHubOptions {
  enabled?: boolean;
  refreshIntervalMs?: number;
}

interface UseAIHubResult {
  data: AIHubBundle | null;
  isLoading: boolean;
  isRefreshing: boolean;
  isAnalyzing: boolean;
  error: Error | null;
  isLive: boolean;
  lastSyncedAt: string | null;
  analyzeScenario: (scenario: string) => Promise<void>;
}

export function useAIHub(options: UseAIHubOptions = {}): UseAIHubResult {
  const { enabled = true, refreshIntervalMs = 5 * 60 * 1000 } = options;
  const [data, setData] = useState<AIHubBundle | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const shouldFetch = enabled && hasApiBaseUrl();

  useEffect(() => {
    if (!shouldFetch) return;

    let mounted = true;

    const fetchBundle = async (background = false) => {
      try {
        if (!background) {
          setIsLoading(true);
        } else {
          setIsRefreshing(true);
        }

        const next = await getAIHubBundle();
        if (!mounted) return;
        setData(next);
        setError(null);
        setLastSyncedAt(new Date().toISOString());
      } catch (errorValue) {
        if (!mounted) return;
        setError(errorValue instanceof Error ? errorValue : new Error('Failed to load AI Hub'));
      } finally {
        if (!mounted) return;
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };

    void fetchBundle();
    const interval = window.setInterval(() => {
      void fetchBundle(true);
    }, refreshIntervalMs);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, [shouldFetch, refreshIntervalMs]);

  const analyzeScenario = async (scenario: string) => {
    if (!shouldFetch) {
      throw new Error('AI Hub API is not configured.');
    }
    const trimmed = scenario.trim();
    if (!trimmed) {
      throw new Error('Scenario is required.');
    }
    if (!data) {
      throw new Error('AI Hub data is not loaded yet.');
    }

    setIsAnalyzing(true);
    try {
      const nextAdvice = await analyzeAIHubScenario({ scenario: trimmed });
      setData((current) => {
        if (!current) return current;
        return {
          ...current,
          advice: nextAdvice,
          meta: {
            ...current.meta,
            updatedAt: new Date().toISOString(),
          },
        };
      });
      setLastSyncedAt(new Date().toISOString());
    } finally {
      setIsAnalyzing(false);
    }
  };

  return useMemo(
    () => ({
      data,
      isLoading,
      isRefreshing,
      isAnalyzing,
      error,
      isLive: shouldFetch && Boolean(data),
      lastSyncedAt,
      analyzeScenario,
    }),
    [
      data,
      isLoading,
      isRefreshing,
      isAnalyzing,
      error,
      shouldFetch,
      lastSyncedAt,
      analyzeScenario,
    ],
  );
}
