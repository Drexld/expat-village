import { DEFAULT_CSP, HEADER_REQUEST_ID, SECURITY_HEADERS } from './constants';
import type { ApiErrorEnvelope, ApiSuccessEnvelope, FreshnessMeta, JsonValue } from './types';

function mergeHeaders(
  inputHeaders: HeadersInit | undefined,
  requestId: string,
  origin?: string | null,
): Headers {
  const headers = new Headers(inputHeaders || {});
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('Content-Security-Policy', DEFAULT_CSP);
  headers.set(HEADER_REQUEST_ID, requestId);

  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    headers.set(key, value);
  });

  if (origin) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Credentials', 'true');
    headers.set('Vary', 'Origin');
  }

  return headers;
}

export function jsonOk<T>(
  data: T,
  requestId: string,
  options?: {
    status?: number;
    headers?: HeadersInit;
    origin?: string | null;
    freshness?: FreshnessMeta;
  },
): Response {
  const payload: ApiSuccessEnvelope<T> = { data };
  if (options?.freshness) {
    payload.freshness = options.freshness;
  }
  return new Response(JSON.stringify(payload), {
    status: options?.status ?? 200,
    headers: mergeHeaders(options?.headers, requestId, options?.origin),
  });
}

export function jsonError(
  status: number,
  code: string,
  message: string,
  requestId: string,
  options?: { details?: JsonValue; headers?: HeadersInit; origin?: string | null },
): Response {
  const payload: ApiErrorEnvelope = {
    error: {
      code,
      message,
      requestId,
      details: options?.details,
    },
  };

  return new Response(JSON.stringify(payload), {
    status,
    headers: mergeHeaders(options?.headers, requestId, options?.origin),
  });
}

export function preflightResponse(requestId: string, origin: string): Response {
  const headers = mergeHeaders(
    {
      'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
      'Access-Control-Allow-Headers':
        'Authorization,Content-Type,X-Requested-With,X-Request-Id',
      'Access-Control-Max-Age': '600',
    },
    requestId,
    origin,
  );
  return new Response(null, {
    status: 204,
    headers,
  });
}
