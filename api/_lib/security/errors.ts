import type { JsonValue } from './types';

export class ApiSecurityError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: JsonValue;

  constructor(status: number, code: string, message: string, details?: JsonValue) {
    super(message);
    this.name = 'ApiSecurityError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function unauthorized(message = 'Authentication required'): ApiSecurityError {
  return new ApiSecurityError(401, 'UNAUTHORIZED', message);
}

export function forbidden(message = 'Insufficient permissions'): ApiSecurityError {
  return new ApiSecurityError(403, 'FORBIDDEN', message);
}

export function badRequest(message: string, details?: JsonValue): ApiSecurityError {
  return new ApiSecurityError(400, 'BAD_REQUEST', message, details);
}

export function methodNotAllowed(message = 'Method not allowed'): ApiSecurityError {
  return new ApiSecurityError(405, 'METHOD_NOT_ALLOWED', message);
}

export function rateLimited(resetAtEpochMs: number): ApiSecurityError {
  return new ApiSecurityError(429, 'RATE_LIMITED', 'Too many requests', {
    resetAtEpochMs,
  });
}

export function internalError(message = 'Internal server error'): ApiSecurityError {
  return new ApiSecurityError(500, 'INTERNAL_ERROR', message);
}
