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

const fallbackPolls: PollSummary[] = [
  {
    id: 'daily-song-1',
    type: 'song',
    period: 'daily',
    question: 'Song of the Day',
    options: [
      { id: '1', title: '5/6', artist: 'Daria Zawialow', year: '2019', votes: 342, preview: 'spotify' },
      { id: '2', title: 'Wehikul Czasu', artist: 'Dawid Podsiadlo', year: '2018', votes: 287, preview: 'spotify' },
      { id: '3', title: 'Lubie', artist: 'C-BooL', year: '2015', votes: 198, preview: 'spotify' },
      { id: '4', title: 'Jestem Bogiem', artist: 'Paktofonika', year: '2000', votes: 156, preview: 'spotify' },
    ],
    totalVotes: 983,
    endsAt: 'Tonight at 23:59',
  },
  {
    id: 'monthly-series-1',
    type: 'series',
    period: 'monthly',
    question: 'Series of the Month - February',
    options: [
      { id: '1', title: 'The Office (US)', year: '2005', votes: 456 },
      { id: '2', title: 'Breaking Bad', year: '2008', votes: 389 },
      { id: '3', title: 'Stranger Things', year: '2016', votes: 298 },
      { id: '4', title: 'The Crown', year: '2016', votes: 234 },
    ],
    totalVotes: 1377,
    endsAt: 'Feb 28, 2026',
  },
];

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
    if (!shouldFetch) {
      setData(fallbackPolls);
      setLastSyncedAt(new Date().toISOString());
      return;
    }

    let mounted = true;

    const fetchPolls = async () => {
      try {
        if (!data) setIsLoading(true);
        const next = await getActivePolls();
        if (!mounted) return;
        setData(next.length ? next : fallbackPolls);
        setError(null);
        setLastSyncedAt(new Date().toISOString());
      } catch (err) {
        if (!mounted) return;
        setData((prev) => prev || fallbackPolls);
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
    const snapshot = data ? data.map((poll) => ({ ...poll, options: poll.options.map((opt) => ({ ...opt })) })) : null;
    const base = data || fallbackPolls;
    setData(applyVote(base, pollId, optionId));

    if (!shouldFetch) return;

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

