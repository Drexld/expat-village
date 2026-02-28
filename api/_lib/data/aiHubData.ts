import type {
  AIHubBundle,
  AIHubCoachScenario,
  AIHubDecisionAdvice,
  AIHubDNAMatch,
  AIHubLuckScore,
  AIHubLuckSignal,
  AIHubMilestoneForecast,
  AIHubShadowSuggestion,
  AIHubStudentInsight,
} from '../../../src/services/api/types';
import { supabaseSelect, supabaseUpsert } from './supabaseRest';

type JourneyLevel = 'Newcomer' | 'Settler' | 'Local' | 'Warsaw Native';

type HubModule =
  | 'forecast'
  | 'matches'
  | 'advice'
  | 'coach'
  | 'luck'
  | 'shadow'
  | 'student';

interface AIHubSnapshotRow {
  module: HubModule;
  snapshot: unknown;
  source: string;
  ttl_seconds: number;
  updated_at: string;
}

interface UserRow {
  id: string;
  display_name?: string | null;
  tribe?: string | null;
  interest?: string | null;
}

interface UserProfileRow {
  user_id: string;
  level?: string | null;
  points?: number | null;
  streak?: number | null;
  completed_tasks?: number | null;
  total_tasks?: number | null;
}

interface AIHubProfile {
  name: string;
  level: JourneyLevel;
  points: number;
  streak: number;
  completedTasks: number;
  totalTasks: number;
  district: string;
  interests: string[];
  university: string;
}

const HUB_SOURCE = 'expat-village-ai-hub';
const HUB_TTL_SECONDS = 1800;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeLevel(
  completedTasks: number,
  inputLevel?: string | null,
): JourneyLevel {
  if (inputLevel === 'Warsaw Native') return 'Warsaw Native';
  if (inputLevel === 'Local') return 'Local';
  if (inputLevel === 'Settler') return 'Settler';
  if (inputLevel === 'Newcomer') return 'Newcomer';
  if (completedTasks >= 31) return 'Warsaw Native';
  if (completedTasks >= 21) return 'Local';
  if (completedTasks >= 11) return 'Settler';
  return 'Newcomer';
}

function parseInterests(rawInterest?: string | null): string[] {
  if (!rawInterest) return ['coffee', 'fitness', 'city walks'];
  const parts = rawInterest
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length ? parts.slice(0, 4) : ['coffee', 'fitness', 'city walks'];
}

function dedupe<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

async function getProfile(userId?: string | null): Promise<AIHubProfile> {
  if (!userId) {
    return {
      name: 'Alex',
      level: 'Newcomer',
      points: 340,
      streak: 7,
      completedTasks: 8,
      totalTasks: 24,
      district: 'Mokotow',
      interests: ['coffee', 'fitness', 'city walks'],
      university: 'University of Warsaw',
    };
  }

  const [users, profiles] = await Promise.all([
    supabaseSelect<UserRow>('users', 'id,display_name,tribe,interest', {
      limit: 1,
      filters: [{ column: 'id', op: 'eq', value: userId }],
    }),
    supabaseSelect<UserProfileRow>(
      'user_profiles',
      'user_id,level,points,streak,completed_tasks,total_tasks',
      {
        limit: 1,
        filters: [{ column: 'user_id', op: 'eq', value: userId }],
      },
    ),
  ]);

  const user = users[0];
  const profile = profiles[0];
  const completedTasks = Number(profile?.completed_tasks || 8);
  const totalTasks = Number(profile?.total_tasks || 24);

  return {
    name: user?.display_name || 'Alex',
    level: normalizeLevel(completedTasks, profile?.level),
    points: Number(profile?.points || 340),
    streak: Number(profile?.streak || 7),
    completedTasks,
    totalTasks,
    district: user?.tribe || 'Mokotow',
    interests: parseInterests(user?.interest),
    university: 'University of Warsaw',
  };
}

function buildForecast(profile: AIHubProfile): AIHubMilestoneForecast {
  const progress =
    profile.totalTasks > 0 ? profile.completedTasks / profile.totalTasks : 0;
  const velocity = clamp((profile.streak + 1) / 8, 0.5, 2);
  const etaDays = Math.max(2, Math.round(((1 - progress) * 24) / velocity));
  const confidence = clamp(
    55 + profile.streak * 3 + Math.round(progress * 25),
    52,
    97,
  );
  const blockers: string[] = [];

  if (profile.completedTasks < 10) blockers.push('Legal setup is incomplete');
  if (profile.streak < 3) blockers.push('Low routine consistency');
  if (!profile.district) blockers.push('District preferences are not configured');

  return {
    level: profile.level,
    etaDays,
    confidence,
    blockers,
    nextActions: [
      { title: 'Register PESEL number', points: 15, etaDays: 2, impact: 'high' },
      { title: 'Open bank account', points: 20, etaDays: 3, impact: 'high' },
      {
        title: 'Validate ZTM transport card',
        points: 10,
        etaDays: 1,
        impact: 'medium',
      },
    ],
  };
}

