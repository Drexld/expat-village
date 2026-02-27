interface SupabaseConfig {
  url: string;
  serviceRoleKey: string;
}

function envValue(name: string): string {
  const maybeProcess = globalThis as unknown as {
    process?: { env?: Record<string, string | undefined> };
  };
  return maybeProcess.process?.env?.[name]?.trim() || '';
}

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = envValue('SUPABASE_URL');
  const serviceRoleKey = envValue('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !serviceRoleKey) return null;
  return { url: url.replace(/\/+$/, ''), serviceRoleKey };
}

interface SelectOptions {
  limit?: number;
  orderBy?: string;
  ascending?: boolean;
  filters?: Array<{ column: string; op: 'eq' | 'gte' | 'lte'; value: string | number | boolean }>;
}

interface UpsertOptions {
  onConflict: string;
  returning?: 'minimal' | 'representation';
}

interface InsertOptions {
  returning?: 'minimal' | 'representation';
}

function encodeFilter(filter: {
  column: string;
  op: 'eq' | 'gte' | 'lte';
  value: string | number | boolean;
}): string {
  return `${filter.column}=${filter.op}.${encodeURIComponent(String(filter.value))}`;
}

export async function supabaseSelect<T>(
  table: string,
  columns: string,
  options?: SelectOptions,
): Promise<T[]> {
  const config = getSupabaseConfig();
  if (!config) return [];

  const params = new URLSearchParams();
  params.set('select', columns);

  if (options?.limit) {
    params.set('limit', String(options.limit));
  }

  if (options?.orderBy) {
    params.set('order', `${options.orderBy}.${options.ascending ? 'asc' : 'desc'}`);
  }

  (options?.filters || []).forEach((filter) => {
    const [key, value] = encodeFilter(filter).split('=');
    params.append(key, value);
  });

  const url = `${config.url}/rest/v1/${table}?${params.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as unknown;
  if (!Array.isArray(payload)) return [];
  return payload as T[];
}

async function supabaseWrite<T>(
  method: 'POST' | 'PATCH',
  table: string,
  payload: Record<string, unknown> | Record<string, unknown>[],
  options?: {
    onConflict?: string;
    prefer?: string;
    returning?: 'minimal' | 'representation';
  },
): Promise<T[]> {
  const config = getSupabaseConfig();
  if (!config) return [];

  const params = new URLSearchParams();
  if (options?.onConflict) {
    params.set('on_conflict', options.onConflict);
  }

  const url = `${config.url}/rest/v1/${table}${params.toString() ? `?${params.toString()}` : ''}`;

  const preferParts = [options?.prefer].filter(Boolean) as string[];
  preferParts.push(`return=${options?.returning || 'minimal'}`);

  const response = await fetch(url, {
    method,
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: preferParts.join(','),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return [];
  }

  if (options?.returning === 'representation') {
    const data = (await response.json()) as unknown;
    if (Array.isArray(data)) return data as T[];
  }

  return [];
}

export async function supabaseUpsert<TIn extends Record<string, unknown>, TOut = never>(
  table: string,
  payload: TIn | TIn[],
  options: UpsertOptions,
): Promise<TOut[]> {
  return supabaseWrite<TOut>('POST', table, payload, {
    onConflict: options.onConflict,
    prefer: 'resolution=merge-duplicates',
    returning: options.returning || 'minimal',
  });
}

export async function supabaseInsert<TIn extends Record<string, unknown>, TOut = never>(
  table: string,
  payload: TIn | TIn[],
  options?: InsertOptions,
): Promise<TOut[]> {
  return supabaseWrite<TOut>('POST', table, payload, {
    returning: options?.returning || 'minimal',
  });
}
