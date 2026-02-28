import { internalError } from '../security';
import { supabaseInsert, supabaseSelect, supabaseUpsert } from '../data/supabaseRest';

const GROQ_CHAT_COMPLETIONS_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const WARSAW_LATITUDE = 52.2297;
const WARSAW_LONGITUDE = 21.0122;
const OPEN_METEO_URL =
  `https://api.open-meteo.com/v1/forecast?latitude=${WARSAW_LATITUDE}&longitude=${WARSAW_LONGITUDE}` +
  '&current=temperature_2m,apparent_temperature,weather_code&timezone=Europe%2FWarsaw';

type FeedKind = 'weather' | 'fx' | 'immigration' | 'legal' | 'transport';

interface FeedSourceConfig {
  immigration: string[];
  legal: string[];
  transport: string[];
}

interface FeedItem {
  id: string;
  title: string;
  summary: string;
  link?: string;
  publishedAt?: string;
  sourceName: string;
}

interface NormalizedFeedItem {
  title: string;
  summary: string;
  severity: 'low' | 'medium' | 'high';
}

export interface PolandIngestionResult {
  startedAt: string;
  finishedAt: string;
  kinds: FeedKind[];
  weather: { attempted: number; written: number; errors: string[] };
  fx: { attempted: number; written: number; errors: string[] };
  immigration: { attempted: number; written: number; skippedNonEnglish: number; errors: string[] };
  legal: { attempted: number; written: number; skippedNonEnglish: number; errors: string[] };
  transport: { attempted: number; written: number; skippedNonEnglish: number; errors: string[] };
}

function envValue(name: string): string {
  const maybeProcess = globalThis as unknown as {
    process?: { env?: Record<string, string | undefined> };
  };
  return maybeProcess.process?.env?.[name]?.trim() || '';
}

function envCsv(name: string): string[] {
  const raw = envValue(name);
  if (!raw) return [];
  return raw
    .split(/[,\n;]/g)
    .map((value) => value.trim())
    .filter(Boolean);
}

function getGroqApiKey(): string {
  return envValue('GROQ_API_KEY');
}

function defaultFeedSourceConfig(): FeedSourceConfig {
  return {
    immigration: envCsv('INGEST_IMMIGRATION_FEED_URLS'),
    legal: envCsv('INGEST_LEGAL_FEED_URLS'),
    transport: envCsv('INGEST_TRANSPORT_FEED_URLS'),
  };
}

function cleanupWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function stripHtml(value: string): string {
  return cleanupWhitespace(decodeHtmlEntities(value.replace(/<[^>]+>/g, ' ')));
}

function normalizeDate(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

function stableExternalId(namespace: string, ...parts: Array<string | undefined>): string {
  const joined = parts
    .filter((part) => typeof part === 'string' && part.trim().length > 0)
    .map((part) => String(part))
    .join('|')
    .toLowerCase();

  const raw = `${namespace}|${joined}`;
  const compact = raw.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (!compact) return `${namespace}-${crypto.randomUUID()}`;
  return compact.slice(0, 180);
}

function isLikelyEnglish(text: string): boolean {
  const value = text.toLowerCase();
  const polishSignals = [
    ' oraz ',
    ' jest ',
    ' zosta',
    ' urz',
    ' wojew',
    ' gmina',
    ' powiat',
    ' ztm',
    ' przystanek',
    ' opó',
    ' ł',
    ' ą',
    ' ę',
    ' ś',
    ' ż',
    ' ź',
    ' ć',
    ' ń',
  ];

  const score = polishSignals.reduce((acc, token) => (value.includes(token) ? acc + 1 : acc), 0);
  return score <= 1;
}

function inferSeverity(text: string): 'low' | 'medium' | 'high' {
  const value = text.toLowerCase();
  const highSignals = ['urgent', 'strike', 'closure', 'suspended', 'deadline', 'fine', 'penalty', 'cancelled'];
  const mediumSignals = ['delay', 'update', 'change', 'amendment', 'notice', 'advisory'];

  if (highSignals.some((token) => value.includes(token))) return 'high';
  if (mediumSignals.some((token) => value.includes(token))) return 'medium';
  return 'low';
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, text/plain' },
  });
  if (!response.ok) {
    throw internalError(`Feed request failed: ${url} (${response.status})`);
  }
  return response.text();
}

