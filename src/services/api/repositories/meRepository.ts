import { apiGet, apiPatch } from '../http';
import type { MeProfile, MeProgress } from '../types';

export interface UpdateMeProfileInput {
  displayName?: string;
  mood?: string;
  language?: string;
  bio?: string;
}

export async function getMe(): Promise<MeProfile> {
  return apiGet<MeProfile>('/api/me');
}

export async function updateMeProfile(input: UpdateMeProfileInput): Promise<MeProfile> {
  return apiPatch<MeProfile>('/api/me/profile', input);
}

export async function getMeProgress(): Promise<MeProgress> {
  return apiGet<MeProgress>('/api/me/progress');
}
