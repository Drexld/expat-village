export type AppEnv = 'development' | 'staging' | 'production';

export interface RuntimeConfig {
  appEnv: AppEnv;
  appRegion: string;
  apiBaseUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  groqApiKey: string;
  sentryDsn: string;
}

function readEnv(key: string): string {
  const value = import.meta.env[key] as string | undefined;
  return (value ?? '').trim();
}

function parseAppEnv(value: string): AppEnv {
  if (value === 'staging' || value === 'production') return value;
  return 'development';
}

export const runtimeConfig: RuntimeConfig = {
  appEnv: parseAppEnv(readEnv('VITE_APP_ENV')),
  appRegion: readEnv('VITE_APP_REGION') || 'eu-central-1',
  apiBaseUrl: readEnv('VITE_API_BASE_URL'),
  supabaseUrl: readEnv('VITE_SUPABASE_URL'),
  supabaseAnonKey: readEnv('VITE_SUPABASE_ANON_KEY'),
  groqApiKey: readEnv('VITE_GROQ_API_KEY'),
  sentryDsn: readEnv('VITE_SENTRY_DSN'),
};

export function validateRuntimeConfig(): string[] {
  const warnings: string[] = [];

  if (!runtimeConfig.apiBaseUrl) {
    warnings.push('VITE_API_BASE_URL is missing. Live data repositories will remain disabled.');
  }

  if (!runtimeConfig.supabaseUrl || !runtimeConfig.supabaseAnonKey) {
    warnings.push('Supabase public credentials are missing. Auth/profile persistence cannot be enabled.');
  }

  if (runtimeConfig.appEnv !== 'development' && !runtimeConfig.sentryDsn) {
    warnings.push('VITE_SENTRY_DSN is missing for non-development environment.');
  }

  return warnings;
}
