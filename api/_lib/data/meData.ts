import type {
  MeBadgeProgress,
  MeConnectionSummary,
  MeInsights,
  MeJourneyEvent,
  MeMilestone,
  MeProfile,
  MeProgress,
} from '../../../src/services/api/types';
import type { MeProfileUpdateInput } from '../validation';
import { supabaseSelect, supabaseUpsert } from './supabaseRest';

interface UserRow {
  id: string;
  display_name?: string | null;
  bio?: string | null;
}

interface UserProfileRow {
  user_id: string;
  level?: string | null;
  points?: number | null;
  streak?: number | null;
  completed_tasks?: number | null;
  total_tasks?: number | null;
}

interface UserPreferenceRow {
  user_id: string;
  mood?: string | null;
  language?: string | null;
}

interface UserProgressRow {
  level_name?: string | null;
  level_number?: number | null;
  xp?: number | null;
  next_level_xp?: number | null;
}

interface JourneyEventRow {
  id: string;
  title: string;
  body?: string | null;
  points?: number | null;
  event_date: string;
}

interface BadgeRow {
  id: string;
  slug: string;
  name: string;
}

interface UserBadgeRow {
  badge_id: string;
}

interface TaskRow {
  id: string;
  title: string;
  points?: number | null;
}

interface UserTaskStatusRow {
  task_id: string;
  status: 'todo' | 'in_progress' | 'done';
}

