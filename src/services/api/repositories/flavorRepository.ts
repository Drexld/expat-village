import { apiGet, apiPost } from '../http';
import type {
  FlavorCheckinInput,
  FlavorCheckinResult,
  FlavorDayBundle,
  FlavorLeaderboardEntry,
} from '../types';

export async function getFlavorDayBundle(): Promise<FlavorDayBundle> {
  return apiGet<FlavorDayBundle>('/api/flavor/day');
}

export async function getFlavorLeaderboard(): Promise<FlavorLeaderboardEntry[]> {
  return apiGet<FlavorLeaderboardEntry[]>('/api/flavor/leaderboard');
}

export async function checkInFlavorRestaurant(
  input: FlavorCheckinInput,
): Promise<FlavorCheckinResult> {
  return apiPost<FlavorCheckinResult>('/api/flavor/checkin', input);
}