function extractTag(content: string, tagName: string): string | undefined {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)</${tagName}>`, 'i');
  const match = content.match(regex);
  if (!match?.[1]) return undefined;
  return cleanupWhitespace(stripHtml(match[1]));
}

function parseFeedXml(xml: string, sourceName: string): FeedItem[] {
  const items: FeedItem[] = [];

  const rssMatches = Array.from(xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi));
  for (const match of rssMatches) {
    const block = match[1] || '';
    const title = extractTag(block, 'title') || '';
    const description = extractTag(block, 'description') || extractTag(block, 'content:encoded') || '';
    const guid = extractTag(block, 'guid');
    const link = extractTag(block, 'link');
    const publishedAt = normalizeDate(extractTag(block, 'pubDate') || extractTag(block, 'dc:date'));
    if (!title || !description) continue;
    items.push({
      id: stableExternalId(sourceName, guid, link, title, publishedAt),
      title,
      summary: description,
      link,
      publishedAt,
      sourceName,
    });
  }

  const atomMatches = Array.from(xml.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/gi));
  for (const match of atomMatches) {
    const block = match[1] || '';
    const title = extractTag(block, 'title') || '';
    const summary = extractTag(block, 'summary') || extractTag(block, 'content') || '';
    const linkHrefMatch = block.match(/<link\b[^>]*href="([^"]+)"/i);
    const link = linkHrefMatch?.[1];
    const publishedAt = normalizeDate(extractTag(block, 'updated') || extractTag(block, 'published'));
    const atomId = extractTag(block, 'id');
    if (!title || !summary) continue;
    items.push({
      id: stableExternalId(sourceName, atomId, link, title, publishedAt),
      title,
      summary,
      link,
      publishedAt,
      sourceName,
    });
  }

  return items;
}

async function fetchFeedItems(url: string): Promise<FeedItem[]> {
  const sourceName = new URL(url).hostname.replace(/^www\./, '');
  const xml = await fetchText(url);
  return parseFeedXml(xml, sourceName);
}

function extractJsonObject(text: string): string | null {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start >= 0 && end > start) return text.slice(start, end + 1);
  return null;
}

async function normalizeToEnglishViaGroq(input: FeedItem): Promise<NormalizedFeedItem | null> {
  const apiKey = getGroqApiKey();
  if (!apiKey) return null;

  const prompt = `
Translate and normalize the following public-service news item to concise English for expats in Poland.
Return strict JSON only:
{
  "title": "max 110 chars",
  "summary": "max 280 chars",
  "severity": "low|medium|high"
}

