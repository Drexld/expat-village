function normalizeOrigin(value: string): string {
  return value.trim().replace(/\/+$/, '');
}

export function parseAllowedOrigins(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((value) => normalizeOrigin(value))
    .filter(Boolean);
}

export function getRequestOrigin(request: Request): string | null {
  const value = request.headers.get('origin');
  if (!value) return null;
  return normalizeOrigin(value);
}

export function isOriginAllowed(
  origin: string | null,
  allowedOrigins: string[],
): origin is string {
  if (!origin) return false;
  if (!allowedOrigins.length) return false;
  return allowedOrigins.includes(normalizeOrigin(origin));
}
