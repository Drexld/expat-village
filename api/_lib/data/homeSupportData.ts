import type {
  HomeCommunityTopic,
  HomeQuickAction,
  HomeSupportPayload,
  HomeWarsawDailyChallenge,
  HomeWarsawDailyLeaderboardEntry,
} from '../../../src/services/api/types';
import type { HandlerResultWithFreshness } from '../security';
import { supabaseSelect } from './supabaseRest';

interface WeatherRow {
  temperature_c: number;
  condition: string;
  fetched_at: string;
}

interface TaskRow {
  id: string;
  title: string;
  urgency?: string | null;
  points?: number | null;
}

interface UserTaskStatusRow {
  task_id: string;
  status: 'todo' | 'in_progress' | 'done';
}

interface UserProfileRow {
  user_id: string;
  points?: number | null;
  streak?: number | null;
}

interface UserRow {
  id: string;
  display_name?: string | null;
}

interface CommunityPostRow {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
}

interface CommunityCommentRow {
  post_id: string;
}

interface ReviewPromptRow {
  id: string;
  created_at?: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
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

function initialFromName(name?: string | null): string {
  const text = (name || 'E').trim();
  return text.slice(0, 1).toUpperCase() || 'E';
}

function formatTempLabel(value: number): string {
  return `${value}°C`;
}

function latestIso(values: Array<string | null | undefined>): string {
  const millis = values
    .map((value) => (value ? new Date(value).getTime() : Number.NaN))
    .filter((value) => Number.isFinite(value)) as number[];

  if (!millis.length) return new Date().toISOString();
  return new Date(Math.max(...millis)).toISOString();
}

function buildWeatherChallenge(temperatureC: number): HomeWarsawDailyChallenge {
  const target = Math.round(temperatureC + 2);
  const candidates = [
    target - 5,
    target - 2,
    target,
    target + 3,
  ].map((value) => clamp(value, -20, 35));

  const correctIndex = candidates.indexOf(target);

  return {
    id: 'weather-forecast',
    question: "What's tomorrow's high in Warsaw?",
    options: candidates.map(formatTempLabel),
    correctIndex: correctIndex >= 0 ? correctIndex : 2,
    pointsReward: 10,
  };
}

function buildWisdomChallenge(tasks: TaskRow[]): HomeWarsawDailyChallenge {
  const deduped = Array.from(new Set(tasks.map((task) => task.title))).slice(0, 4);
  const options = deduped.length
    ? deduped
    : [
        'Sync live checklist data',
        'Complete profile setup',
        'Join community discussion',
        'Enable service reviews',
      ];

  const rewardPoints = Number(tasks[0]?.points || 10);

  return {
    id: 'wisdom-priority',
    question: 'Which task should be prioritized next?',
    options,
    correctIndex: 0,
    pointsReward: rewardPoints,
    rewardLabel: `${rewardPoints} points`,
  };
}

function buildTopics(posts: CommunityPostRow[]): HomeCommunityTopic[] {
  const seed = new Map<string, { label: string; icon: HomeCommunityTopic['icon']; count: number }>([
    ['bank', { label: 'Banking tips', icon: 'bank', count: 0 }],
    ['housing', { label: 'Housing alerts', icon: 'house', count: 0 }],
    ['job', { label: 'Job hunting', icon: 'briefcase', count: 0 }],
    ['legal', { label: 'Legal watch', icon: 'file', count: 0 }],
    ['district', { label: 'District trends', icon: 'pin', count: 0 }],
  ]);

  posts.forEach((post) => {
    const title = post.title.toLowerCase();
    if (title.includes('bank')) seed.get('bank')!.count += 1;
    if (title.includes('rent') || title.includes('flat') || title.includes('housing')) {
      seed.get('housing')!.count += 1;
    }
    if (title.includes('job') || title.includes('work')) seed.get('job')!.count += 1;
    if (title.includes('legal') || title.includes('permit') || title.includes('pesel')) {
      seed.get('legal')!.count += 1;
    }
    if (title.includes('mokot') || title.includes('praga') || title.includes('district')) {
      seed.get('district')!.count += 1;
    }
  });

  return Array.from(seed.entries())
    .map(([id, value]) => ({
      id,
      label: value.label,
      count: value.count,
      trend: value.count > 0 ? Math.max(1, Math.round(value.count * 1.5)) : 0,
      icon: value.icon,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}

function buildQuickActions(params: {
  pendingTasks: TaskRow[];
  communityPostsCount: number;
  pendingReviewCount: number;
}): HomeQuickAction[] {
  const actions: HomeQuickAction[] = [];

  if (params.pendingTasks.some((task) => /pesel/i.test(task.title))) {
    actions.push({
      id: 'book-pesel',
      label: 'Book PESEL',
      subtitle: 'Next legal priority',
      icon: 'calendar',
      accent: 'blue',
      priority: 100,
    });
  }

  actions.push({
    id: 'find-expats',
    label: 'Find Expats',
    subtitle:
      params.communityPostsCount > 0
        ? `${params.communityPostsCount} active threads`
        : 'Meet locals and expats',
    icon: 'users',
    accent: 'pink',
    priority: 90,
  });

  actions.push({
    id: 'ask-question',
    label: 'Ask Question',
    subtitle:
      params.pendingReviewCount > 0
        ? `${params.pendingReviewCount} review prompts pending`
        : 'Get quick community help',
    icon: 'message',
    accent: 'green',
    priority: 80,
  });

  actions.push({
    id: 'find-services',
    label: 'Find Services',
    subtitle:
      params.pendingTasks.length > 0
        ? `${params.pendingTasks.length} tasks need services`
        : 'Trusted Warsaw services',
    icon: 'zap',
    accent: 'amber',
    priority: 70,
  });

  return actions
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 4);
}

export async function getHomeSupportData(
  userId?: string | null,
): Promise<HomeSupportPayload> {
  const bundle = await getHomeSupportBundleData(userId);
  return bundle.data;
}

export async function getHomeSupportBundleData(
  userId?: string | null,
): Promise<HandlerResultWithFreshness<HomeSupportPayload>> {
  const [weatherRows, taskRows, taskStatusRows, profileRows, userRows, postRows, commentRows, promptRows] =
    await Promise.all([
      supabaseSelect<WeatherRow>(
        'weather_snapshots',
        'temperature_c,condition,fetched_at',
        { limit: 1, orderBy: 'fetched_at', ascending: false },
      ),
      supabaseSelect<TaskRow>('tasks', 'id,title,urgency,points', {
        limit: 500,
        orderBy: 'created_at',
        ascending: true,
        filters: [{ column: 'active', op: 'eq', value: true }],
      }),
      userId
        ? supabaseSelect<UserTaskStatusRow>('user_task_status', 'task_id,status', {
            limit: 1000,
            filters: [{ column: 'user_id', op: 'eq', value: userId }],
          })
        : Promise.resolve([] as UserTaskStatusRow[]),
      supabaseSelect<UserProfileRow>('user_profiles', 'user_id,points,streak', {
        limit: 200,
        orderBy: 'points',
        ascending: false,
      }),
      supabaseSelect<UserRow>('users', 'id,display_name', {
        limit: 200,
        orderBy: 'created_at',
        ascending: false,
      }),
      supabaseSelect<CommunityPostRow>('community_posts', 'id,user_id,title,created_at', {
        limit: 200,
        orderBy: 'created_at',
        ascending: false,
      }),
      supabaseSelect<CommunityCommentRow>('community_comments', 'post_id', {
        limit: 1000,
        orderBy: 'created_at',
        ascending: false,
      }),
      userId
        ? supabaseSelect<ReviewPromptRow>('review_prompts', 'id,created_at', {
            limit: 200,
            filters: [{ column: 'user_id', op: 'eq', value: userId }],
          })
        : Promise.resolve([] as ReviewPromptRow[]),
    ]);

  const statusByTask = new Map(taskStatusRows.map((row) => [row.task_id, row.status]));
  const pendingTasks = taskRows.filter((task) => statusByTask.get(task.id) !== 'done');
  const prioritizedTasks = [...pendingTasks].sort((a, b) => {
    const urgencyA = a.urgency === 'urgent' ? 1 : 0;
    const urgencyB = b.urgency === 'urgent' ? 1 : 0;
    if (urgencyA !== urgencyB) return urgencyB - urgencyA;
    return Number(b.points || 0) - Number(a.points || 0);
  });

  const userById = new Map(userRows.map((user) => [user.id, user]));
  const leaderboard: HomeWarsawDailyLeaderboardEntry[] = profileRows
    .slice(0, 5)
    .map((profile, index) => {
      const user = userById.get(profile.user_id);
      return {
        rank: index + 1,
        userId: profile.user_id,
        name: user?.display_name || 'Expat User',
        avatar: initialFromName(user?.display_name),
        points: Number(profile.points || 0),
        streak: Number(profile.streak || 0),
      };
    });

  const repliesByPost = new Map<string, number>();
  commentRows.forEach((comment) => {
    repliesByPost.set(comment.post_id, (repliesByPost.get(comment.post_id) || 0) + 1);
  });

  const previews = postRows.slice(0, 2).map((post) => ({
    id: post.id,
    authorAvatar: initialFromName(userById.get(post.user_id)?.display_name),
    title: post.title,
    timestamp: formatAgo(post.created_at),
    isNew: Date.now() - new Date(post.created_at).getTime() < 10 * 60 * 1000,
    replies: repliesByPost.get(post.id) || 0,
  }));

  const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
  const activeUserIds = new Set(
    postRows
      .filter((post) => new Date(post.created_at).getTime() >= twentyFourHoursAgo)
      .map((post) => post.user_id),
  );
  const activeCount = activeUserIds.size;
  const viewingCount = activeCount > 0 ? activeCount * 3 + previews.length * 4 : 0;

  const weatherTemp = Number(weatherRows[0]?.temperature_c ?? 0);
  const weatherChallenge = buildWeatherChallenge(weatherTemp);
  const wisdomChallenge = buildWisdomChallenge(prioritizedTasks);

  const topics = buildTopics(postRows);

  return {
    data: {
      warsawDaily: {
        weatherChallenge,
        wisdomChallenge,
        leaderboard,
      },
      community: {
        townHall: {
          activeCount,
          viewingCount,
          previews,
        },
        hotTopics: topics,
      },
      quickActions: buildQuickActions({
        pendingTasks: prioritizedTasks,
        communityPostsCount: activeCount,
        pendingReviewCount: promptRows.length,
      }),
    },
    freshness: {
      source: 'home-support-live',
      updatedAt: latestIso([
        weatherRows[0]?.fetched_at,
        postRows[0]?.created_at,
        promptRows[0]?.created_at,
      ]),
      ttlSeconds: 300,
    },
  };
}