Item title: ${input.title}
Item summary: ${input.summary}
`.trim();

  try {
    const response = await fetch(GROQ_CHAT_COMPLETIONS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.2,
        max_tokens: 500,
        messages: [
          { role: 'system', content: 'You are a strict JSON transformer for official public updates.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) return null;
    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = String(payload?.choices?.[0]?.message?.content || '').trim();
    if (!content) return null;
    const jsonText = extractJsonObject(content);
    if (!jsonText) return null;
    const parsed = JSON.parse(jsonText) as Partial<NormalizedFeedItem>;
    if (
      typeof parsed.title !== 'string' ||
      typeof parsed.summary !== 'string' ||
      (parsed.severity !== 'low' && parsed.severity !== 'medium' && parsed.severity !== 'high')
    ) {
      return null;
    }
    return {
      title: cleanupWhitespace(parsed.title).slice(0, 110),
      summary: cleanupWhitespace(parsed.summary).slice(0, 280),
      severity: parsed.severity,
    };
  } catch {
    return null;
  }
}

async function normalizeFeedItemToEnglish(item: FeedItem): Promise<NormalizedFeedItem | null> {
  const merged = cleanupWhitespace(`${item.title}. ${item.summary}`);
  if (isLikelyEnglish(merged)) {
    const title = cleanupWhitespace(item.title).slice(0, 110);
    const summary = cleanupWhitespace(item.summary).slice(0, 280);
    return { title, summary, severity: inferSeverity(`${title} ${summary}`) };
  }

  const translated = await normalizeToEnglishViaGroq(item);
  if (!translated) return null;
  if (!isLikelyEnglish(`${translated.title} ${translated.summary}`)) return null;
  return translated;
}

function weatherCodeToCondition(code: number): string {
  if (code === 0) return 'Clear sky';
  if (code === 1 || code === 2) return 'Partly cloudy';
  if (code === 3) return 'Cloudy';
  if ([45, 48].includes(code)) return 'Foggy';
  if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Rain';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snow';
  if ([95, 96, 99].includes(code)) return 'Thunderstorm';
  return 'Variable weather';
}

async function ingestWeather(
  result: PolandIngestionResult['weather'],
): Promise<void> {
  result.attempted += 1;
  try {
    const response = await fetch(OPEN_METEO_URL, { method: 'GET' });
    if (!response.ok) {
      result.errors.push(`Open-Meteo failed: ${response.status}`);
      return;
    }
    const payload = (await response.json()) as {
      current?: {
        temperature_2m?: number;
        apparent_temperature?: number;
        weather_code?: number;
      };
    };

    const current = payload.current;
    if (!current || typeof current.temperature_2m !== 'number') {
      result.errors.push('Open-Meteo payload missing current weather');
      return;
    }

    const row = {
      city: 'Warsaw',
      condition: weatherCodeToCondition(Number(current.weather_code ?? -1)),
      temperature_c: Number(current.temperature_2m),
      feels_like_c: Number(current.apparent_temperature ?? current.temperature_2m),
      source_name: 'open-meteo',
      source_url: OPEN_METEO_URL,
      fetched_at: new Date().toISOString(),
      ttl_seconds: 1800,
    };

    await supabaseInsert('weather_snapshots', row);
    result.written += 1;
  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : 'Weather ingestion failed');
  }
}

async function ingestFx(
  result: PolandIngestionResult['fx'],
): Promise<void> {
  const bases = ['USD', 'EUR'] as const;
  for (const base of bases) {
    result.attempted += 1;
    try {
      const url = `https://api.nbp.pl/api/exchangerates/rates/a/${base.toLowerCase()}/last/2/?format=json`;
      const response = await fetch(url, { method: 'GET' });
      if (!response.ok) {
        result.errors.push(`NBP failed for ${base}: ${response.status}`);
        continue;
      }

      const payload = (await response.json()) as {
        rates?: Array<{ mid?: number; effectiveDate?: string }>;
      };
      const rates = Array.isArray(payload.rates) ? payload.rates : [];
      if (!rates.length || typeof rates[rates.length - 1]?.mid !== 'number') {
        result.errors.push(`NBP payload missing rate for ${base}`);
        continue;
      }

      const latest = Number(rates[rates.length - 1].mid);
      const previous = typeof rates[rates.length - 2]?.mid === 'number' ? Number(rates[rates.length - 2].mid) : latest;
      const change24h = Number((latest - previous).toFixed(4));

      await supabaseInsert('fx_rates', {
        base_currency: base,
        quote_currency: 'PLN',
        rate: latest,
        change_24h: change24h,
        source_name: 'nbp.pl',
        source_url: url,
        fetched_at: new Date().toISOString(),
        ttl_seconds: 3600,
      });
      result.written += 1;
    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : `FX ingestion failed for ${base}`);
    }
  }
}

