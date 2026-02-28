import { useEffect, useMemo, useState } from 'react';
import { hasApiBaseUrl } from '../http';
import { getActivePolls, votePoll } from '../repositories/pollsRepository';
import type { PollSummary } from '../types';

interface UsePollsOptions {
  enabled?: boolean;
  refreshIntervalMs?: number;
}

interface UsePollsResult {
  data: PollSummary[] | null;
  isLoading: boolean;
  error: Error | null;
  isLive: boolean;
  lastSyncedAt: string | null;
  submitVote: (pollId: string, optionId: string) => Promise<void>;
}

function applyVote(polls: PollSummary[], pollId: string, optionId: string): PollSummary[] {
  return polls.map((poll) => {
    if (poll.id !== pollId) return poll;
    return {
      ...poll,
      totalVotes: poll.totalVotes + 1,
      options: poll.options.map((option) =>
        option.id === optionId ? { ...option, votes: option.votes + 1 } : option,
      ),
    };
  });
}

export function usePolls(options: UsePollsOptions = {}): UsePollsResult {
  const { enabled = true, refreshIntervalMs = 2 * 60 * 1000 } = options;
  const [data, setData] = useState<PollSummary[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const shouldFetch = enabled && hasApiBaseUrl();

  useEffect(() => {
    if (!shouldFetch) return;

    let mounted = true;

    const fetchPolls = async () => {
      try {
        if (!data) setIsLoading(true);
        const next = await getActivePolls();
        if (!mounted) return;
        setData(next);
        setError(null);
        setLastSyncedAt(new Date().toISOString());
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err : new Error('Failed to load active polls'));
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    void fetchPolls();
    const interval = window.setInterval(fetchPolls, refreshIntervalMs);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, [shouldFetch, refreshIntervalMs]);

  const submitVote = async (pollId: string, optionId: string) => {
    if (!shouldFetch) {
      throw new Error('Polls API is not configured.');
    }
    if (!data) {
      throw new Error('Poll data is not loaded yet.');
    }

    const snapshot = data ? data.map((poll) => ({ ...poll, options: poll.options.map((opt) => ({ ...opt })) })) : null;
    const base = data;
    setData(applyVote(base, pollId, optionId));

    try {
      await votePoll(pollId, { optionId });
    } catch (err) {
      if (snapshot) setData(snapshot);
      throw err instanceof Error ? err : new Error('Failed to submit vote');
    }
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
