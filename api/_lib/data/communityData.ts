import type {
  CommunityCommentInput,
  CommunityCreatePostInput,
  CommunityReactionInput,
} from '../validation';
import type { CommunityPostSummary } from '../../../src/services/api/types';
import { supabaseInsert, supabaseSelect, supabaseUpsert } from './supabaseRest';

type CommunityFilter = 'all' | 'hot' | 'new' | 'questions' | 'wins';

interface CommunityPostRow {
  id: string;
  user_id: string;
  title: string;
  body: string;
  is_hot?: boolean | null;
  created_at: string;
}

interface CommunityCommentRow {
  post_id: string;
}

interface CommunityReactionRow {
  post_id: string;
  reaction: string;
}

interface UserRow {
  id: string;
  display_name: string;
}

function fallbackPosts(): CommunityPostSummary[] {
  return [
    {
      id: 'fallback-community-1',
      authorName: 'Sarah M.',
      title: 'PESEL appointment wait times',
      preview: 'Has anyone booked recently and seen faster slots?',
      likes: 34,
      replies: 18,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'fallback-community-2',
      authorName: 'Luca R.',
      title: 'Rental contract red flags in Warsaw',
      preview: 'I listed the top clauses worth checking before signing.',
      likes: 67,
      replies: 29,
      createdAt: new Date().toISOString(),
    },
  ];
}

function isQuestionPost(post: CommunityPostSummary): boolean {
  return post.title.includes('?') || post.preview.includes('?');
}

function isWinPost(post: CommunityPostSummary): boolean {
  const text = `${post.title} ${post.preview}`.toLowerCase();
  return ['approved', 'got my', 'success', 'win', 'won'].some((term) => text.includes(term));
}

function trimPreview(body: string): string {
  if (body.length <= 220) return body;
  return `${body.slice(0, 217).trim()}...`;
}

function applyFilter(posts: CommunityPostSummary[], filter: CommunityFilter): CommunityPostSummary[] {
  if (filter === 'all' || filter === 'new') return posts;
  if (filter === 'hot') return posts.filter((post) => post.likes >= 25 || post.replies >= 12);
  if (filter === 'questions') return posts.filter(isQuestionPost);
  if (filter === 'wins') return posts.filter(isWinPost);
  return posts;
}

export async function getCommunityPostsData(filter: CommunityFilter): Promise<CommunityPostSummary[]> {
  const [posts, comments, reactions, users] = await Promise.all([
    supabaseSelect<CommunityPostRow>(
      'community_posts',
      'id,user_id,title,body,is_hot,created_at',
      {
        limit: 200,
        orderBy: 'created_at',
        ascending: false,
      },
    ),
    supabaseSelect<CommunityCommentRow>('community_comments', 'post_id', {
      limit: 5000,
      orderBy: 'created_at',
      ascending: false,
    }),
    supabaseSelect<CommunityReactionRow>('community_reactions', 'post_id,reaction', {
      limit: 10000,
      orderBy: 'created_at',
      ascending: false,
    }),
    supabaseSelect<UserRow>('users', 'id,display_name', {
      limit: 1000,
      orderBy: 'created_at',
      ascending: false,
    }),
  ]);

  if (!posts.length) {
    return applyFilter(fallbackPosts(), filter);
  }

  const repliesByPost = new Map<string, number>();
  comments.forEach((comment) => {
    repliesByPost.set(comment.post_id, (repliesByPost.get(comment.post_id) || 0) + 1);
  });

  const likesByPost = new Map<string, number>();
  reactions.forEach((reaction) => {
    if (reaction.reaction !== 'like') return;
    likesByPost.set(reaction.post_id, (likesByPost.get(reaction.post_id) || 0) + 1);
  });

  const userById = new Map(users.map((user) => [user.id, user.display_name]));

  const mapped = posts.map((post) => ({
    id: post.id,
    authorName: userById.get(post.user_id) || 'Expat User',
    title: post.title,
    preview: trimPreview(post.body),
    likes: likesByPost.get(post.id) || 0,
    replies: repliesByPost.get(post.id) || 0,
    createdAt: post.created_at,
  }));

  const filtered = applyFilter(mapped, filter);
  if (filter === 'hot') {
    filtered.sort((a, b) => b.likes + b.replies - (a.likes + a.replies));
  }

  return filtered;
}

interface InsertedPostRow {
  id: string;
  title: string;
  body: string;
  created_at: string;
}

export async function createCommunityPostData(
  userId: string,
  input: CommunityCreatePostInput,
): Promise<CommunityPostSummary> {
  const created = await supabaseInsert<
    {
      user_id: string;
      title: string;
      body: string;
      has_voice?: boolean;
    },
    InsertedPostRow
  >(
    'community_posts',
    {
      user_id: userId,
      title: input.title,
      body: input.body,
      has_voice: Boolean(input.hasVoice),
    },
    { returning: 'representation' },
  );

  const row = created[0];
  if (!row) {
    return {
      id: `post-${Date.now()}`,
      authorName: 'You',
      title: input.title,
      preview: trimPreview(input.body),
      likes: 0,
      replies: 0,
      createdAt: new Date().toISOString(),
    };
  }

  return {
    id: row.id,
    authorName: 'You',
    title: row.title,
    preview: trimPreview(row.body),
    likes: 0,
    replies: 0,
    createdAt: row.created_at,
  };
}

export async function createCommunityCommentData(
  postId: string,
  userId: string,
  input: CommunityCommentInput,
): Promise<void> {
  await supabaseInsert('community_comments', {
    post_id: postId,
    user_id: userId,
    body: input.body,
  });
}

export async function createCommunityReactionData(
  postId: string,
  userId: string,
  input: CommunityReactionInput,
): Promise<void> {
  await supabaseUpsert(
    'community_reactions',
    {
      post_id: postId,
      user_id: userId,
      reaction: input.reaction,
    },
    {
      onConflict: 'post_id,user_id,reaction',
    },
  );
}
