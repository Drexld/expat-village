export interface FreshnessMeta {
  source: string;
  updatedAt: string;
  ttlSeconds: number;
}

export interface ApiEnvelope<T> {
  data: T;
  freshness?: FreshnessMeta;
}

export interface HomePulse {
  weather: {
    temperatureC: number;
    condition: string;
    feelsLikeC?: number;
  };
  exchange: {
    base: string;
    quote: string;
    rate: number;
    change24h: number;
  };
  highlights: Array<{
    id: string;
    kind: 'immigration' | 'transport' | 'legal' | 'parliament' | 'city';
    title: string;
    summary: string;
    severity: 'low' | 'medium' | 'high';
    publishedAt: string;
  }>;
}

export interface HomeWarsawDailyChallenge {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  pointsReward: number;
  rewardLabel?: string;
}

export interface HomeWarsawDailyLeaderboardEntry {
  rank: number;
  userId?: string;
  name: string;
  avatar: string;
  points: number;
  streak: number;
}

export interface HomeCommunityPreview {
  id: string;
  authorAvatar: string;
  title: string;
  timestamp: string;
  isNew: boolean;
  replies: number;
}

export interface HomeCommunityTopic {
  id: string;
  label: string;
  count: number;
  trend: number;
  icon: 'fire' | 'pin' | 'briefcase' | 'bank' | 'house' | 'file';
}

export interface HomeQuickAction {
  id: string;
  label: string;
  subtitle: string;
  icon: 'calendar' | 'users' | 'message' | 'zap';
  accent: 'blue' | 'pink' | 'green' | 'amber';
  priority: number;
}

export interface HomeSupportPayload {
  warsawDaily: {
    weatherChallenge: HomeWarsawDailyChallenge;
    wisdomChallenge: HomeWarsawDailyChallenge;
    leaderboard: HomeWarsawDailyLeaderboardEntry[];
  };
  community: {
    townHall: {
      activeCount: number;
      viewingCount: number;
      previews: HomeCommunityPreview[];
    };
    hotTopics: HomeCommunityTopic[];
  };
  quickActions: HomeQuickAction[];
}

export interface GuideSummary {
  id: string;
  title: string;
  category: string;
  views: number;
  upvotes: number;
  updatedAt: string;
  trending: boolean;
  realTimeData?: string;
}

export interface ServiceReviewInput {
  rating: number;
  title?: string;
  body: string;
  tags?: string[];
}

export interface ServiceReview {
  id: string;
  serviceId: string;
  userId: string;
  rating: number;
  title?: string;
  body: string;
  tags: string[];
  createdAt: string;
}

export interface ReviewPromptSummary {
  id: string;
  serviceId: string;
  serviceName: string;
  dueAt: string | null;
  createdAt: string;
}

export interface BriefingCard {
  id: string;
  title: string;
  body: string;
  kind: 'weather' | 'transit' | 'city' | 'tip' | 'legal';
  severity?: 'low' | 'medium' | 'high';
}

export interface DailyBriefing {
  date: string;
  city: string;
  title: string;
  cards: BriefingCard[];
  source: string;
  updatedAt: string;
}

export interface ChecklistTask {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  urgency: 'normal' | 'urgent';
  points: number;
  status: 'todo' | 'in_progress' | 'done';
}

export interface ChecklistTasksResponse {
  total: number;
  completed: number;
  categories: Array<{ id: string; name: string; slug: string }>;
  tasks: ChecklistTask[];
}

export interface TaskStatusUpdateInput {
  status: 'todo' | 'in_progress' | 'done';
}

export interface ServiceSummary {
  id: string;
  name: string;
  category: string;
  district?: string;
  verified: boolean;
  expatScore?: number;
}

export type MarketplaceListingCondition = 'New' | 'Like New' | 'Good' | 'Fair';

export interface MarketplaceSellerSummary {
  name: string;
  trustScore: number;
  reviews: number;
  verified: boolean;
}

export interface MarketplaceListingSummary {
  id: string;
  title: string;
  price: number;
  category: string;
  condition: MarketplaceListingCondition;
  seller: MarketplaceSellerSummary;
  distance: string;
  postedAt: string;
  images: number;
  description: string;
  hasAR?: boolean;
  escrowAvailable: boolean;
  featured?: boolean;
  aiScamScore: number;
  aiScamSource: string;
  aiScamConfidence: number;
}

