// src/lib/groq.js
// Groq API integration for AI-powered features - POLISH LAW EDITION

// API key from environment variable (set in .env file)
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
        model: 'llama-3.1-8b-instant',
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

// Polish law-based fallback analysis
function getFallbackContractAnalysis(contractText) {
  const textLower = contractText.toLowerCase()
  
  const hasHighDeposit = textLower.includes('3 miesi') || contractText.includes('10,500') || contractText.includes('10500') || textLower.includes('three month')
  const hasEntryClause = textLower.includes('dowolnym momencie') || textLower.includes('any time') || textLower.includes('bez uprzedzenia') || textLower.includes('without notice')
  const hasShortNotice = textLower.includes('2-tygodn') || textLower.includes('2 week') || textLower.includes('dwutygodni')
  const hasRepairClause = textLower.includes('wszystkie naprawy') || textLower.includes('all repairs') || textLower.includes('wszelkie naprawy')
  const hasNoPets = textLower.includes('zwierz') || textLower.includes('pet')
  const hasNoZameldowanie = textLower.includes('bez zameldowania') || textLower.includes('no registration') || textLower.includes('zameldowanie niemożliwe')
  const hasImmediateTermination = textLower.includes('ze skutkiem natychmiastowym') || textLower.includes('immediate effect') || textLower.includes('natychmiastowe wypowiedzenie')
  const hasPenaltyClause = textLower.includes('kara umowna') || textLower.includes('penalty') || textLower.includes('odszkodowanie')
  const hasRentIncrease = textLower.includes('podwyżka') || textLower.includes('rent increase') || textLower.includes('zmiana czynszu')

  const redFlags = []
  const warnings = []
  const goodClauses = []

  // RED FLAGS - Violations of Polish law
  if (hasEntryClause) {
    redFlags.push({
      clause: "Wynajmujący ma prawo wejść do lokalu w dowolnym momencie",
      issue: "ILLEGAL under Polish law. Article 10 of the Tenant Protection Act (Ustawa o ochronie praw lokatorów) requires landlord to give notice and obtain tenant consent except in emergencies (fire, gas leak, flood).",
      recommendation: "Remove this clause or modify to: 'Landlord may enter with 24-hour notice and tenant consent, except in emergencies.' This clause is unenforceable in Polish courts.",
      polishLaw: "Art. 10 Ustawy o ochronie praw lokatorów"
    })
  }

  if (hasImmediateTermination) {
    redFlags.push({
      clause: "Wypowiedzenie ze skutkiem natychmiastowym",
      issue: "Under Polish Civil Code (Art. 688), landlords cannot terminate without cause. Immediate termination is only allowed for serious breaches (non-payment for 3+ months, illegal activity, major damage).",
      recommendation: "Ensure the clause specifies LEGAL grounds for immediate termination only. Generic immediate termination clauses are unenforceable.",
      polishLaw: "Art. 688 Kodeksu Cywilnego, Art. 11 Ustawy o ochronie praw lokatorów"
    })
  }

  if (hasRepairClause) {
    redFlags.push({
      clause: "Najemca odpowiada za wszystkie naprawy",
      issue: "VIOLATES Polish Civil Code Article 662. Landlord is legally responsible for major repairs (heating system, plumbing, electrical, structural). Only minor repairs (painting, small fixes) can be tenant's responsibility.",
      recommendation: "Modify to comply with Art. 662 KC: tenant handles minor repairs, landlord handles major repairs and appliances.",
      polishLaw: "Art. 662 Kodeksu Cywilnego"
    })
  }

  if (hasShortNotice) {
    redFlags.push({
      clause: "2-tygodniowy okres wypowiedzenia",
      issue: "TOO SHORT under Polish law. For indefinite-term contracts, minimum notice is 3 months (Art. 688 KC). For fixed-term, early termination must be explicitly allowed in the contract.",
      recommendation: "For your protection, negotiate minimum 1-month notice. Standard in Poland is 1-3 months.",
      polishLaw: "Art. 688 Kodeksu Cywilnego"
    })
  }

  if (hasNoZameldowanie) {
    redFlags.push({
      clause: "Zakaz zameldowania / No registration allowed",
      issue: "Landlords CANNOT legally prevent zameldowanie (registration). Under Polish law, tenants have the right to register their residence. This is required for many official purposes (PESEL, healthcare, voting).",
      recommendation: "This clause is unenforceable. You have a legal right to register. However, landlord obstruction can make it difficult - consider a different apartment.",
      polishLaw: "Ustawa o ewidencji ludności"
    })
  }

  // WARNINGS - Unusual but not illegal
  if (hasHighDeposit) {
    warnings.push({
      clause: "Kaucja: 3 miesiące czynszu",
      issue: "While legal (max is 12x monthly rent under Art. 6 Tenant Protection Act), 3 months is above market standard. Typical deposit in Poland is 1-2 months.",
      recommendation: "Try negotiating down to 2 months. Ensure contract specifies conditions for full return (inspection checklist, timeline).",
      polishLaw: "Art. 6 Ustawy o ochronie praw lokatorów"
    })
  }

  if (hasNoPets) {
    warnings.push({
      clause: "Zakaz posiadania zwierząt bez zgody",
      issue: "Pet restrictions are legal in Poland. However, landlord cannot unreasonably refuse if pet doesn't cause damage or disturbance.",
      recommendation: "If you have pets, get written permission BEFORE signing. If landlord agrees verbally, it's not binding.",
      polishLaw: "Dozwolone w umowie najmu"
    })
  }

  if (hasPenaltyClause) {
    warnings.push({
      clause: "Kara umowna (Contractual penalty)",
      issue: "Penalty clauses are legal but must be proportionate. Polish courts can reduce excessive penalties (Art. 484 KC).",
      recommendation: "Check the penalty amounts. If they seem excessive (e.g., 3x monthly rent for early termination), negotiate or know that courts may reduce them.",
      polishLaw: "Art. 484 Kodeksu Cywilnego"
    })
  }

  if (hasRentIncrease) {
    warnings.push({
      clause: "Możliwość podwyżki czynszu",
      issue: "Rent increases are regulated. For indefinite contracts, landlord must give written notice with justification. For fixed-term, rent is usually locked unless contract specifies otherwise.",
      recommendation: "Check if increase frequency and amount are specified. Ensure any increase requires written notice (typically 3 months in advance).",
      polishLaw: "Art. 8a Ustawy o ochronie praw lokatorów"
    })
  }

  // GOOD CLAUSES - Look for tenant protections
  if (textLower.includes('protokół zdawczo-odbiorczy') || textLower.includes('inventory') || textLower.includes('protokol')) {
    goodClauses.push({
      clause: "Protokół zdawczo-odbiorczy (Handover protocol)",
      why: "This protects you! Document the apartment condition at move-in to avoid disputes about deposit return."
    })
  }

  if (textLower.includes('zwrot kaucji') || textLower.includes('deposit return')) {
    goodClauses.push({
      clause: "Deposit return conditions specified",
      why: "Having clear deposit return terms protects you. Under Polish law, landlord must return deposit within 30 days of move-out (minus legitimate deductions)."
    })
  }

  // Always add at least one good clause for balance
  if (goodClauses.length === 0) {
    if (textLower.includes('czynsz') || textLower.includes('rent')) {
      goodClauses.push({
        clause: "Clear rent amount specified",
        why: "Transparency about monthly costs is important. Make sure you understand what's included (czynsz administracyjny, media, etc.)"
      })
    } else {
      goodClauses.push({
        clause: "Written contract",
        why: "Having a written umowa najmu is always better than verbal agreement. It provides legal protection for both parties."
      })
    }
  }

  // Calculate score based on Polish law compliance
  let score = 100
  score -= redFlags.length * 20  // Serious violations
  score -= warnings.length * 8   // Concerns
  score = Math.max(score, 15)    // Minimum score

  let verdict = 'SAFE TO SIGN'
  if (score < 40) verdict = 'DO NOT SIGN'
  else if (score < 70) verdict = 'REVIEW CAREFULLY'

  return {
    score: score,
    verdict: verdict,
    summary: `Found ${redFlags.length} clause(s) that may violate Polish law and ${warnings.length} unusual terms. ${redFlags.length > 0 ? 'Some clauses may be unenforceable in Polish courts.' : 'Contract appears to comply with basic Polish rental law.'}`,
    redFlags: redFlags,
    warnings: warnings,
    goodClauses: goodClauses,
    questions: [
      "Czy mogę się zameldować pod tym adresem? (Can I register at this address?)",
      "Jaki jest dokładny okres wypowiedzenia dla obu stron? (What is the exact notice period for both parties?)",
      "Kto odpowiada za naprawy instalacji (ogrzewanie, hydraulika)? (Who is responsible for repairs to installations?)",
      "Jakie są warunki zwrotu kaucji? (What are the deposit return conditions?)",
      "Czy będzie protokół zdawczo-odbiorczy? (Will there be a handover protocol?)"
    ],
    disclaimer: "This analysis is based on Polish rental law including Kodeks Cywilny and Ustawa o ochronie praw lokatorów. For legally binding advice, consult a Polish lawyer."
  }
}

