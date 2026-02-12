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

export interface MeProfile {
  id: string;
  displayName: string;
  level: string;
  points: number;
  streak: number;
  bio?: string;
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
