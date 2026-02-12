import { apiGet, apiPost } from '../http';
import type { ServiceReview, ServiceReviewInput, ServiceSummary } from '../types';

export interface ServiceSearchParams {
  query?: string;
  category?: string;
  district?: string;
}

function encodeQuery(params: ServiceSearchParams): string {
  const qp = new URLSearchParams();
  if (params.query) qp.set('q', params.query);
  if (params.category) qp.set('category', params.category);
  if (params.district) qp.set('district', params.district);
  const query = qp.toString();
  return query ? `?${query}` : '';
}

export async function getServices(params: ServiceSearchParams = {}): Promise<ServiceSummary[]> {
  return apiGet<ServiceSummary[]>(`/api/services${encodeQuery(params)}`);
}

export async function createServiceCheckin(serviceId: string): Promise<void> {
  await apiPost<void>(`/api/services/${serviceId}/checkin`);
}

export async function getServiceReviews(serviceId: string): Promise<ServiceReview[]> {
  return apiGet<ServiceReview[]>(`/api/services/${serviceId}/reviews`);
}

export async function createServiceReview(serviceId: string, input: ServiceReviewInput): Promise<ServiceReview> {
  return apiPost<ServiceReview>(`/api/services/${serviceId}/reviews`, input);
}
