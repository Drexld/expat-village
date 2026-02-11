import type {
  CuisineDay,
  FlavorActivity,
  FlavorChallenge,
  FlavorLeaderboardEntry,
  FlavorRestaurant,
} from './types';

const cuisineRotation = [
  { cuisine: 'Polish Comfort', emoji: '🥟', vibe: 'Warm, classic, and social' },
  { cuisine: 'Italian Street', emoji: '🍝', vibe: 'Fast, casual, and lively' },
  { cuisine: 'Japanese Bento', emoji: '🍱', vibe: 'Precise, calm, and fresh' },
  { cuisine: 'Mexican Fiesta', emoji: '🌮', vibe: 'Bold, colorful, energetic' },
  { cuisine: 'Korean Mix', emoji: '🍜', vibe: 'Modern, spicy, trendy' },
  { cuisine: 'Middle Eastern', emoji: '🥙', vibe: 'Shared plates and late chats' },
  { cuisine: 'Vegan Discovery', emoji: '🥗', vibe: 'Healthy, bright, experimental' },
];

export function getTodayCuisineDay(): CuisineDay {
  const now = new Date();
  const dayIndex = now.getDay() % cuisineRotation.length;
  const pick = cuisineRotation[dayIndex];
  const dateLabel = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return {
    id: `cuisine-${dayIndex}`,
    cuisine: pick.cuisine,
    emoji: pick.emoji,
    dateLabel,
    vibe: pick.vibe,
    funFact: 'Warsaw has over 40 expat-friendly cuisine clusters across districts.',
  };
}

export function getFlavorRestaurants(cuisine: string): FlavorRestaurant[] {
  const fallbackCuisine = cuisine || 'Polish Comfort';
  return [
    {
      id: 'rest-1',
      name: 'Karma Kitchen',
      district: 'Mokotow',
      cuisine: fallbackCuisine,
      rating: 4.8,
      expatScore: 9.2,
      discount: '15% off with Expat ID',
      verified: true,
      distanceKm: 1.2,
      photo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
    },
    {
      id: 'rest-2',
      name: 'Relaks Table',
      district: 'Srodmiescie',
      cuisine: fallbackCuisine,
      rating: 4.7,
      expatScore: 8.9,
      discount: 'Free drink after 18:00',
      verified: true,
      distanceKm: 2.1,
      photo: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&h=400&fit=crop',
    },
    {
      id: 'rest-3',
      name: 'Praga Plates',
      district: 'Praga',
      cuisine: fallbackCuisine,
      rating: 4.6,
      expatScore: 8.7,
      discount: '10% food passport bonus',
      verified: false,
      distanceKm: 3.4,
      photo: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=600&h=400&fit=crop',
    },
  ];
}

export function getFlavorCommunityActivity(): FlavorActivity[] {
  return [
    {
      id: 'act-1',
      user: 'Sarah M.',
      avatar: 'S',
      action: 'posted a Flavor Day photo in Town Hall',
      points: 12,
      timestamp: '4m ago',
    },
    {
      id: 'act-2',
      user: 'Luca R.',
      avatar: 'L',
      action: 'checked in at Karma Kitchen',
      points: 10,
      timestamp: '11m ago',
    },
    {
      id: 'act-3',
      user: 'Priya K.',
      avatar: 'P',
      action: 'completed the 3-stamp challenge',
      points: 25,
      timestamp: '26m ago',
    },
  ];
}

export function getFlavorChallenges(): FlavorChallenge[] {
  return [
    {
      id: 'ch-1',
      title: 'Taste Passport: 3 Stamps',
      description: 'Visit 3 verified restaurants this week.',
      rewardPoints: 40,
      progress: 2,
      total: 3,
    },
    {
      id: 'ch-2',
      title: 'Community Reviewer',
      description: 'Post 2 short reviews with practical expat tips.',
      rewardPoints: 25,
      progress: 1,
      total: 2,
    },
    {
      id: 'ch-3',
      title: 'Bring a Buddy',
      description: 'Join one dining group event and check in.',
      rewardPoints: 30,
      progress: 0,
      total: 1,
    },
  ];
}

export function getFlavorLeaderboard(): FlavorLeaderboardEntry[] {
  return [
    { id: 'lb-1', name: 'Maya T.', avatar: 'M', points: 560, badges: 9 },
    { id: 'lb-2', name: 'You', avatar: 'A', points: 492, badges: 7 },
    { id: 'lb-3', name: 'Daniel P.', avatar: 'D', points: 471, badges: 6 },
  ];
}

