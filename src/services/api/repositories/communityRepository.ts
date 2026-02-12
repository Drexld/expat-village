import { apiGet, apiPost } from '../http';
import type {
  CommunityCreateCommentInput,
  CommunityCreatePostInput,
  CommunityPostSummary,
  CommunityReactInput,
} from '../types';

export interface CommunityPostsParams {
  filter?: 'all' | 'hot' | 'new' | 'questions' | 'wins';
}

export async function getCommunityPosts(params: CommunityPostsParams = {}): Promise<CommunityPostSummary[]> {
  const search = new URLSearchParams();
  if (params.filter) search.set('filter', params.filter);
  const query = search.toString();
  return apiGet<CommunityPostSummary[]>(`/api/community/posts${query ? `?${query}` : ''}`);
}

export async function createCommunityPost(input: CommunityCreatePostInput): Promise<CommunityPostSummary> {
  return apiPost<CommunityPostSummary>('/api/community/posts', input);
}

export async function createCommunityComment(postId: string, input: CommunityCreateCommentInput): Promise<void> {
  await apiPost<void>(`/api/community/posts/${postId}/comments`, input);
}

export async function reactToCommunityPost(postId: string, input: CommunityReactInput): Promise<void> {
  await apiPost<void>(`/api/community/posts/${postId}/reactions`, input);
}
