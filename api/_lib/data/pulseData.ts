import type { DailyBriefing, HomePulse } from '../../../src/services/api/types';
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

function fallbackHomePulse(): HomePulse {
  return {
    weather: {
      temperatureC: -3,
      feelsLikeC: -6,
      condition: 'Overcast and cold',
    },
    exchange: {
      base: 'USD',
      quote: 'PLN',
      rate: 4.05,
      change24h: 0.02,
    },
    highlights: [
      {
        id: 'immigration-fallback',
        kind: 'immigration',
        title: 'Residence appointments',
        summary: 'New slots open weekly. Book early for faster processing.',
        severity: 'medium',
        publishedAt: new Date().toISOString(),
      },
      {
        id: 'transport-fallback',
        kind: 'transport',
        title: 'Metro service',
        summary: 'Most metro lines are running normally this morning.',
        severity: 'low',
        publishedAt: new Date().toISOString(),
      },
      {
        id: 'legal-fallback',
        kind: 'legal',
        title: 'Legal watch',
        summary: 'Track ongoing updates affecting expat documentation and services.',
        severity: 'medium',
        publishedAt: new Date().toISOString(),
      },
    ],
  };
}

function fallbackBriefing(): DailyBriefing {
  const now = new Date();
  return {
    date: now.toISOString(),
    city: 'Warsaw',
    title: 'Daily Warsaw Briefing',
    source: 'fallback',
    updatedAt: now.toISOString(),
    cards: [
      {
        id: 'weather',
        kind: 'weather',
        title: 'Weather mood',
        body: 'Cold start today. Dress warm and plan indoor stops.',
        severity: 'low',
      },
      {
        id: 'transit',
        kind: 'transit',
        title: 'Transit pulse',
        body: 'Core routes are stable with minor delays at peak times.',
        severity: 'low',
      },
      {
        id: 'legal',
        kind: 'legal',
        title: 'Legal note',
        body: 'Monitor immigration and municipal updates before key appointments.',
        severity: 'medium',
      },
      {
        id: 'tip',
        kind: 'tip',
        title: 'Pro tip',
        body: 'Complete one admin task early to keep your weekly momentum.',
        severity: 'low',
      },
    ],
  };
}

export async function getHomePulseData(): Promise<HomePulse> {
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

  const fallback = fallbackHomePulse();

  const weather = weatherRows[0]
    ? {
        temperatureC: Number(weatherRows[0].temperature_c),
        feelsLikeC:
          weatherRows[0].feels_like_c == null
            ? Number(weatherRows[0].temperature_c)
            : Number(weatherRows[0].feels_like_c),
        condition: weatherRows[0].condition || fallback.weather.condition,
      }
    : fallback.weather;

  const exchange = fxRows[0]
    ? {
        base: fxRows[0].base_currency || fallback.exchange.base,
        quote: fxRows[0].quote_currency || fallback.exchange.quote,
        rate: Number(fxRows[0].rate),
        change24h: Number(fxRows[0].change_24h ?? 0),
      }
    : fallback.exchange;

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
    weather,
    exchange,
    highlights: highlights.length ? highlights : fallback.highlights,
  };
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

  if (!rows.length) return fallbackBriefing();
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
      })) || fallbackBriefing().cards,
  };
}
