export type JourneyLevel = 'Newcomer' | 'Settler' | 'Local' | 'Warsaw Native';

export interface UserProfile {
  name: string;
  mood?: string;
  level: JourneyLevel;
  points: number;
  streak: number;
  completedTasks: number;
  totalTasks: number;
  district?: string;
  interests?: string[];
  university?: string;
}

export interface MilestoneForecast {
  level: JourneyLevel;
  etaDays: number;
  confidence: number;
  blockers: string[];
  nextActions: Array<{
    title: string;
    points: number;
    etaDays: number;
    impact: 'high' | 'medium' | 'low';
  }>;
}

export interface DNAMatch {
  id: string;
  name: string;
  avatar: string;
  compatibility: number;
  district: string;
  interests: string[];
  reason: string;
}

export interface DecisionOption {
  id: string;
  label: string;
  score: number;
  benefits: string[];
  risks: string[];
}

export interface DecisionAdvice {
  scenario: string;
  recommendation: string;
  confidence: number;
  options: DecisionOption[];
}

export interface PolishCoachScenario {
  id: string;
  title: string;
  context: string;
  phrase: string;
  transliteration: string;
  english: string;
  tips: string[];
}

export interface LuckSignal {
  id: string;
  label: string;
  value: number;
  direction: 'up' | 'down' | 'stable';
  weight: number;
}

export interface LuckScore {
  score: number;
  tier: 'Low' | 'Medium' | 'High';
  summary: string;
  signals: LuckSignal[];
}

export interface ShadowSuggestion {
  id: string;
  title: string;
  detail: string;
  points: number;
  automationReady: boolean;
}

export interface StudentInsight {
  id: string;
  title: string;
  value: string;
  description: string;
  confidence: number;
}

