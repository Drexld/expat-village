import { runtimeConfig } from '../../config/runtime';
import type { ApiEnvelope } from './types';

export class ApiClientError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status = 0, details?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.details = details;
  }
}

export interface RequestOptions extends RequestInit {
  signal?: AbortSignal;
}

function withBaseUrl(path: string): string {
  const base = runtimeConfig.apiBaseUrl.replace(/\/+$/, '');
  const route = path.startsWith('/') ? path : `/${path}`;
  return `${base}${route}`;
}

async function parseError(response: Response): Promise<never> {
  let details: unknown;
  try {
    details = await response.json();
  } catch {
    details = await response.text().catch(() => null);
  }
  throw new ApiClientError(`API request failed (${response.status})`, response.status, details);
}

export function hasApiBaseUrl(): boolean {
  return Boolean(runtimeConfig.apiBaseUrl);
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!hasApiBaseUrl()) {
    throw new ApiClientError('VITE_API_BASE_URL is not configured.');
  }

  const response = await fetch(withBaseUrl(path), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    await parseError(response);
  }

  const payload = (await response.json()) as ApiEnvelope<T> | T;
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiEnvelope<T>).data;
  }

  return payload as T;
}

export function apiGet<T>(path: string, options: RequestOptions = {}): Promise<T> {
  return apiRequest<T>(path, { ...options, method: 'GET' });
}

export function apiPost<T>(path: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
  return apiRequest<T>(path, {
    ...options,
    method: 'POST',
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export function apiPatch<T>(path: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
  return apiRequest<T>(path, {
    ...options,
    method: 'PATCH',
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