function buildDNAMatches(profile: AIHubProfile): AIHubDNAMatch[] {
  const interests = profile.interests.length
    ? profile.interests
    : ['coffee', 'fitness', 'city walks'];

  return [
    {
      id: 'dna-1',
      name: 'Sofia M.',
      avatar: 'S',
      compatibility: 92,
      district: profile.district,
      interests: [interests[0], 'language exchange', 'weekend markets'],
      reason: 'High overlap in routine and social pace',
    },
    {
      id: 'dna-2',
      name: 'Luca R.',
      avatar: 'L',
      compatibility: 87,
      district: 'Srodmiescie',
      interests: [interests[1] || 'city walks', 'tech meetups', 'cycling'],
      reason: 'Strong compatibility for relocation stage and interests',
    },
    {
      id: 'dna-3',
      name: 'Priya K.',
      avatar: 'P',
      compatibility: 83,
      district: 'Praga',
      interests: [interests[2] || 'food', 'study groups', 'museum nights'],
      reason: 'Balanced match for practical support and social exploration',
    },
  ];
}

function buildDecisionAdvice(scenario: string): AIHubDecisionAdvice {
  const normalized = scenario.trim().toLowerCase();

  let recommendation =
    'Choose the option with lower legal risk and stronger cash-flow stability.';
  let optionBScore = 88;

  if (normalized.includes('contract') || normalized.includes('lease')) {
    recommendation =
      'Negotiate risky clauses first, then sign only after written confirmation under Polish law.';
    optionBScore = 91;
  }
  if (normalized.includes('roommate') || normalized.includes('flatmate')) {
    recommendation =
      'Prefer compatibility and verified references over short-term rent savings.';
    optionBScore = 86;
  }
  if (normalized.includes('job') || normalized.includes('offer')) {
    recommendation =
      'Optimize for legal certainty and long-term permit stability before accepting.';
    optionBScore = 84;
  }

  return {
    scenario: scenario.trim() || 'Should I decide now or wait for stronger terms?',
    recommendation,
    confidence: clamp(80 + Math.round(Math.random() * 8), 80, 92),
    options: [
      {
        id: 'opt-a',
        label: 'Sign now with minor edits',
        score: clamp(optionBScore - 12, 60, 95),
        benefits: ['Faster move-in timeline', 'Price locked this week'],
        risks: ['Deposit terms still broad', 'Termination clause needs tightening'],
      },
      {
        id: 'opt-b',
        label: 'Negotiate and sign in 3 days',
        score: optionBScore,
        benefits: ['Better legal clarity', 'Lower long-term risk'],
        risks: ['Short delay', 'Possible price adjustment'],
      },
      {
        id: 'opt-c',
        label: 'Walk away and search alternatives',
        score: clamp(optionBScore - 19, 55, 90),
        benefits: ['Avoid uncertain landlord profile', 'More market comparison'],
        risks: ['Opportunity cost', 'Higher temporary housing expense'],
      },
    ],
  };
}

function buildCoachScenarios(): AIHubCoachScenario[] {
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
      tips: [
        'Use Poprosze for polite requests',
        'Keep sentence short',
        'Smile and repeat if needed',
      ],
    },
    {
      id: 'pol-3',
      title: 'Apartment viewing',
      context: 'You want to ask about bills',
      phrase: 'Czy czynsz zawiera oplaty za media?',
      transliteration: 'chi chinsh zah-vye-rah oh-pla-ti zah meh-dya',
      english: 'Does the rent include utility fees?',
      tips: [
        'Ask this before deposit',
        'Request written confirmation',
        'Confirm winter heating cost',
      ],
    },
  ];
}

