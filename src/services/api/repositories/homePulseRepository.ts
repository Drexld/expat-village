import { apiGet } from '../http';
import type { DailyBriefing, HomePulse } from '../types';

export async function getHomePulse(): Promise<HomePulse> {
  return apiGet<HomePulse>('/api/pulse/home');
}

export async function getTodayBriefing(): Promise<DailyBriefing> {
  return apiGet<DailyBriefing>('/api/briefing/today');
}