export interface MarketplaceCreateListingInput {
  title: string;
  price: number;
  category: string;
  description: string;
  escrowRequested?: boolean;
}

export interface MarketplaceInterestInput {
  mode: 'secure_buy' | 'message_seller';
}

export interface MarketplaceReviewInput {
  rating: number;
  body: string;
}

export interface MarketplaceReview {
  id: string;
  listingId: string;
  userId: string;
  rating: number;
  body: string;
  createdAt: string;
}

export interface StudentUniversitySummary {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  activeStudents: number;
  totalMembers: number;
  recentTopics: string[];
  location: string;
  verified: boolean;
}

export interface StudentEventSummary {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attending: number;
  category: string;
  rsvp?: boolean;
}

export interface RoommateProfileSummary {
  id: string;
  name: string;
  university: string;
  country: string;
  lookingFor: string;
  budget?: string;
  interests: string[];
  avatar: string;
  verified: boolean;
}

export interface StudentDiscountSummary {
  id: string;
  name: string;
  discount: string;
  category: string;
  distance: string;
  validUntil: string;
}

export interface StudentGroupSummary {
  id: string;
  name: string;
  members: number;
  category: string;
  active: boolean;
}

export interface StudentUniversityCreateInput {
  name: string;
  shortName: string;
  location: string;
  website?: string;
  reason?: string;
}

export interface StudentRoommateSwipeInput {
  profileId: string;
  direction: 'left' | 'right';
}

export type PollType = 'song' | 'series';

export interface PollOptionSummary {
  id: string;
  title: string;
  artist?: string;
  year?: string;
  votes: number;
  preview?: string;
}

export interface PollSummary {
  id: string;
  type: PollType;
  period: 'daily' | 'monthly';
  question: string;
  options: PollOptionSummary[];
  totalVotes: number;
  endsAt: string;
}

export interface PollVoteInput {
  optionId: string;
}

export interface FlavorDaySummary {
  id: string;
  cuisine: string;
  emoji: string;
  dateLabel: string;
  vibe: string;
  funFact: string;
}

export interface FlavorRestaurantSummary {
  id: string;
  name: string;
  district: string;
  cuisine: string;
  rating: number;
  expatScore: number;
  discount: string;
  verified: boolean;
  distanceKm: number;
  photo: string;
}

export interface FlavorActivitySummary {
  id: string;
  user: string;
  avatar: string;
  action: string;
  points: number;
  timestamp: string;
}

export interface FlavorChallengeSummary {
  id: string;
  title: string;
  description: string;
  rewardPoints: number;
  progress: number;
  total: number;
}

export interface FlavorLeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  points: number;
  badges: number;
}

export interface FlavorDayBundle {
  day: FlavorDaySummary | null;
  restaurants: FlavorRestaurantSummary[];
  activity: FlavorActivitySummary[];
  challenges: FlavorChallengeSummary[];
  leaderboard: FlavorLeaderboardEntry[];
}

export interface FlavorCheckinInput {
  restaurantId: string;
}

export interface FlavorCheckinResult {
  checkinId: string;
  rewardPoints: number;
  createdAt: string;
}

export interface MeProfile {
  id: string;
  displayName: string;
  level: string;
  points: number;
  streak: number;
  bio?: string;
  tribe?: string;
  interest?: string;
  onboardingCompleted?: boolean;
}

export interface MePreferences {
  mood?: string;
  language: string;
  notificationsEnabled: boolean;
  morningBriefingSeenDate?: string;
  moodCheckSeenDate?: string;
}

export interface MeJourneyEvent {
  id?: string;
  date: string;
  event: string;
  icon: string;
  completed: boolean;
}

export interface MeBadgeProgress {
  id: string;
  name: string;
  emoji: string;
  category: string;
  unlocked: boolean;
  progress: number;
}

export interface MeConnectionSummary {
  name: string;
  status: 'Online' | 'Offline';
  avatar: string;
  country: string;
  sharedTasks: number;
}

export interface MeInsights {
  aheadOfAverage: number;
  activityBreakdown: { checklist: number; community: number; vibes: number };
  forecast: { daysToSettled: number; confidence: number };
  streakCalendar: boolean[];
}

