import { useEffect, useMemo, useState } from 'react';
import { hasApiBaseUrl } from '../http';
import {
  createCommunityComment,
  createCommunityPost,
  getCommunityPosts,
  reactToCommunityPost,
} from '../repositories/communityRepository';
import type {
  CommunityCreateCommentInput,
  CommunityCreatePostInput,
  CommunityPostSummary,
  CommunityReactInput,
} from '../types';

export type CommunityApiFilter = 'all' | 'hot' | 'new' | 'questions' | 'wins';

interface UseCommunityOptions {
  enabled?: boolean;
  filter?: CommunityApiFilter;
  refreshIntervalMs?: number;
}

interface UseCommunityResult {
  data: CommunityPostSummary[] | null;
  isLoading: boolean;
  error: Error | null;
  isLive: boolean;
  lastSyncedAt: string | null;
  createPost: (input: CommunityCreatePostInput) => Promise<CommunityPostSummary>;
  reactToPost: (postId: string, input: CommunityReactInput) => Promise<void>;
  addComment: (postId: string, input: CommunityCreateCommentInput) => Promise<void>;
}

export function useCommunity(options: UseCommunityOptions = {}): UseCommunityResult {
  const { enabled = true, filter = 'all', refreshIntervalMs = 60 * 1000 } = options;
  const [data, setData] = useState<CommunityPostSummary[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const shouldFetch = enabled && hasApiBaseUrl();

  useEffect(() => {
    if (!shouldFetch) return;

    let mounted = true;

    const fetchPosts = async () => {
      try {
        if (!data) setIsLoading(true);
        const next = await getCommunityPosts({ filter });
        if (!mounted) return;
        setData(next);
        setError(null);
        setLastSyncedAt(new Date().toISOString());
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err : new Error('Failed to load community posts'));
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    void fetchPosts();
    const interval = window.setInterval(fetchPosts, refreshIntervalMs);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, [shouldFetch, filter, refreshIntervalMs]);

  const createPost = async (input: CommunityCreatePostInput): Promise<CommunityPostSummary> => {
    if (!shouldFetch) {
      return {
        id: `local-${Date.now()}`,
        authorName: 'You',
        title: input.title,
        preview: input.body,
        likes: 0,
        replies: 0,
        createdAt: new Date().toISOString(),
      };
    }
    return createCommunityPost(input);
  };

  const reactToPost = async (postId: string, input: CommunityReactInput) => {
    if (!shouldFetch) return;
    await reactToCommunityPost(postId, input);
  };

  const addComment = async (postId: string, input: CommunityCreateCommentInput) => {
    if (!shouldFetch) return;
    await createCommunityComment(postId, input);
  };

  return useMemo(
    () => ({
      data,
      isLoading,
      error,
      isLive: shouldFetch && Boolean(data),
      lastSyncedAt,
      createPost,
      reactToPost,
      addComment,
    }),
    [data, isLoading, error, shouldFetch, lastSyncedAt],
  );
}
