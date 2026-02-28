import type { DailyBriefing, HomePulse } from '../../../src/services/api/types';
import type { HandlerResultWithFreshness } from '../security';
import { supabaseSelect } from './supabaseRest';

interface WeatherSnapshotRow {
  condition: string;
  temperature_c: number;
  feels_like_c?: number | null;
  source_name?: string | null;
  fetched_at?: string | null;
}

interface FxRateRow {
  base_currency: string;
  quote_currency: string;
  rate: number;
  change_24h?: number | null;
  source_name?: string | null;
  fetched_at?: string | null;
}

interface UpdateRow {
  id?: string;
  title: string;
  summary: string;
  severity?: 'low' | 'medium' | 'high' | null;
  published_at?: string | null;
  fetched_at?: string | null;
}

interface TransitRow {
  id?: string;
  title: string;
  summary: string;
  severity?: 'low' | 'medium' | 'high' | null;
  starts_at?: string | null;
  fetched_at?: string | null;
}

interface DailyBriefingRow {
  briefing_date: string;
  city: string;
  title: string;
  payload: {
    cards?: Array<{
      id?: string;
      title?: string;
      body?: string;
      kind?: 'weather' | 'transit' | 'city' | 'tip' | 'legal';
      severity?: 'low' | 'medium' | 'high';
    }>;
  };
  source_name?: string | null;
  fetched_at?: string | null;
}

function safeIso(value?: string | null): string {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().toISOString();
  return date.toISOString();
}

function latestIso(values: Array<string | null | undefined>): string {
  const millis = values
    .map((value) => (value ? new Date(value).getTime() : Number.NaN))
    .filter((value) => Number.isFinite(value)) as number[];

  if (!millis.length) return new Date().toISOString();
  return new Date(Math.max(...millis)).toISOString();
}

export async function getHomePulseBundleData(): Promise<HandlerResultWithFreshness<HomePulse>> {
  const [weatherRows, fxRows, immigrationRows, transportRows, legalRows] = await Promise.all([
    supabaseSelect<WeatherSnapshotRow>(
      'weather_snapshots',
      'condition,temperature_c,feels_like_c,source_name,fetched_at',
      { limit: 1, orderBy: 'fetched_at', ascending: false },
    ),
    supabaseSelect<FxRateRow>(
      'fx_rates',
      'base_currency,quote_currency,rate,change_24h,source_name,fetched_at',
      {
        limit: 1,
        orderBy: 'fetched_at',
        ascending: false,
        filters: [{ column: 'base_currency', op: 'eq', value: 'USD' }],
      },
    ),
    supabaseSelect<UpdateRow>(
      'immigration_updates',
      'id,title,summary,severity,published_at,fetched_at',
      { limit: 2, orderBy: 'published_at', ascending: false },
    ),
    supabaseSelect<TransitRow>(
      'transit_disruptions',
      'id,title,summary,severity,starts_at,fetched_at',
      { limit: 2, orderBy: 'starts_at', ascending: false },
    ),
    supabaseSelect<UpdateRow>(
      'legal_parliament_updates',
      'id,title,summary,severity,published_at,fetched_at',
      { limit: 2, orderBy: 'published_at', ascending: false },
    ),
  ]);

  const weather = weatherRows[0]
    ? {
        temperatureC: Number(weatherRows[0].temperature_c),
        feelsLikeC:
          weatherRows[0].feels_like_c == null
            ? Number(weatherRows[0].temperature_c)
            : Number(weatherRows[0].feels_like_c),
        condition: weatherRows[0].condition || 'No live weather data',
      }
    : {
        temperatureC: 0,
        feelsLikeC: 0,
        condition: 'No live weather data',
      };

  const exchange = fxRows[0]
    ? {
        base: fxRows[0].base_currency || 'USD',
        quote: fxRows[0].quote_currency || 'PLN',
        rate: Number(fxRows[0].rate),
        change24h: Number(fxRows[0].change_24h ?? 0),
      }
    : {
        base: 'USD',
        quote: 'PLN',
        rate: 0,
        change24h: 0,
      };

  const highlights = [
    ...immigrationRows.map((row) => ({
      id: row.id || crypto.randomUUID(),
      kind: 'immigration' as const,
      title: row.title,
      summary: row.summary,
      severity: row.severity || 'medium',
      publishedAt: safeIso(row.published_at || row.fetched_at),
    })),
    ...transportRows.map((row) => ({
      id: row.id || crypto.randomUUID(),
      kind: 'transport' as const,
      title: row.title,
      summary: row.summary,
      severity: row.severity || 'low',
      publishedAt: safeIso(row.starts_at || row.fetched_at),
    })),
    ...legalRows.map((row) => ({
      id: row.id || crypto.randomUUID(),
      kind: 'legal' as const,
      title: row.title,
      summary: row.summary,
      severity: row.severity || 'medium',
      publishedAt: safeIso(row.published_at || row.fetched_at),
    })),
  ];

  return {
    data: {
      weather,
      exchange,
      highlights,
    },
    freshness: {
      source: 'poland-live-feeds',
      updatedAt: latestIso([
        weatherRows[0]?.fetched_at,
        fxRows[0]?.fetched_at,
        immigrationRows[0]?.fetched_at || immigrationRows[0]?.published_at,
        transportRows[0]?.fetched_at || transportRows[0]?.starts_at,
        legalRows[0]?.fetched_at || legalRows[0]?.published_at,
      ]),
      ttlSeconds: 900,
    },
  };
}

export async function getHomePulseData(): Promise<HomePulse> {
  const bundle = await getHomePulseBundleData();
  return bundle.data;
}

export async function getDailyBriefingData(): Promise<DailyBriefing> {
  const today = new Date().toISOString().slice(0, 10);
  const rows = await supabaseSelect<DailyBriefingRow>(
    'daily_briefings',
    'briefing_date,city,title,payload,source_name,fetched_at',
    {
      limit: 1,
      orderBy: 'briefing_date',
      ascending: false,
      filters: [{ column: 'briefing_date', op: 'eq', value: today }],
    },
  );

  if (!rows.length) {
    return {
      date: today,
      city: 'Warsaw',
      title: 'No live briefing available yet',
      source: 'supabase',
      updatedAt: new Date().toISOString(),
      cards: [],
    };
  }
  const row = rows[0];

  return {
    date: row.briefing_date,
    city: row.city || 'Warsaw',
    title: row.title || 'Daily Warsaw Briefing',
    source: row.source_name || 'supabase',
    updatedAt: safeIso(row.fetched_at),
    cards:
      row.payload?.cards?.map((card) => ({
        id: card.id || crypto.randomUUID(),
        title: card.title || 'Briefing card',
        body: card.body || '',
        kind: card.kind || 'city',
        severity: card.severity,
      })) || [],
  };
}
