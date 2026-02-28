import { apiGet } from '../http';
import type { HomeSupportPayload } from '../types';

export async function getHomeSupportPayload(): Promise<HomeSupportPayload> {
  return apiGet<HomeSupportPayload>('/api/home/support');
}

