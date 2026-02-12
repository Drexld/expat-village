import { useEffect, useMemo, useState } from 'react';
import { hasApiBaseUrl } from '../http';
import { getMe, getMeProgress, updateMeProfile } from '../repositories/meRepository';
import type { MeProfile, MeProgress } from '../types';

interface UseMeProfileProgressOptions {
  enabled?: boolean;
  refreshIntervalMs?: number;
}

interface UseMeProfileProgressResult {
  profile: MeProfile | null;
  progress: MeProgress | null;
  isLoading: boolean;
  error: Error | null;
  isLive: boolean;
  lastSyncedAt: string | null;
  saveProfile: (input: { displayName?: string; bio?: string; mood?: string; language?: string }) => Promise<void>;
}

export function useMeProfileProgress(
  options: UseMeProfileProgressOptions = {},
): UseMeProfileProgressResult {
  const { enabled = true, refreshIntervalMs = 5 * 60 * 1000 } = options;
  const [profile, setProfile] = useState<MeProfile | null>(null);
  const [progress, setProgress] = useState<MeProgress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const shouldFetch = enabled && hasApiBaseUrl();

  useEffect(() => {
    if (!shouldFetch) return;

    let mounted = true;

    const fetchData = async () => {
      try {
        if (!profile && !progress) setIsLoading(true);
        const [nextProfile, nextProgress] = await Promise.all([getMe(), getMeProgress()]);
        if (!mounted) return;
        setProfile(nextProfile);
        setProgress(nextProgress);
        setError(null);
        setLastSyncedAt(new Date().toISOString());
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err : new Error('Failed to load profile data'));
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
  }, [shouldFetch, refreshIntervalMs]);

  const saveProfile = async (input: { displayName?: string; bio?: string; mood?: string; language?: string }) => {
    if (!shouldFetch) return;
    const updated = await updateMeProfile(input);
    setProfile(updated);
  };

  return useMemo(
    () => ({
      profile,
      progress,
      isLoading,
      error,
      isLive: shouldFetch && Boolean(profile || progress),
      lastSyncedAt,
      saveProfile,
    }),
    [profile, progress, isLoading, error, shouldFetch, lastSyncedAt],
  );
}

