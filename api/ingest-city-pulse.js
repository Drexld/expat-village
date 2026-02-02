import { createClient } from '@supabase/supabase-js'
import { XMLParser } from 'fast-xml-parser'
import { CITY_PULSE_SOURCES } from './cityPulseSources.js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const WARSAW_API_KEY = process.env.WARSAW_API_KEY
const CRON_SECRET = process.env.CRON_SECRET
const REQUEST_TIMEOUT_MS = 8000

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  trimValues: true,
})

function withTimeout(promise, timeoutMs) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), timeoutMs)
    ),
  ])
}

function normalizeRssItems(feed) {
  const channel = feed?.rss?.channel || feed?.feed
  const items = channel?.item || channel?.entry || []
  const arr = Array.isArray(items) ? items : [items]

  return arr
    .filter(Boolean)
    .map((item) => ({
      title: item.title?.['#text'] || item.title || '',
      message: item.description?.['#text'] || item.summary || item.description || '',
      link_url: item.link?.href || item.link || '',
      published_at: item.pubDate || item.published || item.updated || null,
    }))
}

async function fetchSource(source) {
  let url = source.url

  if (source.requiresKey && WARSAW_API_KEY) {
    const u = new URL(url)
    if (!u.searchParams.get('apikey')) {
      u.searchParams.set('apikey', WARSAW_API_KEY)
    }
    url = u.toString()
  }

  const response = await withTimeout(fetch(url), REQUEST_TIMEOUT_MS)
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Fetch failed (${response.status}): ${errorText}`)
  }

  if (source.format === 'rss') {
    const xml = await response.text()
    const parsed = parser.parse(xml)
    const rssItems = normalizeRssItems(parsed)
    return rssItems.map((item) => ({
      ...item,
      ...(source.mapItem ? source.mapItem(item) : {}),
    }))
  }

  const json = await response.json()
  const items = source.mapItems ? source.mapItems(json) : json.items || json.data || []
  return (items || []).map((item) => ({
    ...(source.mapItem ? source.mapItem(item) : item),
  }))
}

async function insertAnnouncements(supabase, source, items) {
  const rows = items
    .filter((item) => item.title && item.message)
    .map((item) => ({
      title: item.title,
      message: item.message,
      type: source.type || 'update',
      priority: source.priority ?? 0,
      active: true,
      link_url: item.link_url || null,
      link_text: source.link_text || 'Source',
      scope: source.scope || 'city',
      category: source.category || null,
      target_audience: source.target_audience || 'all',
    }))

  if (rows.length === 0) return { inserted: 0 }

  const linkUrls = rows.map((r) => r.link_url).filter(Boolean)
  let existingSet = new Set()
  if (linkUrls.length > 0) {
    const { data: existing } = await supabase
      .from('announcements')
      .select('link_url')
      .in('link_url', linkUrls)
    existingSet = new Set((existing || []).map((e) => e.link_url))
  }

  const toInsert = rows.filter((r) => !r.link_url || !existingSet.has(r.link_url))
  if (toInsert.length === 0) return { inserted: 0 }

  const { error } = await supabase.from('announcements').insert(toInsert)
  if (error) throw error

  return { inserted: toInsert.length }
}

export default async function handler(req, res) {
  if (CRON_SECRET && req.headers['x-cron-secret'] !== CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Supabase env not configured' })
  }

  if (!CITY_PULSE_SOURCES || CITY_PULSE_SOURCES.length === 0) {
    return res.status(200).json({ ok: true, message: 'No sources configured yet.' })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  const results = []
  for (const source of CITY_PULSE_SOURCES) {
    try {
      const items = await fetchSource(source)
      const inserted = await insertAnnouncements(supabase, source, items)
      results.push({ id: source.id, inserted: inserted.inserted })
    } catch (error) {
      results.push({ id: source.id, error: error.message })
    }
  }

  return res.status(200).json({ ok: true, results })
}
