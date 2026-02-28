import { runtimeConfig } from '../../config/runtime';
import { clearAccessToken, setAccessToken } from './tokenStore';

const AUTH_SESSION_KEY = 'ev_auth_session';
const REFRESH_SKEW_MS = 60_000;

export interface SupabaseSession {
  accessToken: string;
  refreshToken: string;
  expiresAtMs: number;
  tokenType: string;
}

interface HashAuthPayload {
  access_token?: string;
  refresh_token?: string;
  expires_in?: string;
  token_type?: string;
  type?: string;
}

let refreshTimer: number | null = null;

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function clearRefreshTimer() {
  if (refreshTimer !== null && typeof window !== 'undefined') {
    window.clearTimeout(refreshTimer);
  }
  refreshTimer = null;
}

function saveSession(session: SupabaseSession) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

function loadSession(): SupabaseSession | null {
  if (!canUseStorage()) return null;
  const raw = window.localStorage.getItem(AUTH_SESSION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<SupabaseSession>;
    if (
      typeof parsed.accessToken !== 'string' ||
      typeof parsed.refreshToken !== 'string' ||
      typeof parsed.expiresAtMs !== 'number'
    ) {
      return null;
    }
    return {
      accessToken: parsed.accessToken,
      refreshToken: parsed.refreshToken,
      expiresAtMs: parsed.expiresAtMs,
      tokenType: typeof parsed.tokenType === 'string' ? parsed.tokenType : 'bearer',
    };
  } catch {
    return null;
  }
}

function clearSession() {
  if (canUseStorage()) {
    window.localStorage.removeItem(AUTH_SESSION_KEY);
  }
  clearAccessToken();
  clearRefreshTimer();
}

function getAuthConfig(): { supabaseUrl: string; anonKey: string } | null {
  const supabaseUrl = runtimeConfig.supabaseUrl?.replace(/\/+$/, '') || '';
  const anonKey = runtimeConfig.supabaseAnonKey || '';
  if (!supabaseUrl || !anonKey) return null;
  return { supabaseUrl, anonKey };
}

function parseHashPayload(hash: string): HashAuthPayload {
  const clean = hash.startsWith('#') ? hash.slice(1) : hash;
  const params = new URLSearchParams(clean);
  return {
    access_token: params.get('access_token') || undefined,
    refresh_token: params.get('refresh_token') || undefined,
    expires_in: params.get('expires_in') || undefined,
    token_type: params.get('token_type') || undefined,
    type: params.get('type') || undefined,
  };
}

function sessionFromHash(hash: string): SupabaseSession | null {
  const payload = parseHashPayload(hash);
  if (!payload.access_token || !payload.refresh_token || !payload.expires_in) return null;
  const expiresInSec = Number(payload.expires_in);
  if (!Number.isFinite(expiresInSec) || expiresInSec <= 0) return null;
  return {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
    expiresAtMs: Date.now() + expiresInSec * 1000,
    tokenType: payload.token_type || 'bearer',
  };
}

