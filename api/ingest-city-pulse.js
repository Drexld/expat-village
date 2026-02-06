/* global process */
import { createClient } from '@supabase/supabase-js'
import { XMLParser } from 'fast-xml-parser'
import { CITY_PULSE_SOURCES } from './cityPulseSources.js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const WARSAW_API_KEY = process.env.WARSAW_API_KEY
const GROQ_API_KEY = process.env.GROQ_API_KEY
const CRON_SECRET = process.env.CRON_SECRET
const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || process.env.VITE_WEATHER_API_KEY
const REQUEST_TIMEOUT_MS = 8000
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

function isLikelyPolish(text) {
  if (!text) return false
  const lower = text.toLowerCase()
  if (/[ąćęłńóśżź]/.test(lower)) return true
  const common = [' oraz ', ' że ', ' nie ', ' się ', ' jest ', ' przez ', ' do ', ' na ', ' z ']
  return common.some((w) => lower.includes(w))
}

async function translateToEnglish({ title, message }) {
  if (!GROQ_API_KEY) return null
  const systemPrompt =
    "You translate Polish public alerts to clear English. Keep names, dates, numbers, and codes. Return ONLY valid JSON with keys: title, message."
  const userPrompt = `Translate to English:\nTITLE: ${title}\nMESSAGE: ${message}`

  const response = await withTimeout(
    fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 700,
      }),
    }),
    REQUEST_TIMEOUT_MS
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Groq translation failed: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  const content = data?.choices?.[0]?.message?.content || ''
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return null
  return JSON.parse(jsonMatch[0])
}

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
      language: isLikelyPolish(`${item.title} ${item.message}`) ? 'pl' : 'en',
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

  const { data: insertedRows, error } = await supabase
    .from('announcements')
    .insert(toInsert)
    .select('id,title,message,language')
  if (error) throw error

  return { inserted: toInsert.length, rows: insertedRows || [] }
}

// ============================================
// AI CITY INTELLIGENCE GENERATION
// ============================================

async function fetchWeatherContext() {
  if (!WEATHER_API_KEY) return 'Weather data unavailable'
  try {
    const res = await withTimeout(
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=Warsaw,PL&units=metric&appid=${WEATHER_API_KEY}`),
      REQUEST_TIMEOUT_MS
    )
    if (!res.ok) return 'Weather data unavailable'
    const w = await res.json()
    return `${Math.round(w.main.temp)}°C, ${w.weather[0].description}, wind ${w.wind.speed}m/s, humidity ${w.main.humidity}%`
  } catch {
    return 'Weather data unavailable'
  }
}

async function generateCityIntelligence(weatherContext) {
  if (!GROQ_API_KEY) return []

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  })
  const month = today.getMonth() + 1
  const dayOfWeek = today.getDay()
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
  const isSunday = dayOfWeek === 0

  const prompt = `You are a Warsaw city intelligence assistant for English-speaking expats.
Generate 4 timely, actionable city updates for Warsaw, Poland.

Today: ${dateStr}
Weather: ${weatherContext}
Weekend: ${isWeekend ? 'Yes' : 'No'}
Sunday: ${isSunday ? 'Yes (most shops closed)' : 'No'}
Month: ${month}
Season: ${month <= 2 || month === 12 ? 'Winter' : month <= 5 ? 'Spring' : month <= 8 ? 'Summer' : 'Autumn'}

Generate updates about these topics (pick the most relevant 4):
- Current traffic patterns and known construction zones in Warsaw
- Public transport status (ZTM buses/trams, Metro lines M1/M2)
- Notable events or activities happening in Warsaw today/this week
- Seasonal advisories (icy sidewalks in winter, road works in summer, heating season, etc.)
- Sunday/weekend trading rules and what's open
- Practical expat tips relevant to the current season/date

Rules:
- ALL text MUST be in English
- Be specific to Warsaw neighborhoods, streets, metro lines
- Each item needs a short "title" (max 8 words) and a "message" (1-2 sentences, actionable)
- Include concrete details, not generic advice
- Assign each a type: "warning" for disruptions/hazards, "update" for general info, "event" for events

Return ONLY a valid JSON array, no markdown:
[{"title":"...","message":"...","type":"warning|update|event"}]`

  try {
    const response = await withTimeout(
      fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: 'Generate today\'s Warsaw city intelligence.' },
          ],
          temperature: 0.5,
          max_tokens: 1000,
        }),
      }),
      15000
    )

    if (!response.ok) {
      console.error('Groq city intel failed:', response.status)
      return []
    }

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content || ''
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    if (!jsonMatch) return []

    return JSON.parse(jsonMatch[0])
  } catch (err) {
    console.error('City intelligence generation error:', err)
    return []
  }
}

export default async function handler(req, res) {
  if (CRON_SECRET && req.headers['x-cron-secret'] !== CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Supabase env not configured' })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  const results = []

  // 1. Deactivate old AI-generated items (older than 24 hours)
  try {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    await supabase
      .from('announcements')
      .update({ active: false })
      .eq('category', 'ai-city-intel')
      .lt('created_at', cutoff)
    results.push({ step: 'cleanup', ok: true })
  } catch (err) {
    results.push({ step: 'cleanup', error: err.message })
  }

  // 2. Process external sources (if any configured)
  for (const source of CITY_PULSE_SOURCES) {
    try {
      const items = await fetchSource(source)
      const inserted = await insertAnnouncements(supabase, source, items)

      const polishRows = (inserted.rows || []).filter((r) => r.language === 'pl')
      for (const row of polishRows) {
        try {
          const translated = await translateToEnglish({
            title: row.title,
            message: row.message,
          })
          if (!translated?.title || !translated?.message) continue
          await supabase
            .from('announcement_translations')
            .upsert(
              {
                announcement_id: row.id,
                language: 'en',
                title: translated.title,
                message: translated.message,
                created_by: null,
              },
              { onConflict: 'announcement_id,language' }
            )
        } catch (translationError) {
          results.push({ id: source.id, translation_error: translationError.message })
        }
      }

      results.push({ id: source.id, inserted: inserted.inserted })
    } catch (error) {
      results.push({ id: source.id, error: error.message })
    }
  }

  // 3. Generate AI city intelligence (always English)
  try {
    const weatherContext = await fetchWeatherContext()
    const cityIntel = await generateCityIntelligence(weatherContext)

    let inserted = 0
    for (const item of cityIntel) {
      if (!item.title || !item.message) continue
      const { error } = await supabase.from('announcements').insert({
        title: item.title,
        message: item.message,
        type: item.type || 'update',
        priority: item.type === 'warning' ? 1 : 0,
        active: true,
        scope: 'city',
        category: 'ai-city-intel',
        target_audience: 'all',
        language: 'en',
        link_url: null,
        link_text: null,
      })
      if (!error) inserted++
    }

    results.push({ step: 'ai-city-intel', generated: cityIntel.length, inserted })
  } catch (err) {
    results.push({ step: 'ai-city-intel', error: err.message })
  }

  return res.status(200).json({ ok: true, results })
}
