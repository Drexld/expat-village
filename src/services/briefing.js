// src/services/briefing.js
// AI-powered personalized briefing service using Groq

import { generateGroqResponse } from '../lib/groq'

/**
 * Generate a personalized morning briefing using AI
 * Takes into account user profile, weather, and date context
 */
export async function generatePersonalizedBriefing({ user, profile, weatherData }) {
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  // Determine user context
  const yearsInPoland = profile?.years_in_poland || 0
  const isNewcomer = yearsInPoland < 1
  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'friend'
  const interests = profile?.interests || []
  const trcExpiry = profile?.trc_expiry_date ? new Date(profile.trc_expiry_date) : null

  // Calculate TRC days remaining
  let trcDaysRemaining = null
  if (trcExpiry) {
    const diffTime = trcExpiry - today
    trcDaysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Build the prompt for AI
  const prompt = `You are a helpful assistant for Expat Village, an app for expats living in Poland. Generate a brief, friendly morning briefing.

Context:
- Today is ${dateStr}
- User's name: ${displayName}
- Weather in Warsaw: ${weatherData?.temp || 0}°C, ${weatherData?.condition || 'unknown'}
- User has been in Poland for: ${yearsInPoland} years
- User's interests: ${interests.length > 0 ? interests.join(', ') : 'not specified'}
${trcDaysRemaining !== null ? `- TRC expires in: ${trcDaysRemaining} days` : ''}

Language rules:
- ALL fields must be written in English.
- The ONLY Polish text should be the Polish part of "phraseOfTheDay".

Generate a JSON response with these fields:
1. "greeting" - A warm, personalized greeting (1 sentence, include weather context like "perfect for a hot coffee" or "bundle up!")
2. "todayInPoland" - An interesting historical fact or cultural tidbit about Poland related to today's date (1-2 sentences). Could be a historical event, a Polish tradition, a famous Polish person's birthday, etc.
3. "tip" - ${isNewcomer ? 'A helpful tip for newcomers to Poland' : 'An insider tip or interesting fact about Polish life'} (1 sentence)
4. "phraseOfTheDay" - A useful Polish phrase with translation (format: "Polish — English").
5. "localHabit" - A smart local habit or etiquette tip (1 sentence, no clichés).
6. "weekendRadar" - If today is Fri/Sat/Sun, a short note on what to watch for this weekend; otherwise a short "weekend prep" line (1 sentence).
${trcDaysRemaining !== null && trcDaysRemaining <= 60 ? `7. "trcAlert" - A reminder about their upcoming TRC expiry (1 sentence, be helpful not alarming)` : ''}

Keep it concise, warm, and actually useful. No generic fluff.

Respond ONLY with valid JSON, no markdown.`

  try {
    const response = await generateGroqResponse(prompt, {
      maxTokens: 400,
      temperature: 0.7
    })

    // Parse the JSON response
    const briefing = JSON.parse(response)
    return {
      success: true,
      ...briefing,
      isNewcomer,
      trcDaysRemaining,
      generatedAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('Failed to generate AI briefing:', error)
    // Return fallback briefing
    return generateFallbackBriefing({ displayName, weatherData, isNewcomer, trcDaysRemaining })
  }
}

/**
 * Fallback briefing when AI fails
 */
function generateFallbackBriefing({ displayName, weatherData, isNewcomer, trcDaysRemaining }) {
  const hour = new Date().getHours()
  const temp = weatherData?.temp || 0

  let timeGreeting = 'Good morning'
  if (hour >= 12 && hour < 17) timeGreeting = 'Good afternoon'
  else if (hour >= 17 && hour < 21) timeGreeting = 'Good evening'
  else if (hour >= 21 || hour < 5) timeGreeting = 'Good night'

  let weatherTip = ''
  if (temp <= 0) weatherTip = 'perfect for hot chocolate'
  else if (temp <= 10) weatherTip = 'grab a warm coffee'
  else if (temp <= 20) weatherTip = 'great for a walk'
  else weatherTip = 'stay cool with some lody'

  const todayFacts = [
    "Poland has the oldest restaurant in Europe - Piwnica Świdnicka in Wrocław, operating since 1275.",
    "Polish mathematicians broke the Enigma code before WWII, a crucial contribution to Allied victory.",
    "Marie Curie (Maria Skłodowska) was born in Warsaw and is the only person to win Nobel Prizes in two different sciences.",
    "Poland's Białowieża Forest is one of Europe's last primeval forests, home to wild European bison.",
    "The Polish Constitution of May 3, 1791 was the first modern constitution in Europe.",
  ]

  return {
    success: true,
    greeting: `${timeGreeting}, ${displayName}! It's ${temp}°C outside — ${weatherTip}.`,
    todayInPoland: todayFacts[new Date().getDate() % todayFacts.length],
    tip: isNewcomer
      ? "Pro tip: The 'Żabka' convenience stores are open late and perfect for quick groceries."
      : "Did you know? Saying 'Dzień dobry' with a smile goes a long way in Poland.",
    phraseOfTheDay: "Poproszę — I'll have / I would like",
    localHabit: isNewcomer
      ? "Keep small cash for bakeries and corner shops; card machines can be temperamental."
      : "When you enter smaller shops, a quick 'Dzień dobry' is expected and appreciated.",
    weekendRadar: "Weekend prep: check Sunday trading rules and stock up if needed.",
    trcAlert: trcDaysRemaining !== null && trcDaysRemaining <= 60
      ? `Your TRC expires in ${trcDaysRemaining} days. Start your renewal process soon!`
      : null,
    isNewcomer,
    trcDaysRemaining,
    generatedAt: new Date().toISOString(),
    isFallback: true
  }
}

/**
 * Get smart, filtered announcements based on user profile
 */
export function filterAnnouncementsForUser(announcements, profile) {
  if (!announcements || !Array.isArray(announcements)) return []

  const hasProfile = !!profile
  const yearsInPoland = profile?.years_in_poland ?? null
  const interests = profile?.interests || []

  return announcements.filter(announcement => {
    const type = (announcement.type || '').toLowerCase()

    // If profile isn't loaded yet, only show high-signal alerts
    if (!hasProfile) {
      return ['alert', 'warning', 'update'].includes(type)
    }

    // Filter by target audience if specified
    if (announcement.target_audience) {
      switch (announcement.target_audience) {
        case 'newcomers':
          if (yearsInPoland !== null && yearsInPoland >= 2) return false
          break
        case 'experienced':
          if (yearsInPoland !== null && yearsInPoland < 2) return false
          break
        // 'all' or unspecified shows to everyone
      }
    }

    // Filter by category/interests if user has preferences
    if (announcement.category && interests.length > 0) {
      // Show if matches any interest, or if it's a general/alert type
      const isGeneral = ['alert', 'warning', 'update'].includes(type)
      const matchesInterest = interests.some(interest =>
        announcement.category?.toLowerCase().includes(interest.toLowerCase())
      )
      if (!isGeneral && !matchesInterest) return false
    }

    return true
  })
}

/**
 * Check if user needs TRC reminder
 */
export function getTrcReminder(profile) {
  if (!profile?.trc_expiry_date) return null

  const today = new Date()
  const expiry = new Date(profile.trc_expiry_date)
  const daysRemaining = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))

  if (daysRemaining <= 0) {
    return {
      type: 'expired',
      message: 'Your TRC has expired! Contact your local urząd immediately.',
      urgent: true
    }
  } else if (daysRemaining <= 30) {
    return {
      type: 'urgent',
      message: `Your TRC expires in ${daysRemaining} days. File your renewal application NOW.`,
      urgent: true
    }
  } else if (daysRemaining <= 45) {
    return {
      type: 'warning',
      message: `Your TRC expires in ${daysRemaining} days. Time to gather your renewal documents.`,
      urgent: false
    }
  } else if (daysRemaining <= 60) {
    return {
      type: 'reminder',
      message: `Your TRC expires in ${daysRemaining} days. Start preparing your renewal soon.`,
      urgent: false
    }
  }

  return null
}
