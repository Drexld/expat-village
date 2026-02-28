import { useEffect, useMemo, useState } from 'react';
import { hasApiBaseUrl } from '../http';
import {
  checkInFlavorRestaurant,
  getFlavorDayBundle,
} from '../repositories/flavorRepository';
import type { FlavorDayBundle } from '../types';

interface UseFlavorDaysOptions {
  enabled?: boolean;
  refreshIntervalMs?: number;
}

interface UseFlavorDaysResult {
  data: FlavorDayBundle | null;
  isLoading: boolean;
  isRefreshing: boolean;
  isCheckingIn: boolean;
  error: Error | null;
  isLive: boolean;
  lastSyncedAt: string | null;
  checkIn: (restaurantId: string) => Promise<void>;
}

export function useFlavorDays(options: UseFlavorDaysOptions = {}): UseFlavorDaysResult {
  const { enabled = true, refreshIntervalMs = 3 * 60 * 1000 } = options;
  const [data, setData] = useState<FlavorDayBundle | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
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
        const next = await getFlavorDayBundle();
        if (!mounted) return;
        setData(next);
        setError(null);
        setLastSyncedAt(new Date().toISOString());
      } catch (errorValue) {
        if (!mounted) return;
        setError(
          errorValue instanceof Error
            ? errorValue
            : new Error('Failed to load Flavor Days feed'),
        );
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
  }, [refreshIntervalMs, shouldFetch]);

  const checkIn = async (restaurantId: string) => {
    if (!shouldFetch) {
      throw new Error('Flavor Days API is not configured.');
    }
    if (!restaurantId) {
      throw new Error('restaurantId is required.');
    }

    setIsCheckingIn(true);
    try {
      await checkInFlavorRestaurant({ restaurantId });
      const refreshed = await getFlavorDayBundle();
      setData(refreshed);
      setLastSyncedAt(new Date().toISOString());
    } finally {
      setIsCheckingIn(false);
    }
  };

  return useMemo(
    () => ({
      data,
      isLoading,
      isRefreshing,
      isCheckingIn,
      error,
      isLive: shouldFetch && Boolean(data),
      lastSyncedAt,
      checkIn,
    }),
    [
      checkIn,
      data,
      error,
      isCheckingIn,
      isLoading,
      isRefreshing,
      lastSyncedAt,
      shouldFetch,
    ],
  );
}