export interface MeMilestoneSubtask {
  id: string | number;
  name: string;
  done: boolean;
  points: number;
}

export interface MeMilestone {
  name: string;
  reward: number;
  subtasks: MeMilestoneSubtask[];
  location?: { lat: number; lng: number };
}

export interface MeProgress {
  level: string;
  points: number;
  completedTasks: number;
  totalTasks?: number;
  streak?: number;
  weekLabel?: string;
  currentMilestone?: MeMilestone;
  journey?: MeJourneyEvent[];
  badges?: MeBadgeProgress[];
  connections?: MeConnectionSummary[];
  insights?: MeInsights;
}

export interface CommunityPostSummary {
  id: string;
  authorName: string;
  title: string;
  preview: string;
  likes: number;
  replies: number;
  createdAt: string;
}

export interface CommunityCreatePostInput {
  title: string;
  body: string;
  topicId?: string;
  hasVoice?: boolean;
}

export interface CommunityCreateCommentInput {
  body: string;
}

export interface CommunityReactInput {
  reaction: string;
}

export interface ContractAnalysisInput {
  documentName: string;
  documentText?: string;
  documentUrl?: string;
}

export interface ContractAnalysisResult {
  id: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  summary: string;
  redFlags: string[];
  legalFramework: 'PL';
}

export interface DocumentAnalysisInput {
  documentName: string;
  documentText?: string;
  documentUrl?: string;
}

export interface DocumentAnalysisResult {
  id: string;
  documentType: string;
  urgency: 'low' | 'medium' | 'high';
  keyPoints: string[];
  nextSteps: Array<{ title: string; priority: 'low' | 'medium' | 'high' }>;
}

export interface LawyerReviewRequestInput {
  contractAnalysisId?: string;
  contactEmail?: string;
  contactPhone?: string;
  notes?: string;
}

export interface LawyerReviewRequestResult {
  id: string;
  status: 'requested' | 'triaged' | 'assigned' | 'completed';
  createdAt: string;
}

export type AIHubJourneyImpact = 'high' | 'medium' | 'low';

export interface AIHubForecastAction {
  title: string;
  points: number;
  etaDays: number;
  impact: AIHubJourneyImpact;
}

export interface AIHubMilestoneForecast {
  level: 'Newcomer' | 'Settler' | 'Local' | 'Warsaw Native';
  etaDays: number;
  confidence: number;
  blockers: string[];
  nextActions: AIHubForecastAction[];
}

export interface AIHubDNAMatch {
  id: string;
  name: string;
  avatar: string;
  compatibility: number;
  district: string;
  interests: string[];
  reason: string;
}

export interface AIHubDecisionOption {
  id: string;
  label: string;
  score: number;
  benefits: string[];
  risks: string[];
}

export interface AIHubDecisionAdvice {
  scenario: string;
  recommendation: string;
  confidence: number;
  options: AIHubDecisionOption[];
}

export interface AIHubCoachScenario {
  id: string;
  title: string;
  context: string;
  phrase: string;
  transliteration: string;
  english: string;
  tips: string[];
}

export interface AIHubLuckSignal {
  id: string;
  label: string;
  value: number;
  direction: 'up' | 'down' | 'stable';
  weight: number;
}

export interface AIHubLuckScore {
  score: number;
  tier: 'Low' | 'Medium' | 'High';
  summary: string;
  signals: AIHubLuckSignal[];
}

export interface AIHubShadowSuggestion {
  id: string;
  title: string;
  detail: string;
  points: number;
  automationReady: boolean;
}

export interface AIHubStudentInsight {
  id: string;
  title: string;
  value: string;
  description: string;
  confidence: number;
}

export interface AIHubMeta {
  source: string;
  updatedAt: string;
  ttlSeconds: number;
  personalized: boolean;
}

export interface AIHubBundle {
  forecast: AIHubMilestoneForecast;
  matches: AIHubDNAMatch[];
  advice: AIHubDecisionAdvice;
  coachScenarios: AIHubCoachScenario[];
  luck: AIHubLuckScore;
  shadow: AIHubShadowSuggestion[];
  student: AIHubStudentInsight[];
  meta: AIHubMeta;
}

export interface AIHubAdvisorInput {
  scenario: string;
}