function buildLuck(profile: AIHubProfile): AIHubLuckScore {
  const signals: AIHubLuckSignal[] = [
    { id: 'rate', label: 'Exchange rate trend', value: 72, direction: 'up', weight: 0.25 },
    { id: 'market', label: 'Rental market timing', value: 61, direction: 'stable', weight: 0.25 },
    { id: 'admin', label: 'Admin appointment availability', value: 78, direction: 'up', weight: 0.2 },
    { id: 'network', label: 'Community support density', value: 74, direction: 'up', weight: 0.15 },
    {
      id: 'momentum',
      label: 'Your personal momentum',
      value: clamp(45 + profile.streak * 6, 35, 95),
      direction: 'up',
      weight: 0.15,
    },
  ];

  const score = Math.round(
    signals.reduce((sum, signal) => sum + signal.value * signal.weight, 0),
  );
  const tier = score >= 76 ? 'High' : score >= 55 ? 'Medium' : 'Low';

  return {
    score,
    tier,
    summary:
      tier === 'High'
        ? 'Good timing for high-impact tasks this week.'
        : tier === 'Medium'
          ? 'Balanced conditions. Prioritize legal and finance tasks first.'
          : 'Wait for stronger signals or reduce risk before committing.',
    signals,
  };
}

function buildShadow(profile: AIHubProfile): AIHubShadowSuggestion[] {
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
      detail: `Found 3 active expat circles near ${profile.district}.`,
      points: 6,
      automationReady: false,
    },
  ];
}

function buildStudent(profile: AIHubProfile): AIHubStudentInsight[] {
  return [
    {
      id: 'student-1',
      title: 'Academic Predictor',
      value: '82% success likelihood',
      description: `${profile.university}: current pace suggests strong exam readiness if this streak continues.`,
      confidence: 81,
    },
    {
      id: 'student-2',
      title: 'Roommate Match Quality',
      value: '3 high-confidence matches',
      description:
        'Best overlap found in budget range, routine, and study discipline.',
      confidence: 86,
    },
    {
      id: 'student-3',
      title: 'Budget Optimizer',
      value: 'Save 380 PLN/month',
      description:
        'Lower food and transport spend through partner discounts and route bundles.',
      confidence: 79,
    },
  ];
}

function maxIsoDate(values: string[]): string {
  const timestamps = values
    .map((value) => new Date(value).getTime())
    .filter((value) => Number.isFinite(value));
  if (!timestamps.length) return new Date().toISOString();
  return new Date(Math.max(...timestamps)).toISOString();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object');
}

function isCompleteSnapshotMap(
  map: Map<HubModule, AIHubSnapshotRow>,
): boolean {
  return (
    map.has('forecast') &&
    map.has('matches') &&
    map.has('advice') &&
    map.has('coach') &&
    map.has('luck') &&
    map.has('shadow') &&
    map.has('student')
  );
}

function parseSnapshotBundle(
  map: Map<HubModule, AIHubSnapshotRow>,
  personalized: boolean,
): AIHubBundle | null {
  if (!isCompleteSnapshotMap(map)) return null;

  const forecastRow = map.get('forecast')!;
  const matchesRow = map.get('matches')!;
  const adviceRow = map.get('advice')!;
  const coachRow = map.get('coach')!;
  const luckRow = map.get('luck')!;
  const shadowRow = map.get('shadow')!;
  const studentRow = map.get('student')!;

  if (
    !isRecord(forecastRow.snapshot) ||
    !Array.isArray(matchesRow.snapshot) ||
    !isRecord(adviceRow.snapshot) ||
    !Array.isArray(coachRow.snapshot) ||
    !isRecord(luckRow.snapshot) ||
    !Array.isArray(shadowRow.snapshot) ||
    !Array.isArray(studentRow.snapshot)
  ) {
    return null;
  }

  return {
    forecast: forecastRow.snapshot as unknown as AIHubMilestoneForecast,
    matches: matchesRow.snapshot as unknown as AIHubDNAMatch[],
    advice: adviceRow.snapshot as unknown as AIHubDecisionAdvice,
    coachScenarios: coachRow.snapshot as unknown as AIHubCoachScenario[],
    luck: luckRow.snapshot as unknown as AIHubLuckScore,
    shadow: shadowRow.snapshot as unknown as AIHubShadowSuggestion[],
    student: studentRow.snapshot as unknown as AIHubStudentInsight[],
    meta: {
      source: dedupe([
        forecastRow.source,
        matchesRow.source,
        adviceRow.source,
        coachRow.source,
        luckRow.source,
        shadowRow.source,
        studentRow.source,
      ]).join(','),
      updatedAt: maxIsoDate([
        forecastRow.updated_at,
        matchesRow.updated_at,
        adviceRow.updated_at,
        coachRow.updated_at,
        luckRow.updated_at,
        shadowRow.updated_at,
        studentRow.updated_at,
      ]),
      ttlSeconds: Math.min(
        forecastRow.ttl_seconds || HUB_TTL_SECONDS,
        matchesRow.ttl_seconds || HUB_TTL_SECONDS,
        adviceRow.ttl_seconds || HUB_TTL_SECONDS,
        coachRow.ttl_seconds || HUB_TTL_SECONDS,
        luckRow.ttl_seconds || HUB_TTL_SECONDS,
        shadowRow.ttl_seconds || HUB_TTL_SECONDS,
        studentRow.ttl_seconds || HUB_TTL_SECONDS,
      ),
      personalized,
    },
  };
}