interface CountOnlyRow {
  id: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeLevel(completedTasks: number): string {
  if (completedTasks >= 31) return 'Warsaw Native';
  if (completedTasks >= 21) return 'Local';
  if (completedTasks >= 11) return 'Settler';
  return 'Newcomer';
}

function defaultProfile(userId: string): MeProfile {
  return {
    id: userId,
    displayName: 'Expat User',
    level: 'Newcomer',
    points: 0,
    streak: 0,
    bio: '',
  };
}

function badgeEmoji(slug: string): string {
  const key = slug.toLowerCase();
  if (key.includes('early')) return 'A';
  if (key.includes('first')) return 'F';
  if (key.includes('week')) return 'W';
  if (key.includes('social')) return 'S';
  if (key.includes('warsaw')) return 'I';
  if (key.includes('village')) return 'V';
  if (key.includes('help')) return 'H';
  if (key.includes('polish')) return 'P';
  return 'B';
}

function badgeCategory(slug: string): string {
  const key = slug.toLowerCase();
  if (key.includes('social') || key.includes('help')) return 'Community';
  if (key.includes('polish')) return 'Vibes';
  if (key.includes('warsaw') || key.includes('village')) return 'Long-Term';
  return 'Arrival';
}

function normalizeBreakdown(checklist: number, community: number, vibes: number): {
  checklist: number;
  community: number;
  vibes: number;
} {
  const total = checklist + community + vibes;
  if (!total) {
    return { checklist: 60, community: 25, vibes: 15 };
  }

  const checklistPct = Math.round((checklist / total) * 100);
  const communityPct = Math.round((community / total) * 100);
  const vibesPct = clamp(100 - checklistPct - communityPct, 0, 100);

  return {
    checklist: checklistPct,
    community: communityPct,
    vibes: vibesPct,
  };
}

function timelineIcon(title: string): string {
  const value = title.toLowerCase();
  if (value.includes('arriv')) return 'A';
  if (value.includes('sim')) return 'S';
  if (value.includes('bank')) return 'B';
  if (value.includes('pesel')) return 'P';
  if (value.includes('residence') || value.includes('permit')) return 'R';
  return 'J';
}

function buildMilestoneFromTask(task?: TaskRow | null): MeMilestone | undefined {
  if (!task) return undefined;
  return {
    name: task.title,
    reward: Number(task.points || 20),
    subtasks: [
      { id: `${task.id}-1`, name: 'Prepare required documents', done: false, points: 10 },
      { id: `${task.id}-2`, name: 'Book or confirm appointment', done: false, points: 10 },
      { id: `${task.id}-3`, name: 'Complete submission and verify status', done: false, points: 10 },
    ],
    location: { lat: 52.2297, lng: 21.0122 },
  };
}

export async function getMeProfileData(userId: string): Promise<MeProfile> {
  const [userRows, profileRows] = await Promise.all([
    supabaseSelect<UserRow>('users', 'id,display_name,bio', {
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

  const user = userRows[0];
  const profile = profileRows[0];

  if (!user && !profile) {
    return defaultProfile(userId);
  }

  const completedTasks = Number(profile?.completed_tasks || 0);
  return {
    id: userId,
    displayName: user?.display_name || 'Expat User',
    level: profile?.level || normalizeLevel(completedTasks),
    points: Number(profile?.points || 0),
    streak: Number(profile?.streak || 0),
    bio: user?.bio || '',
  };
}

export async function updateMeProfileData(
  userId: string,
  input: MeProfileUpdateInput,
): Promise<MeProfile> {
  const [existingUserRows, existingPreferenceRows] = await Promise.all([
    supabaseSelect<UserRow>('users', 'id,display_name,bio', {
      limit: 1,
      filters: [{ column: 'id', op: 'eq', value: userId }],
    }),
    supabaseSelect<UserPreferenceRow>('user_preferences', 'user_id,mood,language', {
      limit: 1,
      filters: [{ column: 'user_id', op: 'eq', value: userId }],
    }),
  ]);

  const existingUser = existingUserRows[0];
  const existingPreference = existingPreferenceRows[0];

  await Promise.all([
    supabaseUpsert(
      'users',
      {
        id: userId,
        display_name: input.displayName || existingUser?.display_name || 'Expat User',
        bio: input.bio ?? existingUser?.bio ?? '',
      },
      { onConflict: 'id' },
    ),
    supabaseUpsert(
      'user_preferences',
      {
        user_id: userId,
        mood: input.mood ?? existingPreference?.mood ?? null,
        language: input.language ?? existingPreference?.language ?? 'en',
      },
      { onConflict: 'user_id' },
    ),
  ]);

  return getMeProfileData(userId);
}

export async function getMeProgressData(userId: string): Promise<MeProgress> {
  const [
    profileRows,
    progressRows,
    journeyRows,
    badgeRows,
    userBadgeRows,
    taskRows,
    userTaskStatusRows,
    otherUserRows,
    userCommunityPosts,
    userCommunityComments,
    userPollVotes,
  ] = await Promise.all([
    supabaseSelect<UserProfileRow>(
      'user_profiles',
      'user_id,level,points,streak,completed_tasks,total_tasks',
      {
        limit: 1,
        filters: [{ column: 'user_id', op: 'eq', value: userId }],
      },
    ),
    supabaseSelect<UserProgressRow>('user_progress', 'level_name,level_number,xp,next_level_xp', {
      limit: 1,
      filters: [{ column: 'user_id', op: 'eq', value: userId }],
    }),
    supabaseSelect<JourneyEventRow>('journey_events', 'id,title,body,points,event_date', {
      limit: 30,
      orderBy: 'event_date',
      ascending: true,
      filters: [{ column: 'user_id', op: 'eq', value: userId }],
    }),
    supabaseSelect<BadgeRow>('badges', 'id,slug,name', {
      limit: 200,
      orderBy: 'created_at',
      ascending: true,
    }),
    supabaseSelect<UserBadgeRow>('user_badges', 'badge_id', {
      limit: 200,
      filters: [{ column: 'user_id', op: 'eq', value: userId }],
    }),
    supabaseSelect<TaskRow>('tasks', 'id,title,points', {
      limit: 1000,
      orderBy: 'created_at',
      ascending: true,
      filters: [{ column: 'active', op: 'eq', value: true }],
    }),
    supabaseSelect<UserTaskStatusRow>('user_task_status', 'task_id,status', {
      limit: 2000,
      orderBy: 'updated_at',
      ascending: false,
      filters: [{ column: 'user_id', op: 'eq', value: userId }],
    }),
    supabaseSelect<UserRow>('users', 'id,display_name,bio', {
      limit: 20,
      orderBy: 'created_at',
      ascending: false,
    }),
    supabaseSelect<CountOnlyRow>('community_posts', 'id', {
      limit: 2000,
      filters: [{ column: 'user_id', op: 'eq', value: userId }],
    }),
    supabaseSelect<CountOnlyRow>('community_comments', 'id', {
      limit: 2000,
      filters: [{ column: 'user_id', op: 'eq', value: userId }],
    }),
    supabaseSelect<CountOnlyRow>('poll_votes', 'id', {
      limit: 2000,
      filters: [{ column: 'user_id', op: 'eq', value: userId }],
    }),
  ]);

  const profile = profileRows[0];
  const progress = progressRows[0];
  const statusByTask = new Map(userTaskStatusRows.map((row) => [row.task_id, row.status]));

  const doneFromStatuses = userTaskStatusRows.filter((row) => row.status === 'done').length;
  const completedTasks = Number(profile?.completed_tasks ?? doneFromStatuses);
  const totalTasks = Number(profile?.total_tasks ?? taskRows.length ?? 0);
  const points = Number(profile?.points ?? 0);
  const streak = Number(profile?.streak ?? 0);

  const pendingTask = taskRows.find((task) => statusByTask.get(task.id) !== 'done');
  const currentMilestone = buildMilestoneFromTask(pendingTask);

  const today = new Date();
  const journey: MeJourneyEvent[] | undefined = journeyRows.length
    ? journeyRows.map((event) => {
        const date = new Date(event.event_date);
        const completed = !Number.isNaN(date.getTime()) && date.getTime() <= today.getTime();
        return {
          id: event.id,
          date: event.event_date,
          event: event.title,
          icon: timelineIcon(event.title),
          completed,
        };
      })
    : undefined;

  const unlockedBadgeIds = new Set(userBadgeRows.map((row) => row.badge_id));
  const badgeProgress = totalTasks > 0 ? clamp(Math.round((completedTasks / totalTasks) * 100), 0, 100) : 0;
  const badges: MeBadgeProgress[] | undefined = badgeRows.length
    ? badgeRows.map((badge) => {
        const unlocked = unlockedBadgeIds.has(badge.id);
        return {
          id: badge.slug,
          name: badge.name,
          emoji: badgeEmoji(badge.slug),
          category: badgeCategory(badge.slug),
          unlocked,
          progress: unlocked ? 100 : badgeProgress,
        };
      })
    : undefined;

  const connections: MeConnectionSummary[] | undefined = otherUserRows
    .filter((user) => user.id !== userId)
    .slice(0, 3)
    .map((user, index) => ({
      name: user.display_name || 'Expat User',
      status: index % 2 === 0 ? 'Online' : 'Offline',
      avatar: (user.display_name || 'E').slice(0, 1).toUpperCase(),
      country: ['UK', 'Italy', 'India', 'Spain', 'Germany'][index % 5],
      sharedTasks: Math.max(1, (completedTasks % 5) + index + 1),
    }));

  const activityBreakdown = normalizeBreakdown(
    doneFromStatuses || completedTasks,
    userCommunityPosts.length + userCommunityComments.length,
    userPollVotes.length,
  );

  const completionRatio = totalTasks > 0 ? completedTasks / totalTasks : 0;
  const aheadOfAverage = clamp(Math.round((completionRatio - 0.35) * 100), -20, 60);
  const daysToSettled = clamp(Math.round((1 - completionRatio) * 30), 3, 45);
  const confidence = clamp(55 + streak * 3 + Math.round(completionRatio * 30), 50, 96);
  const streakCalendar = Array.from({ length: 28 }, (_, index) => index < clamp(streak, 0, 28));

  const insights: MeInsights = {
    aheadOfAverage,
    activityBreakdown,
    forecast: { daysToSettled, confidence },
    streakCalendar,
  };

  const resolvedLevel = profile?.level || progress?.level_name || normalizeLevel(completedTasks);
  const weekLabel = `Week ${Math.max(1, Math.ceil((completedTasks + 1) / 4))}`;

  return {
    level: resolvedLevel,
    points,
    completedTasks,
    totalTasks,
    streak,
    weekLabel,
    currentMilestone,
    journey,
    badges,
    connections,
    insights,
  };
}
