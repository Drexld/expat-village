import { apiGet, apiGetEnvelope } from '../http';
import type { ApiEnvelope, DailyBriefing, HomePulse } from '../types';

export async function getHomePulse(): Promise<HomePulse> {
  const envelope = await getHomePulseEnvelope();
  return envelope.data;
}

export async function getHomePulseEnvelope(): Promise<ApiEnvelope<HomePulse>> {
  return apiGetEnvelope<HomePulse>('/api/pulse/home');
}

export async function getTodayBriefing(): Promise<DailyBriefing> {
  return apiGet<DailyBriefing>('/api/briefing/today');
}
