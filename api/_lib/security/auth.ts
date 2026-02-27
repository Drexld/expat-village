import type {
  AuthContext,
  TokenClaims,
  TokenVerifier,
  TokenVerifierResult,
} from './types';

interface SupabaseUserResponse {
  id?: string;
  app_metadata?: {
    roles?: unknown;
    entitlements?: unknown;
  };
}

function decodeBase64Url(value: string): string | null {
  try {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padLength = (4 - (normalized.length % 4)) % 4;
    const padded = normalized + '='.repeat(padLength);
    const decoded = atob(padded);
    return decoded;
  } catch {
    return null;
  }
}

function parseJwtPayload(token: string): TokenClaims | undefined {
  const parts = token.split('.');
  if (parts.length < 2) return undefined;
  const decoded = decodeBase64Url(parts[1]);
  if (!decoded) return undefined;

  try {
    return JSON.parse(decoded) as TokenClaims;
  } catch {
    return undefined;
  }
}

export function extractBearerToken(request: Request): string | null {
  const raw = request.headers.get('authorization');
  if (!raw) return null;
  const [scheme, token] = raw.split(' ');
  if (!scheme || !token || scheme.toLowerCase() !== 'bearer') return null;
  return token.trim();
}

function envValue(name: string): string | undefined {
  const maybeProcess = globalThis as unknown as { process?: { env?: Record<string, string | undefined> } };
  return maybeProcess.process?.env?.[name];
}

function readBoolEnv(name: string): boolean {
  const raw = envValue(name);
  return typeof raw === 'string' && raw.trim().toLowerCase() === 'true';
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean);
}

function fromClaims(token: string, claims?: TokenClaims): AuthContext {
  const roles = Array.isArray(claims?.roles)
    ? claims?.roles.filter((value): value is string => typeof value === 'string')
    : [];
  const entitlements = Array.isArray(claims?.entitlements)
    ? claims?.entitlements.filter((value): value is string => typeof value === 'string')
    : [];
  const userId = typeof claims?.sub === 'string' ? claims.sub : null;

  return {
    token,
    userId,
    roles,
    entitlements,
    claims,
  };
}

function resolveSupabaseAuthConfig(): { url: string; anonKey: string } | null {
  const rawUrl = envValue('SUPABASE_URL') || envValue('VITE_SUPABASE_URL');
  const anonKey = envValue('SUPABASE_ANON_KEY') || envValue('VITE_SUPABASE_ANON_KEY');
  const url = rawUrl?.trim().replace(/\/+$/, '') || '';

  if (!url || !anonKey?.trim()) return null;
  return { url, anonKey: anonKey.trim() };
}

let cachedVerifier: TokenVerifier | null | undefined;

export function createSupabaseTokenVerifier(): TokenVerifier | null {
  if (cachedVerifier !== undefined) {
    return cachedVerifier;
  }

  const config = resolveSupabaseAuthConfig();
  if (!config) {
    cachedVerifier = null;
    return cachedVerifier;
  }

  cachedVerifier = async (token: string): Promise<TokenVerifierResult | null> => {
    const response = await fetch(`${config.url}/auth/v1/user`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: config.anonKey,
      },
    });

    if (!response.ok) {
      return null;
    }

    const user = (await response.json()) as SupabaseUserResponse;
    if (!user.id) {
      return null;
    }

    const roles = toStringArray(user.app_metadata?.roles);
    const entitlements = toStringArray(user.app_metadata?.entitlements);

    return {
      userId: user.id,
      roles,
      entitlements,
      claims: {
        sub: user.id,
        roles,
        entitlements,
      },
    };
  };

  return cachedVerifier;
}

export async function buildAuthContext(
  request: Request,
  tokenVerifier?: TokenVerifier,
): Promise<AuthContext> {
  const token = extractBearerToken(request);
  if (!token) {
    return {
      token: null,
      userId: null,
      roles: [],
      entitlements: [],
    };
  }

  const verifier = tokenVerifier || createSupabaseTokenVerifier() || undefined;
  if (verifier) {
    const verified: TokenVerifierResult | null = await verifier(token);
    if (verified) {
      return {
        token,
        userId: verified.userId,
        roles: verified.roles || [],
        entitlements: verified.entitlements || [],
        claims: verified.claims,
      };
    }
  }

  // Development escape hatch only. Do not enable in production.
  if (!readBoolEnv('API_ALLOW_UNVERIFIED_TOKENS')) {
    return {
      token,
      userId: null,
      roles: [],
      entitlements: [],
    };
  }

  const claims = parseJwtPayload(token);
  return fromClaims(token, claims);
}
