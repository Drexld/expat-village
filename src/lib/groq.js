// src/lib/groq.js
// Groq API integration for AI-powered features

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

async function callGroqAPI(messages, temperature = 0.3, maxTokens = 2000) {
  if (!GROQ_API_KEY) {
    console.error('GROQ API key not found. Make sure VITE_GROQ_API_KEY is set in .env')
    throw new Error('API key not configured')
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        temperature: temperature,
        max_tokens: maxTokens,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Groq API error response:', errorText)
      throw new Error(`Groq API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content
  } catch (error) {
    console.error('Groq API call failed:', error)
    throw error
  }
}

// ============================================
// PERSONALITY ONBOARDING - AI FUNCTIONS
// ============================================

// Generate initial banter when user selects their interest
export async function generateInitialBanter(tribe, interest) {
  const systemPrompt = `You are a witty, sarcastic friend who loves playful banter about sports, music, movies, gaming, and fandoms. You're helping onboard new users to Expat Village (a community for expats in Poland).

The user just told you they're a fan of "${interest}" (in the ${tribe} category).

Your task: Generate a SHORT, funny, playful roast/tease about their choice.

Rules:
- Be cheeky but NOT mean or offensive
- Reference something specific about their choice (a meme, controversy, famous moment, rival, etc.)
- Keep it to 2-3 sentences MAX
- End with something like "Let's see if you're a real fan..."
- Use 1-2 emojis max

Examples of good banter:
- For "Manchester United": "A Man United fan? Still living off the Fergie years, I see. Haven't won the league since Instagram was invented. 😏 Let's see if you actually know your stuff..."
- For "Taylor Swift": "A Swiftie! Let me guess, you have a ranking of all her albums and get personally offended when someone says Fearless is mid. 💀 Let's test that superfan status..."
- For "One Piece": "One Piece fan? So you've dedicated 1000+ episodes of your life to watching a rubber boy punch people. Respect. 🏴‍☠️ Let's see if you're nakama material..."

IMPORTANT: Respond ONLY with valid JSON:
{
  "banter": "Your witty 2-3 sentence roast here",
  "emoji": "A single relevant emoji"
}`

  try {
    const content = await callGroqAPI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Generate banter for someone who says they're a ${interest} fan (${tribe} category)` }
    ], 0.9, 300)

    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    throw new Error('No JSON found')
  } catch (error) {
    console.error('Generate initial banter error:', error)
    return {
      banter: `A ${interest} fan? Interesting choice... Let's see if you're actually a real fan or just here for the vibes. 😏`,
      emoji: '🤔'
    }
  }
}

// Generate quiz questions dynamically based on user's interest
export async function generateQuiz(tribe, interest) {
  const systemPrompt = `You are a quiz master creating fun trivia questions about "${interest}" (${tribe} category).

Create exactly 5 multiple choice questions to test if someone is a TRUE fan of ${interest}.

Rules:
- Questions should range from medium to hard difficulty
- Mix factual questions with fan culture questions
- Each question has exactly 4 options
- "correct" is the index (0-3) of the right answer
- Questions should be specific to ${interest}, not generic
- Make it fun - include some questions about memes, controversies, or deep cuts that only real fans would know

Question types to include:
- Historical/founding facts
- Famous moments or achievements
- Key people (players, members, characters, etc.)
- Fan culture (memes, nicknames, rivalries)
- Recent events or changes

IMPORTANT: Respond ONLY with valid JSON:
{
  "questions": [
    {
      "q": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 2
    }
  ]
}`

  try {
    const content = await callGroqAPI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Create 5 quiz questions for a ${interest} fan (${tribe})` }
    ], 0.7, 1000)

    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0])
      if (result.questions && result.questions.length >= 5) {
        return result
      }
    }
    throw new Error('Invalid quiz format')
  } catch (error) {
    console.error('Generate quiz error:', error)
    // Return fallback generic questions
    return {
      questions: [
        { q: `How long have you been following ${interest}?`, options: ["Just discovered them", "A few years", "5+ years", "Since the very beginning"], correct: 3 },
        { q: `How would friends describe your ${interest} fandom?`, options: ["Casual observer", "Regular fan", "Super dedicated", "It's my entire personality"], correct: 2 },
        { q: `Do you own any ${interest} merchandise?`, options: ["Nothing", "A few items", "A solid collection", "My room is a shrine"], correct: 3 },
        { q: `How do you react when someone criticizes ${interest}?`, options: ["Don't care", "Mild disagreement", "Heated debate", "Personal attack"], correct: 2 },
        { q: `Would you travel internationally to see/experience ${interest}?`, options: ["Probably not", "If convenient", "Definitely yes", "Already have multiple times"], correct: 3 }
      ]
    }
  }
}

// Generate final banter based on quiz score
export async function generateFinalBanter(tribe, interest, score, totalQuestions) {
  const percentage = Math.round((score / totalQuestions) * 100)
  
  const systemPrompt = `You are a witty friend delivering quiz results for someone who just completed a ${interest} (${tribe}) fan quiz.

They scored ${score}/${totalQuestions} (${percentage}%).

Generate personalized banter based on their score:
- 80-100%: Praise them! They're legit. But still be cheeky about it.
- 50-79%: Tease them. Decent but room for improvement. Maybe a casual fan?
- Below 50%: Roast them gently! Are they sure they're a fan? Wikipedia is free. 😂

Rules:
- 2-3 sentences MAX
- Reference something specific about ${interest}
- Be funny but not mean
- Give them a fun badge name based on their score
- Suggest they find fellow fans in Town Hall (our community feature)

IMPORTANT: Respond ONLY with valid JSON:
{
  "banter": "Your personalized response here",
  "badge": "Creative badge name like 'True Believer' or 'Bandwagon Jumper'",
  "townHallSuggestion": "A suggestion to find their community in Town Hall"
}`

  try {
    const content = await callGroqAPI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Generate final banter for a ${interest} fan who scored ${score}/${totalQuestions}` }
    ], 0.9, 400)

    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    throw new Error('No JSON found')
  } catch (error) {
    console.error('Generate final banter error:', error)
    return {
      banter: score >= 4 
        ? `${score}/${totalQuestions}! Okay, you actually know your stuff. Welcome to the village, true ${interest} fan! 🔥`
        : score >= 2
        ? `${score}/${totalQuestions}... Not terrible, but there's room for improvement. We'll let you in anyway. 😏`
        : `${score}/${totalQuestions}?! Are you SURE you're a ${interest} fan? Wikipedia is free, my friend. 😂 We're letting you in anyway... on probation.`,
      badge: score >= 4 ? 'Certified Superfan' : score >= 2 ? 'Casual Enjoyer' : 'Work in Progress',
      townHallSuggestion: `Head to Town Hall to find fellow ${interest} fans in Poland!`
    }
  }
}