function getFallbackDocumentAnalysis(documentText) {
  const textLower = documentText.toLowerCase()
  
  const isZUS = textLower.includes('zus') || textLower.includes('składk') || textLower.includes('ubezpiecz')
  const isTax = textLower.includes('pit') || textLower.includes('podatk') || textLower.includes('urząd skarbowy') || textLower.includes('skarbowy')
  const isResidency = textLower.includes('pobyt') || textLower.includes('karta') || textLower.includes('cudzoziemiec') || textLower.includes('wojewod')
  const isCity = textLower.includes('urząd miasta') || textLower.includes('urząd gminy') || textLower.includes('meldunek') || textLower.includes('zameldowanie')

  let docType = 'Government Document'
  let polishName = 'Dokument urzędowy'
  let urgency = 'FOR YOUR RECORDS'
  let summary = ''
  let whatItMeans = ''
  let actionRequired = ''

  if (isZUS) {
    docType = 'ZUS Social Security Document'
    polishName = 'Dokument ZUS (Zakład Ubezpieczeń Społecznych)'
    summary = 'This is from ZUS - the Polish Social Security office. They handle health insurance, pension, and disability contributions.'
    whatItMeans = 'ZUS documents usually relate to your social security contributions (składki). If you work legally in Poland, your employer pays ZUS contributions for you. Self-employed (B2B) must pay their own contributions.'
    actionRequired = 'Check if this is informational or requires action. Look for words like "należność" (amount due) or "termin" (deadline).'
  } else if (isTax) {
    docType = 'Tax Office Notice'
    polishName = 'Pismo z Urzędu Skarbowego'
    urgency = 'ACTION NEEDED'
    summary = 'This is from the Polish Tax Office (Urząd Skarbowy). It may relate to income tax (PIT), VAT, or other tax matters.'
    whatItMeans = 'Tax office letters often require a response. They may be asking for documents, notifying you of a tax assessment, or requesting payment.'
    actionRequired = 'Look for deadlines (termin) and amounts (kwota, należność). Tax deadlines are strict - missing them results in penalties.'
  } else if (isResidency) {
    docType = 'Residency/Immigration Document'
    polishName = 'Dokument pobytowy (Urząd Wojewódzki)'
    urgency = 'ACTION NEEDED'
    summary = 'This relates to your residency status in Poland - from the Voivodeship Office (Urząd Wojewódzki) which handles residence permits.'
    whatItMeans = 'This could be about your residence card (karta pobytu), visa, or temporary residence permit (zezwolenie na pobyt czasowy). These are critical for your legal stay.'
    actionRequired = 'Read carefully for deadlines. Residency matters are time-sensitive. Look for "decyzja" (decision), "wezwanie" (summons), or "brakujące dokumenty" (missing documents).'
  } else if (isCity) {
    docType = 'City/Municipal Office Document'
    polishName = 'Dokument z Urzędu Miasta/Gminy'
    summary = 'This is from your local city or municipal office. They handle registration (zameldowanie), civil matters, and local administration.'
    whatItMeans = 'City office documents may relate to your registration (meldunek), local taxes, or administrative matters.'
    actionRequired = 'Check if you need to visit the office (stawić się) or provide documents (dostarczyć dokumenty).'
  } else {
    summary = 'This appears to be an official Polish document. For accurate understanding, consider professional translation.'
    whatItMeans = 'Without more context, we recommend having someone who reads Polish review this, or using our certified translation service.'
    actionRequired = 'Look for dates, amounts in PLN, and official stamps or signatures.'
  }

  return {
    documentType: docType,
    polishName: polishName,
    urgency: urgency,
    summary: summary,
    whatItMeans: whatItMeans,
    actionRequired: actionRequired,
    deadline: null,
    keyInformation: [],
    polishTerms: [
      { term: "Decyzja", translation: "Decision", explanation: "Official ruling - pay attention to this" },
      { term: "Termin", translation: "Deadline", explanation: "Date by which you must act" },
      { term: "Należność", translation: "Amount due", explanation: "Money you need to pay" },
      { term: "Wezwanie", translation: "Summons/Request", explanation: "You're being asked to do something" },
      { term: "Odwołanie", translation: "Appeal", explanation: "You can contest this decision" },
      { term: "Pouczenie", translation: "Legal instruction", explanation: "Explains your rights and options" }
    ],
    nextSteps: [
      "Look for any dates (daty) - these are likely deadlines",
      "Check for amounts in PLN - this may indicate payment required",
      "Find the 'pouczenie' section - it explains your rights",
      "If unsure, visit the issuing office with the document"
    ],
    relatedGuides: isZUS ? ["ZUS Registration", "Health Insurance"] : 
                   isTax ? ["Tax Guide", "PIT Filing"] : 
                   isResidency ? ["Residency Permit", "Karta Pobytu"] : 
                   ["PESEL", "Zameldowanie"]
  }
}

