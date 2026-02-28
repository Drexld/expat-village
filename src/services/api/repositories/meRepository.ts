import { apiGet, apiPatch } from '../http';
import type { MePreferences, MeProfile, MeProgress } from '../types';

export interface UpdateMeProfileInput {
  displayName?: string;
  mood?: string;
  language?: string;
  bio?: string;
  notificationsEnabled?: boolean;
  tribe?: string;
  interest?: string;
  onboardingCompleted?: boolean;
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

export interface UpdateMePreferencesInput {
  mood?: string;
  language?: string;
  notificationsEnabled?: boolean;
  morningBriefingSeenDate?: string;
  moodCheckSeenDate?: string;
}

export async function getMePreferences(): Promise<MePreferences> {
  return apiGet<MePreferences>('/api/me/preferences');
}

export async function updateMePreferences(
  input: UpdateMePreferencesInput,
): Promise<MePreferences> {
  return apiPatch<MePreferences>('/api/me/preferences', input);
}