async function persistHubBundle(
  userId: string,
  bundle: AIHubBundle,
): Promise<void> {
  await supabaseUpsert(
    'ai_hub_snapshots',
    [
      {
        user_id: userId,
        module: 'forecast',
        snapshot: bundle.forecast,
        confidence: bundle.forecast.confidence,
        source: HUB_SOURCE,
        ttl_seconds: HUB_TTL_SECONDS,
      },
      {
        user_id: userId,
        module: 'matches',
        snapshot: bundle.matches,
        confidence: Math.round(
          bundle.matches.reduce((sum, item) => sum + item.compatibility, 0) /
            Math.max(bundle.matches.length, 1),
        ),
        source: HUB_SOURCE,
        ttl_seconds: HUB_TTL_SECONDS,
      },
      {
        user_id: userId,
        module: 'advice',
        snapshot: bundle.advice,
        confidence: bundle.advice.confidence,
        source: HUB_SOURCE,
        ttl_seconds: HUB_TTL_SECONDS,
      },
      {
        user_id: userId,
        module: 'coach',
        snapshot: bundle.coachScenarios,
        confidence: 85,
        source: HUB_SOURCE,
        ttl_seconds: HUB_TTL_SECONDS,
      },
      {
        user_id: userId,
        module: 'luck',
        snapshot: bundle.luck,
        confidence: bundle.luck.score,
        source: HUB_SOURCE,
        ttl_seconds: HUB_TTL_SECONDS,
      },
      {
        user_id: userId,
        module: 'shadow',
        snapshot: bundle.shadow,
        confidence: 82,
        source: HUB_SOURCE,
        ttl_seconds: HUB_TTL_SECONDS,
      },
      {
        user_id: userId,
        module: 'student',
        snapshot: bundle.student,
        confidence: Math.round(
          bundle.student.reduce((sum, item) => sum + item.confidence, 0) /
            Math.max(bundle.student.length, 1),
        ),
        source: HUB_SOURCE,
        ttl_seconds: HUB_TTL_SECONDS,
      },
    ],
    { onConflict: 'user_id,module' },
  );
}

function buildBundle(profile: AIHubProfile, scenario: string): AIHubBundle {
  return {
    forecast: buildForecast(profile),
    matches: buildDNAMatches(profile),
    advice: buildDecisionAdvice(scenario),
    coachScenarios: buildCoachScenarios(),
    luck: buildLuck(profile),
    shadow: buildShadow(profile),
    student: buildStudent(profile),
    meta: {
      source: HUB_SOURCE,
      updatedAt: new Date().toISOString(),
      ttlSeconds: HUB_TTL_SECONDS,
      personalized: true,
    },
  };
}

export async function getAIHubBundleData(
  userId?: string | null,
): Promise<AIHubBundle> {
  const profile = await getProfile(userId);
  const personalized = Boolean(userId);

  if (userId) {
    const rows = await supabaseSelect<AIHubSnapshotRow>(
      'ai_hub_snapshots',
      'module,snapshot,source,ttl_seconds,updated_at',
      {
        limit: 20,
        orderBy: 'updated_at',
        ascending: false,
        filters: [{ column: 'user_id', op: 'eq', value: userId }],
      },
    );

    const map = new Map<HubModule, AIHubSnapshotRow>();
    rows.forEach((row) => {
      if (!map.has(row.module)) {
        map.set(row.module, row);
      }
    });

    const parsed = parseSnapshotBundle(map, personalized);
    if (parsed) return parsed;
  }

  const bundle = buildBundle(
    profile,
    'Should I sign this apartment contract now or negotiate first?',
  );
  bundle.meta.personalized = personalized;

  if (userId) {
    await persistHubBundle(userId, bundle);
  }

  return bundle;
}

export async function analyzeAIHubAdvisorData(
  scenario: string,
  userId?: string | null,
): Promise<AIHubDecisionAdvice> {
  const advice = buildDecisionAdvice(scenario);
  if (!userId) return advice;

  await supabaseUpsert(
    'ai_hub_snapshots',
    {
      user_id: userId,
      module: 'advice',
      snapshot: advice,
      confidence: advice.confidence,
      source: HUB_SOURCE,
      ttl_seconds: HUB_TTL_SECONDS,
    },
    { onConflict: 'user_id,module' },
  );

  return advice;
}