export async function analyzeContract(contractText) {
  const systemPrompt = `You are an expert Polish rental law attorney helping expats understand rental contracts (umowa najmu) in Poland.

YOUR LEGAL KNOWLEDGE BASE - POLISH RENTAL LAW:

1. KODEKS CYWILNY (Civil Code):
   - Art. 659-692: General rental provisions
   - Art. 662: Landlord responsible for major repairs (heating, plumbing, electrical, structural)
   - Art. 664: Tenant can demand rent reduction if apartment has defects
   - Art. 668: Subletting requires landlord consent
   - Art. 673: Fixed-term contracts end automatically; indefinite need notice
   - Art. 688: Minimum notice period for indefinite contracts is 3 months

2. USTAWA O OCHRONIE PRAW LOKATORÓW (Tenant Protection Act):
   - Art. 6: Deposit cannot exceed 12x monthly rent
   - Art. 6a: Deposit must be returned within 30 days of move-out
   - Art. 8a: Rent increases require written justification and notice
   - Art. 10: Landlord cannot enter without tenant consent (except emergencies)
   - Art. 11: Lists ONLY legal grounds for eviction/termination

3. KEY TENANT RIGHTS IN POLAND:
   - Right to zameldowanie (registration) - landlord cannot refuse
   - Right to peaceful enjoyment of the property
   - Right to receive receipts for rent payments
   - Protection from arbitrary eviction
   - Right to proper notice periods

4. COMMON ILLEGAL CLAUSES (unenforceable in Polish courts):
   - Landlord entry without notice/consent
   - Notice periods shorter than legal minimum
   - Tenant responsible for ALL repairs
   - Prohibition of zameldowanie
   - Automatic rent increases without notice
   - Penalties for normal wear and tear

YOUR TASK:
1. Identify RED FLAGS - clauses that VIOLATE Polish law (cite specific articles)
2. Identify WARNINGS - unusual but legal clauses that need attention
3. Identify GOOD CLAUSES - tenant-friendly terms
4. Provide safety score (0-100) based on Polish law compliance
5. Give verdict: SAFE TO SIGN, REVIEW CAREFULLY, or DO NOT SIGN
6. Suggest questions to ask in Polish and English

Be specific. Quote the actual clause. Cite Polish law articles. Explain in plain English.

IMPORTANT: Respond ONLY with valid JSON, no other text. Format:
{
  "score": 72,
  "verdict": "REVIEW CAREFULLY",
  "summary": "Brief 2-sentence summary mentioning Polish law compliance",
  "redFlags": [
    {"clause": "quoted text", "issue": "explanation with Polish law reference", "recommendation": "what to do", "polishLaw": "Article reference"}
  ],
  "warnings": [
    {"clause": "quoted text", "issue": "explanation", "recommendation": "what to do", "polishLaw": "Article reference if applicable"}
  ],
  "goodClauses": [
    {"clause": "quoted text or description", "why": "explanation"}
  ],
  "questions": ["Question in English (Polish translation)", "Question 2"],
  "disclaimer": "Standard legal disclaimer"
}`

  try {
    const content = await callGroqAPI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Please analyze this Polish rental contract under Polish law:\n\n${contractText}` }
    ], 0.3, 2500)

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0])
        // Ensure disclaimer is always present
        if (!result.disclaimer) {
          result.disclaimer = "This analysis is based on Polish rental law including Kodeks Cywilny and Ustawa o ochronie praw lokatorów. For legally binding advice, consult a licensed Polish lawyer (radca prawny or adwokat)."
        }
        return result
      }
      throw new Error('No JSON found in response')
    } catch (parseError) {
      console.error('Failed to parse Groq response:', parseError)
      return getFallbackContractAnalysis(contractText)
    }
  } catch (error) {
    console.error('Groq API error, using fallback:', error)
    return getFallbackContractAnalysis(contractText)
  }
}

export async function analyzeDocument(documentText) {
  const systemPrompt = `You are a helpful Polish government document expert assisting expats who receive confusing official letters in Polish.

YOUR KNOWLEDGE OF POLISH GOVERNMENT DOCUMENTS:

1. ZUS (Zakład Ubezpieczeń Społecznych) - Social Security:
   - Handles health insurance (NFZ), pension, disability
   - Common documents: RMUA (contribution statement), ZUS ZUA (registration), payment demands

2. URZĄD SKARBOWY - Tax Office:
   - Handles PIT (income tax), VAT, CIT
   - Common documents: Tax assessments, PIT-11 (from employer), payment requests, audit notices

3. URZĄD WOJEWÓDZKI - Voivodeship Office:
   - Handles residence permits, work permits for foreigners
   - Common documents: Karta pobytu decisions, summons (wezwanie), document requests

4. URZĄD MIASTA/GMINY - City/Municipal Office:
   - Handles zameldowanie (registration), local taxes, civil registry
   - Common documents: Registration confirmations, local tax notices

5. KEY POLISH TERMS:
   - Decyzja = Decision (official ruling)
   - Wezwanie = Summons (you must respond)
   - Zawiadomienie = Notification (FYI)
   - Pouczenie = Legal instruction (your rights)
   - Termin = Deadline
   - Należność = Amount due
   - Odwołanie = Appeal
   - Wniosek = Application

YOUR TASK:
1. Identify document type and issuing authority
2. Explain what it means in simple English
3. Identify urgency level and any deadlines
4. Translate key Polish terms
5. Give clear next steps

Be friendly and reassuring. Expats are often stressed by official Polish documents.

IMPORTANT: Respond ONLY with valid JSON, no other text. Format:
{
  "documentType": "Document type in English",
  "polishName": "Polish name with issuing authority",
  "urgency": "FOR YOUR RECORDS | ACTION NEEDED | URGENT",
  "summary": "2-3 sentence plain English explanation",
  "whatItMeans": "Detailed explanation",
  "actionRequired": "What to do, if anything",
  "deadline": "Any deadline mentioned, or null",
  "keyInformation": [
    {"label": "Reference Number", "value": "ABC123"}
  ],
  "polishTerms": [
    {"term": "Polish word", "translation": "English", "explanation": "Context"}
  ],
  "nextSteps": ["Step 1", "Step 2"],
  "relatedGuides": ["PESEL", "ZUS Registration"]
}`

  try {
    const content = await callGroqAPI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Please analyze this Polish government document and explain it in English:\n\n${documentText}` }
    ], 0.3, 2000)

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      throw new Error('No JSON found in response')
    } catch (parseError) {
      console.error('Failed to parse Groq response:', parseError)
      return getFallbackDocumentAnalysis(documentText)
    }
  } catch (error) {
    console.error('Groq API error, using fallback:', error)
    return getFallbackDocumentAnalysis(documentText)
  }
}

