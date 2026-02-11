import type {
  DecisionAdvice,
  DNAMatch,
  LuckScore,
  LuckSignal,
  MilestoneForecast,
  PolishCoachScenario,
  ShadowSuggestion,
  StudentInsight,
  UserProfile,
} from './types';

const baseActions = [
  { title: 'Register PESEL number', points: 15, etaDays: 2, impact: 'high' as const },
  { title: 'Open bank account', points: 20, etaDays: 3, impact: 'high' as const },
  { title: 'Validate ZTM transport card', points: 10, etaDays: 1, impact: 'medium' as const },
  { title: 'Complete NFZ setup', points: 20, etaDays: 4, impact: 'high' as const },
  { title: 'Join neighborhood community', points: 10, etaDays: 1, impact: 'low' as const },
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function forecastJourney(profile: UserProfile): MilestoneForecast {
  const progress = profile.totalTasks > 0 ? profile.completedTasks / profile.totalTasks : 0;
  const velocity = clamp((profile.streak + 1) / 8, 0.5, 2);
  const etaDays = Math.max(2, Math.round((1 - progress) * 24 / velocity));
  const confidence = clamp(55 + profile.streak * 3 + Math.round(progress * 25), 52, 97);

  const blockers: string[] = [];
  if (profile.completedTasks < 10) blockers.push('Legal setup is incomplete');
  if (profile.streak < 3) blockers.push('Low routine consistency');
  if (!profile.district) blockers.push('District preferences are not configured');

  const level =
    profile.completedTasks >= 31
      ? 'Warsaw Native'
      : profile.completedTasks >= 21
      ? 'Local'
      : profile.completedTasks >= 11
      ? 'Settler'
      : 'Newcomer';

  return {
    level,
    etaDays,
    confidence,
    blockers,
    nextActions: baseActions.slice(0, 3),
  };
}

export function getDNAMatches(profile: UserProfile): DNAMatch[] {
  const district = profile.district ?? 'Mokotow';
  const tags = profile.interests ?? ['coffee', 'city walks', 'networking'];

  return [
    {
      id: 'dna-1',
      name: 'Sofia M.',
      avatar: 'S',
      compatibility: 92,
      district,
      interests: [tags[0], 'language exchange', 'weekend markets'],
      reason: 'High overlap in routine and social pace',
    },
    {
      id: 'dna-2',
      name: 'Luca R.',
      avatar: 'L',
      compatibility: 87,
      district: 'Srodmiescie',
      interests: ['tech meetups', tags[1] ?? 'photography', 'cycling'],
      reason: 'Strong compatibility for relocation stage and interests',
    },
    {
      id: 'dna-3',
      name: 'Priya K.',
      avatar: 'P',
      compatibility: 83,
      district: 'Praga',
      interests: [tags[2] ?? 'food', 'study groups', 'museum nights'],
      reason: 'Balanced match for practical support and social exploration',
    },
  ];
}

export function getDecisionAdvice(scenario: string): DecisionAdvice {
  return {
    scenario,
    recommendation: 'Choose the option with lower legal risk and stronger cash-flow stability.',
    confidence: 84,
    options: [
      {
        id: 'opt-a',
        label: 'Sign now with minor edits',
        score: 76,
        benefits: ['Faster move-in timeline', 'Price locked this week'],
        risks: ['Deposit terms still broad', 'Termination clause needs tightening'],
      },
      {
        id: 'opt-b',
        label: 'Negotiate and sign in 3 days',
        score: 88,
        benefits: ['Better legal clarity', 'Lower long-term risk'],
        risks: ['Short delay', 'Possible price adjustment'],
      },
      {
        id: 'opt-c',
        label: 'Walk away and search alternatives',
        score: 69,
        benefits: ['Avoid uncertain landlord profile', 'More market comparison'],
        risks: ['Opportunity cost', 'Higher temporary housing expense'],
      },
    ],
  };
}

export function getPolishCoachScenarios(): PolishCoachScenario[] {
  return [
    {
      id: 'pol-1',
      title: 'Urzad appointment check-in',
      context: 'You arrived for PESEL registration',
      phrase: 'Dzien dobry, mam umowiona wizyte.',
      transliteration: 'jen doh-bri, mam oo-moh-vyo-nah vee-zih-teh',
      english: 'Good morning, I have an appointment.',
      tips: ['Speak slowly', 'Show passport when asked', 'Use polite form Pan/Pani'],
    },
    {
      id: 'pol-2',
      title: 'Cafe order',
      context: 'You want to order and ask for oat milk',
      phrase: 'Poprosze latte z mlekiem owsianym.',
      transliteration: 'poh-proh-sheh la-teh z mleh-kyem ov-sha-nim',
      english: 'One latte with oat milk, please.',
      tips: ['Use Poprosze for polite requests', 'Keep sentence short', 'Smile and repeat if needed'],
    },
    {
      id: 'pol-3',
      title: 'Apartment viewing',
      context: 'You want to ask about bills',
      phrase: 'Czy czynsz zawiera oplaty za media?',
      transliteration: 'chi chinsh zah-vye-rah oh-pla-ti zah meh-dya',
      english: 'Does the rent include utility fees?',
      tips: ['Ask this before deposit', 'Request written confirmation', 'Confirm winter heating cost'],
    },
  ];
}

export function getLuckScore(profile: UserProfile): LuckScore {
  const signals: LuckSignal[] = [
    { id: 'rate', label: 'Exchange rate trend', value: 72, direction: 'up', weight: 0.25 },
    { id: 'market', label: 'Rental market timing', value: 61, direction: 'stable', weight: 0.25 },
    { id: 'admin', label: 'Admin appointment availability', value: 78, direction: 'up', weight: 0.2 },
    { id: 'network', label: 'Community support density', value: 74, direction: 'up', weight: 0.15 },
    { id: 'momentum', label: 'Your personal momentum', value: clamp(45 + profile.streak * 6, 35, 95), direction: 'up', weight: 0.15 },
  ];

  const score = Math.round(
    signals.reduce((sum, signal) => sum + signal.value * signal.weight, 0),
  );

  const tier = score >= 76 ? 'High' : score >= 55 ? 'Medium' : 'Low';
  const summary =
    tier === 'High'
      ? 'Good timing for high-impact tasks this week.'
      : tier === 'Medium'
      ? 'Balanced conditions. Prioritize legal and finance tasks first.'
      : 'Wait for stronger signals or reduce risk before committing.';

  return { score, tier, summary, signals };
}

export function getShadowSuggestions(profile: UserProfile): ShadowSuggestion[] {
  return [
    {
      id: 'shadow-1',
      title: 'Auto-draft your next admin checklist',
      detail: 'Prepared from your pending legal tasks and local office hours.',
      points: 10,
      automationReady: true,
    },
    {
      id: 'shadow-2',
      title: 'Schedule best transfer window',
      detail: 'Tomorrow 09:00-11:00 shows strongest currency spread signal.',
      points: 8,
      automationReady: true,
    },
    {
      id: 'shadow-3',
      title: 'Suggest a district meetup',
      detail: `Found 3 active expat circles near ${profile.district ?? 'your area'}.`,
      points: 6,
      automationReady: false,
    },
  ];
}

export function getStudentInsights(profile: UserProfile): StudentInsight[] {
  const uni = profile.university ?? 'University of Warsaw';
  return [
    {
      id: 'student-1',
      title: 'Academic Predictor',
      value: '82% success likelihood',
      description: `${uni}: current pace suggests strong exam readiness if this streak continues.`,
      confidence: 81,
    },
    {
      id: 'student-2',
      title: 'Roommate Match Quality',
      value: '3 high-confidence matches',
      description: 'Best overlap found in budget range, routine, and study discipline.',
      confidence: 86,
    },
    {
      id: 'student-3',
      title: 'Budget Optimizer',
      value: 'Save 380 PLN/month',
      description: 'Lower food and transport spend through partner discounts and route bundles.',
      confidence: 79,
    },
  ];
}

