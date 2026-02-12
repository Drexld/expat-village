import { apiGet, apiPost } from '../http';
import type { GuideSummary } from '../types';

export async function getGuides(): Promise<GuideSummary[]> {
  return apiGet<GuideSummary[]>('/api/guides');
}

export async function getGuideUpdates(): Promise<GuideSummary[]> {
  return apiGet<GuideSummary[]>('/api/guides/updates/feed');
}

export async function voteGuide(guideId: string, vote: -1 | 1): Promise<void> {
  await apiPost<void>(`/api/guides/${guideId}/vote`, { vote });
}