async function ingestNewsFamily(
  feedUrls: string[],
  kind: 'immigration' | 'legal' | 'transport',
  result:
    | PolandIngestionResult['immigration']
    | PolandIngestionResult['legal']
    | PolandIngestionResult['transport'],
): Promise<void> {
  if (!feedUrls.length) {
    result.errors.push(`No feed URLs configured for ${kind}. Set INGEST_${kind.toUpperCase()}_FEED_URLS.`);
    return;
  }

  const nowIso = new Date().toISOString();

  for (const feedUrl of feedUrls) {
    try {
      const items = await fetchFeedItems(feedUrl);
      result.attempted += items.length;

      const normalizedRows: Array<Record<string, unknown>> = [];
      for (const item of items.slice(0, 15)) {
        const normalized = await normalizeFeedItemToEnglish(item);
        if (!normalized) {
          result.skippedNonEnglish += 1;
          continue;
        }

        const sourceUrl = item.link || feedUrl;
        if (kind === 'transport') {
          normalizedRows.push({
            external_id: item.id,
            title: normalized.title,
            summary: normalized.summary,
            severity: normalized.severity,
            starts_at: item.publishedAt || nowIso,
            ends_at: null,
            source_name: item.sourceName,
            source_url: sourceUrl,
            fetched_at: nowIso,
            ttl_seconds: 900,
          });
        } else {
          normalizedRows.push({
            external_id: item.id,
            title: normalized.title,
            summary: normalized.summary,
            body_markdown: normalized.summary,
            severity: normalized.severity,
            published_at: item.publishedAt || nowIso,
            source_name: item.sourceName,
            source_url: sourceUrl,
            fetched_at: nowIso,
            ttl_seconds: 21600,
          });
        }
      }

      if (!normalizedRows.length) continue;

      if (kind === 'immigration') {
        await supabaseUpsert('immigration_updates', normalizedRows, { onConflict: 'external_id' });
      } else if (kind === 'legal') {
        await supabaseUpsert('legal_parliament_updates', normalizedRows, { onConflict: 'external_id' });
      } else {
        await supabaseUpsert('transit_disruptions', normalizedRows, { onConflict: 'external_id' });
      }

      result.written += normalizedRows.length;
    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : `${kind} feed ingestion failed`);
    }
  }
}

export async function runPolandFeedIngestion(input: {
  kinds: FeedKind[];
  sourceConfig?: Partial<FeedSourceConfig>;
}): Promise<PolandIngestionResult> {
  const startedAt = new Date().toISOString();
  const normalizedKinds = Array.from(new Set(input.kinds));
  const sourceConfig = { ...defaultFeedSourceConfig(), ...(input.sourceConfig || {}) };

  const result: PolandIngestionResult = {
    startedAt,
    finishedAt: startedAt,
    kinds: normalizedKinds,
    weather: { attempted: 0, written: 0, errors: [] },
    fx: { attempted: 0, written: 0, errors: [] },
    immigration: { attempted: 0, written: 0, skippedNonEnglish: 0, errors: [] },
    legal: { attempted: 0, written: 0, skippedNonEnglish: 0, errors: [] },
    transport: { attempted: 0, written: 0, skippedNonEnglish: 0, errors: [] },
  };

  if (normalizedKinds.includes('weather')) {
    await ingestWeather(result.weather);
  }
  if (normalizedKinds.includes('fx')) {
    await ingestFx(result.fx);
  }
  if (normalizedKinds.includes('immigration')) {
    await ingestNewsFamily(sourceConfig.immigration, 'immigration', result.immigration);
  }
  if (normalizedKinds.includes('legal')) {
    await ingestNewsFamily(sourceConfig.legal, 'legal', result.legal);
  }
  if (normalizedKinds.includes('transport')) {
    await ingestNewsFamily(sourceConfig.transport, 'transport', result.transport);
  }

  result.finishedAt = new Date().toISOString();
  return result;
}
