import { apiGet, apiPost } from '../http';
import type { PollSummary, PollVoteInput } from '../types';

export async function getActivePolls(): Promise<PollSummary[]> {
  return apiGet<PollSummary[]>('/api/polls/active');
}

export async function votePoll(pollId: string, input: PollVoteInput): Promise<void> {
  await apiPost<void>(`/api/polls/${pollId}/vote`, input);
}

