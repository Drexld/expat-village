import type { RateLimitConfig, RateLimitResult } from './types';

interface Bucket {
  count: number;
  resetAtEpochMs: number;
}

const globalStore = globalThis as unknown as {
  __expatVillageRateLimitStore?: Map<string, Bucket>;
};

function getStore(): Map<string, Bucket> {
  if (!globalStore.__expatVillageRateLimitStore) {
    globalStore.__expatVillageRateLimitStore = new Map<string, Bucket>();
  }
  return globalStore.__expatVillageRateLimitStore;
}

export function resolveClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  return 'unknown';
}

export function evaluateRateLimit(
  key: string,
  config: RateLimitConfig,
  nowEpochMs = Date.now(),
): RateLimitResult {
  const store = getStore();
  const normalizedKey = `${config.keyPrefix || 'global'}:${key}`;
  const existing = store.get(normalizedKey);

  if (!existing || nowEpochMs >= existing.resetAtEpochMs) {
    const fresh: Bucket = {
      count: 1,
      resetAtEpochMs: nowEpochMs + config.windowMs,
    };
    store.set(normalizedKey, fresh);
    return {
      allowed: true,
      remaining: Math.max(0, config.max - fresh.count),
      resetAtEpochMs: fresh.resetAtEpochMs,
    };
  }

  existing.count += 1;
  store.set(normalizedKey, existing);
  const allowed = existing.count <= config.max;

  return {
    allowed,
    remaining: Math.max(0, config.max - existing.count),
    resetAtEpochMs: existing.resetAtEpochMs,
  };
}
