import { useEffect, useMemo, useState } from 'react';
import { hasApiBaseUrl } from '../http';
import {
  getMe,
  getMePreferences,
  getMeProgress,
  updateMePreferences,
  updateMeProfile,
} from '../repositories/meRepository';
import type { MePreferences, MeProfile, MeProgress } from '../types';

interface UseMeProfileProgressOptions {
  enabled?: boolean;
  refreshIntervalMs?: number;
}

interface UseMeProfileProgressResult {
  profile: MeProfile | null;
  progress: MeProgress | null;
  preferences: MePreferences | null;
  isLoading: boolean;
  error: Error | null;
  isLive: boolean;
  lastSyncedAt: string | null;
  saveProfile: (input: {
    displayName?: string;
    bio?: string;
    mood?: string;
    language?: string;
    tribe?: string;
    interest?: string;
    onboardingCompleted?: boolean;
  }) => Promise<void>;
  savePreferences: (input: {
    mood?: string;
    language?: string;
    notificationsEnabled?: boolean;
    morningBriefingSeenDate?: string;
    moodCheckSeenDate?: string;
  }) => Promise<void>;
}

export function useMeProfileProgress(
  options: UseMeProfileProgressOptions = {},
): UseMeProfileProgressResult {
  const { enabled = true, refreshIntervalMs = 5 * 60 * 1000 } = options;
  const [profile, setProfile] = useState<MeProfile | null>(null);
  const [progress, setProgress] = useState<MeProgress | null>(null);
  const [preferences, setPreferences] = useState<MePreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const shouldFetch = enabled && hasApiBaseUrl();

  useEffect(() => {
    if (!shouldFetch) return;

    let mounted = true;

    const fetchData = async () => {
      try {
        if (!profile && !progress && !preferences) setIsLoading(true);
        const [nextProfile, nextProgress, nextPreferences] = await Promise.all([
          getMe(),
          getMeProgress(),
          getMePreferences(),
        ]);
        if (!mounted) return;
        setProfile(nextProfile);
        setProgress(nextProgress);
        setPreferences(nextPreferences);
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

  const saveProfile = async (input: {
    displayName?: string;
    bio?: string;
    mood?: string;
    language?: string;
    tribe?: string;
    interest?: string;
    onboardingCompleted?: boolean;
  }) => {
    if (!shouldFetch) return;
    const updated = await updateMeProfile(input);
    setProfile(updated);
  };

  const savePreferences = async (input: {
    mood?: string;
    language?: string;
    notificationsEnabled?: boolean;
    morningBriefingSeenDate?: string;
    moodCheckSeenDate?: string;
  }) => {
    if (!shouldFetch) return;
    const updated = await updateMePreferences(input);
    setPreferences(updated);
  };

  return useMemo(
    () => ({
      profile,
      progress,
      preferences,
      isLoading,
      error,
      isLive: shouldFetch && Boolean(profile || progress || preferences),
      lastSyncedAt,
      saveProfile,
      savePreferences,
    }),
    [
      profile,
      progress,
      preferences,
      isLoading,
      error,
      shouldFetch,
      lastSyncedAt,
      saveProfile,
      savePreferences,
    ],
  );
}
