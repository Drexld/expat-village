import { apiGetEnvelope } from '../http';
import type { ApiEnvelope, HomeSupportPayload } from '../types';

export async function getHomeSupportPayloadEnvelope(): Promise<ApiEnvelope<HomeSupportPayload>> {
  return apiGetEnvelope<HomeSupportPayload>('/api/home/support');
}
