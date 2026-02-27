import type { RateLimitConfig } from './types';

function envValue(name: string): string | undefined {
  const maybeProcess = globalThis as unknown as { process?: { env?: Record<string, string | undefined> } };
  return maybeProcess.process?.env?.[name];
}

function readPositiveInt(name: string, fallback: number): number {
  const raw = envValue(name);
  if (!raw) return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
}

const windowMs = readPositiveInt('API_RATE_LIMIT_WINDOW_MS', 60_000);

function policy(maxEnvKey: string, fallbackMax: number, keyPrefix: string): RateLimitConfig {
  return {
    max: readPositiveInt(maxEnvKey, fallbackMax),
    windowMs,
    keyPrefix,
  };
}

export const RATE_LIMIT_POLICIES: Record<string, RateLimitConfig> = {
  read: policy('API_RATE_LIMIT_READ_MAX', 120, 'read'),
  write: policy('API_RATE_LIMIT_WRITE_MAX', 40, 'write'),
  ai: policy('API_RATE_LIMIT_AI_MAX', 20, 'ai'),
  auth: policy('API_RATE_LIMIT_AUTH_MAX', 10, 'auth'),
  upload: policy('API_RATE_LIMIT_UPLOAD_MAX', 15, 'upload'),
};
