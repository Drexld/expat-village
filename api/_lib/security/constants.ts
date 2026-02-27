export const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-site',
  'Permissions-Policy': 'camera=(self), microphone=(self), geolocation=(self)',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
};

export const DEFAULT_CSP =
  "default-src 'self'; " +
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
  "style-src 'self' 'unsafe-inline'; " +
  "img-src 'self' https: data: blob:; " +
  "font-src 'self' data:; " +
  "connect-src 'self' https: wss:; " +
  "frame-ancestors 'none'; base-uri 'self'; form-action 'self'";

export const HEADER_REQUEST_ID = 'x-request-id';
export const HEADER_RATE_LIMIT_REMAINING = 'x-ratelimit-remaining';
export const HEADER_RATE_LIMIT_RESET = 'x-ratelimit-reset';