async function refreshSession(refreshToken: string): Promise<SupabaseSession | null> {
  const config = getAuthConfig();
  if (!config) return null;

  try {
    const response = await fetch(
      `${config.supabaseUrl}/auth/v1/token?grant_type=refresh_token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: config.anonKey,
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      },
    );

    if (!response.ok) return null;
    const payload = (await response.json()) as {
      access_token?: string;
      refresh_token?: string;
      expires_in?: number;
      token_type?: string;
    };
    if (!payload.access_token || !payload.refresh_token || !payload.expires_in) return null;

    return {
      accessToken: payload.access_token,
      refreshToken: payload.refresh_token,
      expiresAtMs: Date.now() + payload.expires_in * 1000,
      tokenType: payload.token_type || 'bearer',
    };
  } catch {
    return null;
  }
}

async function ensureFreshSession(session: SupabaseSession): Promise<SupabaseSession | null> {
  const msRemaining = session.expiresAtMs - Date.now();
  if (msRemaining > REFRESH_SKEW_MS) {
    return session;
  }
  return refreshSession(session.refreshToken);
}

function scheduleRefresh(session: SupabaseSession) {
  if (typeof window === 'undefined') return;
  clearRefreshTimer();

  const msUntilRefresh = Math.max(5_000, session.expiresAtMs - Date.now() - REFRESH_SKEW_MS);
  refreshTimer = window.setTimeout(async () => {
    const next = await refreshSession(session.refreshToken);
    if (!next) {
      clearSession();
      return;
    }

    saveSession(next);
    setAccessToken(next.accessToken);
    scheduleRefresh(next);
  }, msUntilRefresh);
}

function clearAuthHashFromUrl() {
  if (typeof window === 'undefined') return;
  if (!window.location.hash) return;
  const url = `${window.location.pathname}${window.location.search}`;
  window.history.replaceState({}, document.title, url);
}

export async function bootstrapSupabaseAuthSession(): Promise<void> {
  if (typeof window === 'undefined') return;

  const fromHash = sessionFromHash(window.location.hash || '');
  if (fromHash) {
    saveSession(fromHash);
    setAccessToken(fromHash.accessToken);
    clearAuthHashFromUrl();
    scheduleRefresh(fromHash);
    return;
  }

  const stored = loadSession();
  if (!stored) {
    clearSession();
    return;
  }

  const fresh = await ensureFreshSession(stored);
  if (!fresh) {
    clearSession();
    return;
  }

  saveSession(fresh);
  setAccessToken(fresh.accessToken);
  scheduleRefresh(fresh);
}

export function clearSupabaseAuthSession(): void {
  clearSession();
}

function sessionFromAuthPayload(payload: {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
}): SupabaseSession | null {
  if (!payload.access_token || !payload.refresh_token || !payload.expires_in) {
    return null;
  }

  return {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
    expiresAtMs: Date.now() + payload.expires_in * 1000,
    tokenType: payload.token_type || 'bearer',
  };
}

function upsertSession(session: SupabaseSession): void {
  saveSession(session);
  setAccessToken(session.accessToken);
  scheduleRefresh(session);
}

export function getCurrentSupabaseAuthSession(): SupabaseSession | null {
  return loadSession();
}

export async function signInWithPassword(email: string, password: string): Promise<void> {
  const config = getAuthConfig();
  if (!config) {
    throw new Error('Supabase auth is not configured.');
  }

  const response = await fetch(`${config.supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: config.anonKey,
    },
    body: JSON.stringify({
      email: email.trim(),
      password,
    }),
  });

  if (!response.ok) {
    throw new Error('Sign in failed. Check credentials.');
  }

  const payload = (await response.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    token_type?: string;
  };

  const session = sessionFromAuthPayload(payload);
  if (!session) {
    throw new Error('Sign in succeeded but no session token returned.');
  }

  upsertSession(session);
}

export async function signUpWithPassword(email: string, password: string): Promise<void> {
  const config = getAuthConfig();
  if (!config) {
    throw new Error('Supabase auth is not configured.');
  }

  const response = await fetch(`${config.supabaseUrl}/auth/v1/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: config.anonKey,
    },
    body: JSON.stringify({
      email: email.trim(),
      password,
    }),
  });

  if (!response.ok) {
    throw new Error('Sign up failed.');
  }

  const payload = (await response.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    token_type?: string;
  };

  const session = sessionFromAuthPayload(payload);
  if (session) {
    upsertSession(session);
  }
}

export async function sendMagicLink(email: string): Promise<void> {
  const config = getAuthConfig();
  if (!config) {
    throw new Error('Supabase auth is not configured.');
  }

  const redirectTo = typeof window !== 'undefined' ? window.location.origin : undefined;

  const response = await fetch(`${config.supabaseUrl}/auth/v1/otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: config.anonKey,
    },
    body: JSON.stringify({
      email: email.trim(),
      create_user: true,
      email_redirect_to: redirectTo,
    }),
  });

  if (!response.ok) {
    throw new Error('Could not send magic link.');
  }
}

export async function signOutSupabaseAuthSession(): Promise<void> {
  const config = getAuthConfig();
  const session = loadSession();
  if (!session) {
    clearSession();
    return;
  }

  if (config) {
    await fetch(`${config.supabaseUrl}/auth/v1/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: config.anonKey,
        Authorization: `Bearer ${session.accessToken}`,
      },
    }).catch(() => null);
  }

  clearSession();
}