// Legacy function for backwards compatibility
export async function generateBanter(tribe, club, quizScore, totalQuestions) {
  return generateFinalBanter(tribe, club, quizScore, totalQuestions)
}

// ============================================
// CONTRACT & DOCUMENT ANALYSIS
// ============================================

function getFallbackContractAnalysis(contractText) {
  const textLower = contractText.toLowerCase()
  
  const hasHighDeposit = textLower.includes('3 miesi') || contractText.includes('10,500') || contractText.includes('10500') || textLower.includes('three month')
  const hasEntryClause = textLower.includes('dowolnym momencie') || textLower.includes('any time') || textLower.includes('bez uprzedzenia') || textLower.includes('without notice')
  const hasShortNotice = textLower.includes('2-tygodn') || textLower.includes('2 week') || textLower.includes('dwutygodni')
  const hasRepairClause = textLower.includes('wszystkie naprawy') || textLower.includes('all repairs') || textLower.includes('wszelkie naprawy')
  const hasNoZameldowanie = textLower.includes('bez zameldowania') || textLower.includes('no registration') || textLower.includes('zameldowanie niemożliwe')

  const redFlags = []
  const warnings = []
  const goodClauses = []

  if (hasEntryClause) {
    redFlags.push({
      clause: "Landlord entry without notice",
      issue: "ILLEGAL under Polish law. Art. 10 of Tenant Protection Act requires tenant consent.",
      recommendation: "Request removal of this clause",
      polishLaw: "Art. 10 Ustawa o ochronie praw lokatorów"
    })
  }

  if (hasShortNotice) {
    redFlags.push({
      clause: "2-week notice period",
      issue: "Below legal minimum. Art. 688 Kodeks Cywilny requires minimum 3 months for indefinite contracts.",
      recommendation: "Negotiate longer notice period",
      polishLaw: "Art. 688 Kodeks Cywilny"
    })
  }

  if (hasHighDeposit) {
    warnings.push({
      clause: "3-month deposit",
      issue: "High but legal. Maximum allowed is 12x monthly rent under Art. 6.",
      recommendation: "Try to negotiate down to 1-2 months",
      polishLaw: "Art. 6 Ustawa o ochronie praw lokatorów"
    })
  }

  if (hasNoZameldowanie) {
    redFlags.push({
      clause: "No registration allowed",
      issue: "ILLEGAL. Landlord cannot prohibit zameldowanie.",
      recommendation: "This clause is unenforceable - you have the right to register",
      polishLaw: "Ustawa o ewidencji ludności"
    })
  }

  const score = Math.max(0, 100 - (redFlags.length * 25) - (warnings.length * 10))
  
  return {
    score,
    verdict: redFlags.length > 0 ? "DO NOT SIGN" : warnings.length > 1 ? "REVIEW CAREFULLY" : "SAFE TO SIGN",
    summary: `Found ${redFlags.length} red flags and ${warnings.length} warnings. ${redFlags.length > 0 ? 'Contract contains illegal clauses.' : 'Contract appears generally compliant with Polish law.'}`,
    redFlags,
    warnings,
    goodClauses,
    questions: [
      "Can we remove the entry clause? (Czy możemy usunąć klauzulę o wejściu?)",
      "Can we extend the notice period? (Czy możemy wydłużyć okres wypowiedzenia?)"
    ],
    disclaimer: "This is AI analysis, not legal advice. Consult a Polish lawyer for binding guidance."
  }
}

