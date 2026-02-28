import type {
  FlavorActivitySummary,
  FlavorChallengeSummary,
  FlavorDayBundle,
  FlavorDaySummary,
  FlavorLeaderboardEntry,
  FlavorRestaurantSummary,
} from '../../../src/services/api/types';
import { badRequest } from '../security';
import { supabaseInsert, supabaseSelect, supabaseUpsert } from './supabaseRest';

interface FlavorDayRow {
  id: string;
  day_of_week: number;
  cuisine: string;
  emoji: string;
  vibe: string;
  fun_fact: string;
  active: boolean;
}

interface FlavorRestaurantRow {
  id: string;
  day_id?: string | null;
  cuisine?: string | null;
  name: string;
  district: string;
  rating: number;
  expat_score: number;
  discount: string;
  verified: boolean;
  distance_km: number;
  photo_url: string;
  active: boolean;
}

interface FlavorActivityRow {
  id: string;
  actor_name: string;
  actor_avatar: string;
  action_text: string;
  points: number;
  created_at: string;
}

interface FlavorChallengeRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  reward_points: number;
  total_steps: number;
  active: boolean;
}

interface FlavorProgressRow {
  challenge_id: string;
  progress: number;
}

interface FlavorLeaderboardRow {
  id: string;
  user_id?: string | null;
  display_name: string;
  avatar: string;
  points: number;
  badges: number;
}

interface FlavorCheckinRow {
  id: string;
  created_at: string;
}

interface UserRow {
  id: string;
  display_name?: string | null;
}

function currentDay(): number {
  return new Date().getDay();
}

