import type { GuideSummary } from '../../../src/services/api/types';
import { supabaseSelect, supabaseUpsert } from './supabaseRest';

interface GuideRow {
  id: string;
  title: string;
  category: string;
  metadata?: {
    views?: number;
    trending?: boolean;
  } | null;
  fetched_at?: string | null;
  updated_at?: string | null;
}

interface GuideVoteRow {
  guide_id: string;
  vote: number;
}

interface GuideUpdateRow {
  guide_id: string;
  headline: string;
  update_type?: string | null;
  fetched_at?: string | null;
  created_at?: string | null;
}

const FALLBACK_GUIDES: GuideSummary[] = [
  {
    id: 'guide-fallback-pesel',
    title: 'Getting Your PESEL Number',
    category: 'Admin',
    views: 2847,
    upvotes: 184,
    updatedAt: new Date().toISOString(),
    trending: true,
    realTimeData: 'Wait times vary by district office.',
  },
  {
    id: 'guide-fallback-banking',
    title: 'Opening a Polish Bank Account',
    category: 'Finance',
    views: 1923,
    upvotes: 156,
    updatedAt: new Date().toISOString(),
    trending: false,
    realTimeData: 'Bank onboarding usually requires passport and PESEL.',
  },
  {
    id: 'guide-fallback-housing',
    title: 'Finding Housing in Warsaw',
    category: 'Housing',
    views: 3421,
    upvotes: 289,
    updatedAt: new Date().toISOString(),
    trending: true,
    realTimeData: 'Compare total monthly costs, not rent only.',
  },
];

function safeIso(value?: string | null): string {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().toISOString();
  return date.toISOString();
}

function buildVoteTotals(votes: GuideVoteRow[]): Map<string, number> {
  const totals = new Map<string, number>();
  votes.forEach((vote) => {
    totals.set(vote.guide_id, (totals.get(vote.guide_id) || 0) + Number(vote.vote || 0));
  });
  return totals;
}

export async function getGuidesData(): Promise<GuideSummary[]> {
  const [guides, votes] = await Promise.all([
    supabaseSelect<GuideRow>(
      'guides',
      'id,title,category,metadata,fetched_at,updated_at',
      {
        limit: 100,
        orderBy: 'updated_at',
        ascending: false,
        filters: [{ column: 'active', op: 'eq', value: true }],
      },
    ),
    supabaseSelect<GuideVoteRow>('guide_votes', 'guide_id,vote', {
      limit: 5000,
      orderBy: 'created_at',
      ascending: false,
    }),
  ]);

  if (!guides.length) return FALLBACK_GUIDES;

  const voteTotals = buildVoteTotals(votes);

  return guides.map((guide) => {
    const metadata = guide.metadata || {};
    return {
      id: guide.id,
      title: guide.title,
      category: guide.category,
      views: Number(metadata.views || 0),
      upvotes: voteTotals.get(guide.id) || 0,
      updatedAt: safeIso(guide.fetched_at || guide.updated_at),
      trending: Boolean(metadata.trending),
    };
  });
}

export async function getGuideUpdatesFeed(): Promise<GuideSummary[]> {
  const [guides, updates, votes] = await Promise.all([
    supabaseSelect<GuideRow>(
      'guides',
      'id,title,category,metadata,fetched_at,updated_at',
      {
        limit: 100,
        orderBy: 'updated_at',
        ascending: false,
        filters: [{ column: 'active', op: 'eq', value: true }],
      },
    ),
    supabaseSelect<GuideUpdateRow>(
      'guide_updates',
      'guide_id,headline,update_type,fetched_at,created_at',
      {
        limit: 100,
        orderBy: 'created_at',
        ascending: false,
      },
    ),
    supabaseSelect<GuideVoteRow>('guide_votes', 'guide_id,vote', {
      limit: 5000,
      orderBy: 'created_at',
      ascending: false,
    }),
  ]);

  if (!guides.length || !updates.length) {
    return FALLBACK_GUIDES.map((guide) => ({
      ...guide,
      realTimeData: guide.realTimeData || 'Guide update feed is syncing.',
    }));
  }

  const guideById = new Map(guides.map((guide) => [guide.id, guide]));
  const voteTotals = buildVoteTotals(votes);
  const latestUpdateByGuide = new Map<string, GuideUpdateRow>();

  updates.forEach((update) => {
    if (!latestUpdateByGuide.has(update.guide_id)) {
      latestUpdateByGuide.set(update.guide_id, update);
    }
  });

  return Array.from(latestUpdateByGuide.entries())
    .map<GuideSummary | null>(([guideId, update]) => {
      const guide = guideById.get(guideId);
      if (!guide) return null;
      return {
        id: guide.id,
        title: guide.title,
        category: guide.category,
        views: Number(guide.metadata?.views || 0),
        upvotes: voteTotals.get(guide.id) || 0,
        updatedAt: safeIso(update.fetched_at || update.created_at || guide.updated_at),
        trending: (update.update_type || '').toLowerCase() === 'urgent' || Boolean(guide.metadata?.trending),
        realTimeData: update.headline,
      };
    })
    .filter((item): item is GuideSummary => item !== null);
}

export async function setGuideVote(
  guideId: string,
  userId: string,
  vote: -1 | 1,
): Promise<void> {
  await supabaseUpsert(
    'guide_votes',
    {
      guide_id: guideId,
      user_id: userId,
      vote,
    },
    { onConflict: 'guide_id,user_id' },
  );
}