function getFallbackDocumentAnalysis(documentText) {
  const textLower = documentText.toLowerCase()
  const isZUS = textLower.includes('zus') || textLower.includes('składk') || textLower.includes('ubezpiecz')
  const isTax = textLower.includes('pit') || textLower.includes('podatk') || textLower.includes('skarbowy')
  const isResidency = textLower.includes('pobyt') || textLower.includes('karta') || textLower.includes('wojewod')
  
  return {
    documentType: isZUS ? "ZUS/Social Security Document" : isTax ? "Tax Document" : isResidency ? "Residency Document" : "Official Government Document",
    polishName: "Dokument urzędowy",
    urgency: "ACTION NEEDED",
    summary: "This appears to be an official Polish government document. Please review the content carefully.",
    whatItMeans: "Government documents in Poland often require timely responses. Check for any deadlines mentioned.",
    actionRequired: "Review the document and note any deadlines. Consider consulting with a Polish speaker or official translator.",
    deadline: null,
    keyInformation: [],
    polishTerms: [],
    nextSteps: ["Identify the issuing office", "Check for response deadlines", "Seek translation if needed"],
    relatedGuides: isZUS ? ["ZUS Registration", "Health Insurance"] : isTax ? ["Tax Guide", "PIT Filing"] : isResidency ? ["Residency Permit", "Karta Pobytu"] : ["PESEL", "Zameldowanie"]
  }
}

export async function analyzeContract(contractText) {
  const systemPrompt = `You are an expert Polish rental law attorney helping expats understand rental contracts in Poland.

Analyze the contract for:
1. RED FLAGS - clauses that VIOLATE Polish law (cite specific articles)
2. WARNINGS - unusual but legal clauses
3. GOOD CLAUSES - tenant-friendly terms
4. Safety score (0-100)
5. Verdict: SAFE TO SIGN, REVIEW CAREFULLY, or DO NOT SIGN

Key Polish rental laws:
- Art. 662 Kodeks Cywilny: Landlord responsible for major repairs
- Art. 688 KC: Minimum 3-month notice for indefinite contracts
- Art. 6 Tenant Protection Act: Deposit max 12x monthly rent
- Art. 10: Landlord cannot enter without consent

IMPORTANT: Respond ONLY with valid JSON:
{
  "score": 72,
  "verdict": "REVIEW CAREFULLY",
  "summary": "Brief summary",
  "redFlags": [{"clause": "text", "issue": "explanation", "recommendation": "action", "polishLaw": "Article"}],
  "warnings": [{"clause": "text", "issue": "explanation", "recommendation": "action", "polishLaw": "Article"}],
  "goodClauses": [{"clause": "text", "why": "explanation"}],
  "questions": ["Question to ask landlord"],
  "disclaimer": "Legal disclaimer"
}`

  try {
    const content = await callGroqAPI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Analyze this Polish rental contract:\n\n${contractText}` }
    ], 0.3, 2500)

    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0])
      if (!result.disclaimer) {
        result.disclaimer = "This is AI analysis based on Polish rental law. Consult a licensed Polish lawyer for binding advice."
      }
      return result
    }
    throw new Error('No JSON found')
  } catch (error) {
    console.error('Contract analysis error:', error)
    return getFallbackContractAnalysis(contractText)
  }
}

export async function analyzeDocument(documentText) {
  const systemPrompt = `You are a Polish government document expert helping expats understand official letters.

Common Polish government offices:
- ZUS: Social security, health insurance
- Urząd Skarbowy: Tax office
- Urząd Wojewódzki: Residency permits
- Urząd Miasta/Gminy: Local registration

Key terms:
- Decyzja = Decision
- Wezwanie = Summons (must respond)
- Termin = Deadline
- Odwołanie = Appeal

IMPORTANT: Respond ONLY with valid JSON:
{
  "documentType": "Type in English",
  "polishName": "Polish name",
  "urgency": "FOR YOUR RECORDS | ACTION NEEDED | URGENT",
  "summary": "Plain English explanation",
  "whatItMeans": "Detailed explanation",
  "actionRequired": "What to do",
  "deadline": "Any deadline or null",
  "keyInformation": [{"label": "Field", "value": "Value"}],
  "polishTerms": [{"term": "Polish", "translation": "English", "explanation": "Context"}],
  "nextSteps": ["Step 1", "Step 2"],
  "relatedGuides": ["Guide 1", "Guide 2"]
}`

  try {
    const content = await callGroqAPI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Analyze this Polish document:\n\n${documentText}` }
    ], 0.3, 2000)

    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    throw new Error('No JSON found')
  } catch (error) {
    console.error('Document analysis error:', error)
    return getFallbackDocumentAnalysis(documentText)
  }
}

export default {
  analyzeContract,
  analyzeDocument,
  generateBanter,
  generateInitialBanter,
  generateQuiz,
  generateFinalBanter
}