function formatDateLabel(): string {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

function formatAgo(isoDate: string): string {
  const time = new Date(isoDate).getTime();
  if (!Number.isFinite(time)) return 'just now';
  const delta = Math.max(0, Date.now() - time);
  const minutes = Math.floor(delta / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function toFlavorDay(row?: FlavorDayRow): FlavorDaySummary | null {
  if (!row) return null;
  return {
    id: row.id,
    cuisine: row.cuisine,
    emoji: row.emoji || 'FD',
    dateLabel: formatDateLabel(),
    vibe: row.vibe,
    funFact: row.fun_fact,
  };
}

function toRestaurant(row: FlavorRestaurantRow): FlavorRestaurantSummary {
  return {
    id: row.id,
    name: row.name,
    district: row.district,
    cuisine: row.cuisine || 'Flavor Day',
    rating: Number(row.rating || 0),
    expatScore: Number(row.expat_score || 0),
    discount: row.discount,
    verified: Boolean(row.verified),
    distanceKm: Number(row.distance_km || 0),
    photo: row.photo_url,
  };
}

function toActivity(row: FlavorActivityRow): FlavorActivitySummary {
  return {
    id: row.id,
    user: row.actor_name,
    avatar: row.actor_avatar || 'E',
    action: row.action_text,
    points: Number(row.points || 0),
    timestamp: formatAgo(row.created_at),
  };
}

function toLeaderboard(row: FlavorLeaderboardRow): FlavorLeaderboardEntry {
  return {
    id: row.id,
    name: row.display_name,
    avatar: row.avatar || 'E',
    points: Number(row.points || 0),
    badges: Number(row.badges || 0),
  };
}

export async function getFlavorDayBundleData(
  userId?: string | null,
): Promise<FlavorDayBundle> {
  const today = currentDay();

  const [days, activities, leaderboardRows, challenges, progressRows] =
    await Promise.all([
      supabaseSelect<FlavorDayRow>(
        'flavor_days',
        'id,day_of_week,cuisine,emoji,vibe,fun_fact,active',
        {
          limit: 7,
          orderBy: 'day_of_week',
          ascending: true,
          filters: [{ column: 'active', op: 'eq', value: true }],
        },
      ),
      supabaseSelect<FlavorActivityRow>(
        'flavor_activity_feed',
        'id,actor_name,actor_avatar,action_text,points,created_at',
        { limit: 20, orderBy: 'created_at', ascending: false },
      ),
      supabaseSelect<FlavorLeaderboardRow>(
        'flavor_leaderboard',
        'id,user_id,display_name,avatar,points,badges',
        { limit: 20, orderBy: 'points', ascending: false },
      ),
      supabaseSelect<FlavorChallengeRow>(
        'flavor_challenges',
        'id,slug,title,description,reward_points,total_steps,active',
        {
          limit: 20,
          orderBy: 'created_at',
          ascending: true,
          filters: [{ column: 'active', op: 'eq', value: true }],
        },
      ),
      userId
        ? supabaseSelect<FlavorProgressRow>(
            'flavor_user_challenge_progress',
            'challenge_id,progress',
            {
              limit: 50,
              filters: [{ column: 'user_id', op: 'eq', value: userId }],
            },
          )
        : Promise.resolve([] as FlavorProgressRow[]),
    ]);

  const day = days.find((entry) => Number(entry.day_of_week) === today) || days[0];

  const restaurants = await supabaseSelect<FlavorRestaurantRow>(
    'flavor_restaurants',
    'id,day_id,cuisine,name,district,rating,expat_score,discount,verified,distance_km,photo_url,active',
    day
      ? {
          limit: 50,
          orderBy: 'rating',
          ascending: false,
          filters: [
            { column: 'active', op: 'eq', value: true },
            { column: 'day_id', op: 'eq', value: day.id },
          ],
        }
      : {
          limit: 50,
          orderBy: 'rating',
          ascending: false,
          filters: [{ column: 'active', op: 'eq', value: true }],
        },
  );

  const progressByChallenge = new Map(
    progressRows.map((entry) => [entry.challenge_id, Number(entry.progress || 0)]),
  );

  const challengeSummaries: FlavorChallengeSummary[] = challenges.map((challenge) => ({
    id: challenge.id,
    title: challenge.title,
    description: challenge.description,
    rewardPoints: Number(challenge.reward_points || 0),
    total: Number(challenge.total_steps || 1),
    progress: Math.max(
      0,
      Math.min(
        Number(challenge.total_steps || 1),
        Number(progressByChallenge.get(challenge.id) || 0),
      ),
    ),
  }));

  return {
    day: toFlavorDay(day),
    restaurants: restaurants.map(toRestaurant),
    activity: activities.map(toActivity),
    challenges: challengeSummaries,
    leaderboard: leaderboardRows.map(toLeaderboard),
  };
}

export async function getFlavorLeaderboardData(): Promise<FlavorLeaderboardEntry[]> {
  const rows = await supabaseSelect<FlavorLeaderboardRow>(
    'flavor_leaderboard',
    'id,user_id,display_name,avatar,points,badges',
    { limit: 20, orderBy: 'points', ascending: false },
  );

  return rows.map(toLeaderboard);
}

export async function checkInFlavorRestaurantData(
  userId: string,
  restaurantId: string,
): Promise<{ checkinId: string; rewardPoints: number; createdAt: string }> {
  const rewardPoints = 10;
  const [restaurantRows, userRows] = await Promise.all([
    supabaseSelect<FlavorRestaurantRow>(
      'flavor_restaurants',
      'id,name,day_id,cuisine,district,rating,expat_score,discount,verified,distance_km,photo_url,active',
      {
        limit: 1,
        filters: [
          { column: 'id', op: 'eq', value: restaurantId },
          { column: 'active', op: 'eq', value: true },
        ],
      },
    ),
    supabaseSelect<UserRow>('users', 'id,display_name', {
      limit: 1,
      filters: [{ column: 'id', op: 'eq', value: userId }],
    }),
  ]);

  const restaurant = restaurantRows[0];
  if (!restaurant) {
    throw badRequest('Invalid restaurantId');
  }

  const existingRows = await supabaseSelect<FlavorCheckinRow>(
    'flavor_checkins',
    'id,created_at',
    {
      limit: 1,
      orderBy: 'created_at',
      ascending: false,
      filters: [
        { column: 'user_id', op: 'eq', value: userId },
        { column: 'restaurant_id', op: 'eq', value: restaurantId },
      ],
    },
  );
  const existingToday = existingRows[0];

  if (existingToday?.id) {
    return {
      checkinId: existingToday.id,
      rewardPoints: 0,
      createdAt: existingToday.created_at,
    };
  }

  const inserted = await supabaseInsert<
    {
      user_id: string;
      restaurant_id: string;
      reward_points: number;
      created_at: string;
    },
    FlavorCheckinRow
  >(
    'flavor_checkins',
    {
      user_id: userId,
      restaurant_id: restaurantId,
      reward_points: rewardPoints,
      created_at: new Date().toISOString(),
    },
    { returning: 'representation' },
  );

  const checkin = inserted[0];
  if (!checkin?.id) {
    throw badRequest('Check-in could not be persisted');
  }

  const actorName = userRows[0]?.display_name || 'Expat User';
  const actorAvatar = actorName.slice(0, 1).toUpperCase() || 'E';

  await supabaseInsert('flavor_activity_feed', {
    user_id: userId,
    actor_name: actorName,
    actor_avatar: actorAvatar,
    action_text: `checked in at ${restaurant.name}`,
    points: rewardPoints,
    created_at: checkin.created_at,
  });

  const challenges = await supabaseSelect<FlavorChallengeRow>(
    'flavor_challenges',
    'id,slug,title,description,reward_points,total_steps,active',
    {
      limit: 10,
      filters: [{ column: 'active', op: 'eq', value: true }],
    },
  );
  const targetChallenge = challenges.find(
    (challenge) => challenge.slug === 'taste-passport-3-stamps',
  );

  if (targetChallenge) {
    const existingProgressRows = await supabaseSelect<FlavorProgressRow>(
      'flavor_user_challenge_progress',
      'challenge_id,progress',
      {
        limit: 1,
        filters: [
          { column: 'user_id', op: 'eq', value: userId },
          { column: 'challenge_id', op: 'eq', value: targetChallenge.id },
        ],
      },
    );
    const currentProgress = Number(existingProgressRows[0]?.progress || 0);
    const nextProgress = Math.min(
      Number(targetChallenge.total_steps || 1),
      currentProgress + 1,
    );

    await supabaseUpsert(
      'flavor_user_challenge_progress',
      {
        user_id: userId,
        challenge_id: targetChallenge.id,
        progress: nextProgress,
      },
      { onConflict: 'user_id,challenge_id' },
    );
  }

  const leaderboardRows = await supabaseSelect<FlavorLeaderboardRow>(
    'flavor_leaderboard',
    'id,user_id,display_name,avatar,points,badges',
    {
      limit: 1,
      filters: [{ column: 'user_id', op: 'eq', value: userId }],
    },
  );
  const existingLeader = leaderboardRows[0];

  await supabaseUpsert(
    'flavor_leaderboard',
    {
      user_id: userId,
      display_name: actorName,
      avatar: actorAvatar,
      points: Number(existingLeader?.points || 0) + rewardPoints,
      badges: Number(existingLeader?.badges || 0),
    },
    { onConflict: 'user_id' },
  );

  return {
    checkinId: checkin.id,
    rewardPoints,
    createdAt: checkin.created_at,
  };
}


