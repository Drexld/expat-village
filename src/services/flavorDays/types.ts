export interface CuisineDay {
  id: string;
  cuisine: string;
  emoji: string;
  dateLabel: string;
  vibe: string;
  funFact: string;
}

export interface FlavorRestaurant {
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

export interface FlavorActivity {
  id: string;
  user: string;
  avatar: string;
  action: string;
  points: number;
  timestamp: string;
}

export interface FlavorChallenge {
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

