import type { SecurityAuditEvent } from './types';

function redactValue(value: unknown): unknown {
  if (value == null) return value;
  if (typeof value === 'string') {
    if (value.length > 200) return `${value.slice(0, 200)}...[truncated]`;
    if (/bearer\s+/i.test(value)) return '[redacted-token]';
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => redactValue(item));
  }
  if (typeof value === 'object') {
    const input = value as Record<string, unknown>;
    const next: Record<string, unknown> = {};
    Object.entries(input).forEach(([key, raw]) => {
      const lowered = key.toLowerCase();
      if (
        lowered.includes('token') ||
        lowered.includes('password') ||
        lowered.includes('secret') ||
        lowered.includes('authorization')
      ) {
        next[key] = '[redacted]';
      } else {
        next[key] = redactValue(raw);
      }
    });
    return next;
  }
  return value;
}

export function logSecurityEvent(event: SecurityAuditEvent): void {
  const payload = {
    ts: new Date().toISOString(),
    ...event,
    detail: redactValue(event.detail),
  };

  if (event.type === 'request_success') {
    console.info('[security]', JSON.stringify(payload));
    return;
  }

  console.warn('[security]', JSON.stringify(payload));
}
