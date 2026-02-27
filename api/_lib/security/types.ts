export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export interface ApiSuccessEnvelope<T> {
  data: T;
}

export interface ApiErrorEnvelope {
  error: {
    code: string;
    message: string;
    requestId: string;
    details?: JsonValue;
  };
}

export interface TokenClaims {
  sub?: string;
  roles?: string[];
  entitlements?: string[];
  [key: string]: unknown;
}

export interface AuthContext {
  token: string | null;
  userId: string | null;
  roles: string[];
  entitlements: string[];
  claims?: TokenClaims;
}

export interface SecurityContext<TBody> {
  requestId: string;
  ip: string;
  auth: AuthContext;
  body: TBody;
  startedAtMs: number;
}

export type ApiHandler<TBody, TResult> = (
  request: Request,
  context: SecurityContext<TBody>,
) => Promise<TResult> | TResult;

export interface ValidationSuccess<T> {
  ok: true;
  value: T;
}

export interface ValidationFailure {
  ok: false;
  errors: string[];
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;
export type Validator<T> = (input: unknown) => ValidationResult<T>;

export function isValidationFailure<T>(
  result: ValidationResult<T>,
): result is ValidationFailure {
  return result.ok === false;
}

export interface RateLimitConfig {
  max: number;
  windowMs: number;
  keyPrefix?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAtEpochMs: number;
}

export interface TokenVerifierResult {
  userId: string;
  roles: string[];
  entitlements: string[];
  claims?: TokenClaims;
}

export type TokenVerifier = (token: string) => Promise<TokenVerifierResult | null>;

export interface SecurityRouteConfig<TBody> {
  routeId: string;
  validateBody?: Validator<TBody>;
  requireAuth?: boolean;
  requiredRoles?: string[];
  requiredEntitlements?: string[];
  allowedOrigins?: string[];
  rateLimit?: RateLimitConfig;
  tokenVerifier?: TokenVerifier;
}

export type SecurityAuditEventType =
  | 'auth_failed'
  | 'auth_forbidden'
  | 'cors_blocked'
  | 'rate_limited'
  | 'validation_failed'
  | 'request_error'
  | 'request_success';

export interface SecurityAuditEvent {
  type: SecurityAuditEventType;
  routeId: string;
  requestId: string;
  ip: string;
  userId?: string | null;
  detail?: JsonValue;
  status?: number;
  durationMs?: number;
}