export async function generateBanter(tribe, club, quizScore, totalQuestions) {
  const systemPrompt = `You are a witty, sarcastic friend who loves banter about sports and fandoms. You're helping onboard new users to Expat Village, a community for expats in Poland.

The user just completed a quiz about their favorite ${tribe} (${club}).
They scored ${quizScore}/${totalQuestions}.

Generate fun, playful banter based on their score:
- 100%: They're a true fan, praise them but keep it cheeky
- 60-80%: Decent fan, tease them a bit
- Below 60%: Roast them gently (they might be a bandwagon fan 😂)

Include:
- A joke or reference specific to their club/team
- A welcome message to Expat Village
- Mention they're now part of the expat community in Poland

Keep it SHORT (3-4 sentences max). Be funny but not mean. Use emojis sparingly.

IMPORTANT: Respond ONLY with valid JSON:
{
  "banter": "Your witty response here",
  "badge": "Badge name like 'True Red Devil' or 'Bandwagon Fan'",
  "townHallSuggestion": "Suggestion to find their tribe in Town Hall"
}`

  try {
    const content = await callGroqAPI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Generate banter for a ${club} fan who scored ${quizScore}/${totalQuestions}` }
    ], 0.8, 500)

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      throw new Error('No JSON found in response')
    } catch (parseError) {
      return {
        banter: `Welcome to Expat Village, ${club} fan! Your quiz score of ${quizScore}/${totalQuestions} was... interesting. 😏 Ready to find your people in Poland?`,
        badge: `${club} Supporter`,
        townHallSuggestion: `Head to Town Hall to find your fellow ${club} fans in Poland!`
      }
    }
  } catch (error) {
    console.error('Groq API error:', error)
    return {
      banter: `Welcome to Expat Village! We're happy you're here, ${club} fan! 🎉 Poland awaits!`,
      badge: `${club} Fan`,
      townHallSuggestion: `Check out Town Hall to meet other expats in Poland!`
    }
  }
}

export default {
  analyzeContract,
  analyzeDocument,
  generateBanter
}
