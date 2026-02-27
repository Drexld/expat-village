import { HEADER_RATE_LIMIT_REMAINING, HEADER_RATE_LIMIT_RESET } from './constants';
import { buildAuthContext } from './auth';
import { isOriginAllowed, parseAllowedOrigins, getRequestOrigin } from './cors';
import {
  badRequest,
  forbidden,
  internalError,
  rateLimited,
  unauthorized,
  type ApiSecurityError,
} from './errors';
import { evaluateRateLimit, resolveClientIp } from './rateLimit';
import { jsonError, jsonOk, preflightResponse } from './response';
import { logSecurityEvent } from './audit';
import { parseJsonBody } from './validation';
import { isValidationFailure } from './types';
import type { ApiHandler, SecurityRouteConfig } from './types';

function envValue(name: string): string | undefined {
  const maybeProcess = globalThis as unknown as { process?: { env?: Record<string, string | undefined> } };
  return maybeProcess.process?.env?.[name];
}

function hasIntersection(base: string[], required: string[]): boolean {
  if (!required.length) return true;
  const set = new Set(base);
  return required.some((value) => set.has(value));
}

function toSecurityError(error: unknown): ApiSecurityError {
  if (error && typeof error === 'object' && 'status' in error && 'code' in error && 'message' in error) {
    return error as ApiSecurityError;
  }
  return internalError();
}

export function withSecurity<TBody, TResult>(
  config: SecurityRouteConfig<TBody>,
  handler: ApiHandler<TBody, TResult>,
): (request: Request) => Promise<Response> {
  return async (request: Request): Promise<Response> => {
    const startedAtMs = Date.now();
    const requestId = request.headers.get('x-request-id') || crypto.randomUUID();
    const ip = resolveClientIp(request);
    const routeId = config.routeId;
    const origin = getRequestOrigin(request);
    const allowedOrigins = config.allowedOrigins || parseAllowedOrigins(envValue('API_CORS_ORIGINS'));
    const requestOrigin = new URL(request.url).origin;
    const effectiveAllowedOrigins = allowedOrigins.length ? allowedOrigins : [requestOrigin];

    try {
      if (origin && !isOriginAllowed(origin, effectiveAllowedOrigins)) {
        logSecurityEvent({
          type: 'cors_blocked',
          routeId,
          requestId,
          ip,
          detail: { origin },
          status: 403,
        });
        throw forbidden('Origin not allowed');
      }

      if (request.method === 'OPTIONS') {
        if (!origin) throw badRequest('Preflight origin is required');
        return preflightResponse(requestId, origin);
      }

      const auth = await buildAuthContext(request, config.tokenVerifier);

      if (config.requireAuth && !auth.userId) {
        logSecurityEvent({
          type: 'auth_failed',
          routeId,
          requestId,
          ip,
          detail: { reason: 'missing_or_invalid_token' },
          status: 401,
        });
        throw unauthorized();
      }

      if (config.requiredRoles?.length && !hasIntersection(auth.roles, config.requiredRoles)) {
        logSecurityEvent({
          type: 'auth_forbidden',
          routeId,
          requestId,
          ip,
          userId: auth.userId,
          detail: { requiredRoles: config.requiredRoles, actualRoles: auth.roles },
          status: 403,
        });
        throw forbidden('Missing required role');
      }

      if (config.requiredEntitlements?.length && !hasIntersection(auth.entitlements, config.requiredEntitlements)) {
        logSecurityEvent({
          type: 'auth_forbidden',
          routeId,
          requestId,
          ip,
          userId: auth.userId,
          detail: {
            requiredEntitlements: config.requiredEntitlements,
            actualEntitlements: auth.entitlements,
          },
          status: 403,
        });
        throw forbidden('Missing required entitlement');
      }

      let rateMeta: { remaining: number; resetAtEpochMs: number } | undefined;
      if (config.rateLimit) {
        const actor = auth.userId || ip;
        const decision = evaluateRateLimit(`${routeId}:${actor}`, config.rateLimit);
        rateMeta = { remaining: decision.remaining, resetAtEpochMs: decision.resetAtEpochMs };
        if (!decision.allowed) {
          logSecurityEvent({
            type: 'rate_limited',
            routeId,
            requestId,
            ip,
            userId: auth.userId,
            detail: {
              limit: config.rateLimit.max,
              windowMs: config.rateLimit.windowMs,
              resetAtEpochMs: decision.resetAtEpochMs,
            },
            status: 429,
          });
          throw rateLimited(decision.resetAtEpochMs);
        }
      }

      let body = undefined as unknown as TBody;
      if (config.validateBody) {
        const parsed = await parseJsonBody(request, config.validateBody);
        if (isValidationFailure(parsed)) {
          logSecurityEvent({
            type: 'validation_failed',
            routeId,
            requestId,
            ip,
            userId: auth.userId,
            detail: { errors: parsed.errors },
            status: 400,
          });
          throw badRequest('Request body validation failed', parsed.errors);
        }
        body = parsed.value;
      }

      const data = await handler(request, {
        requestId,
        ip,
        auth,
        body,
        startedAtMs,
      });

      const response = jsonOk(data, requestId, { origin });
      if (rateMeta) {
        response.headers.set(HEADER_RATE_LIMIT_REMAINING, String(rateMeta.remaining));
        response.headers.set(HEADER_RATE_LIMIT_RESET, String(rateMeta.resetAtEpochMs));
      }

      logSecurityEvent({
        type: 'request_success',
        routeId,
        requestId,
        ip,
        userId: auth.userId,
        status: response.status,
        durationMs: Date.now() - startedAtMs,
      });

      return response;
    } catch (error) {
      const mapped = toSecurityError(error);
      logSecurityEvent({
        type: 'request_error',
        routeId,
        requestId,
        ip,
        status: mapped.status,
        detail: {
          code: mapped.code,
          message: mapped.message,
          details: mapped.details,
        },
        durationMs: Date.now() - startedAtMs,
      });

      return jsonError(mapped.status, mapped.code, mapped.message, requestId, {
        details: mapped.details,
        origin: origin && isOriginAllowed(origin, effectiveAllowedOrigins) ? origin : null,
      });
    }
  };
}
