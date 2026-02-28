import type { PollSummary } from '../../../src/services/api/types';
import { supabaseInsert, supabaseSelect } from './supabaseRest';

interface PollRow {
  id: string;
  type: 'song' | 'series';
  period: 'daily' | 'monthly';
  question: string;
  ends_at: string;
}

interface PollOptionRow {
  id: string;
  poll_id: string;
  title: string;
  artist?: string | null;
  year?: string | null;
  preview?: string | null;
  sort_order?: number | null;
}

interface PollVoteRow {
  id?: string;
  poll_id: string;
  option_id: string;
  user_id?: string;
}

function formatEndsAtLabel(isoValue: string): string {
  const date = new Date(isoValue);
  if (Number.isNaN(date.getTime())) return isoValue;
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export async function getActivePollsData(): Promise<PollSummary[]> {
  const [polls, options, votes] = await Promise.all([
    supabaseSelect<PollRow>('polls', 'id,type,period,question,ends_at', {
      limit: 50,
      orderBy: 'ends_at',
      ascending: true,
      filters: [{ column: 'active', op: 'eq', value: true }],
    }),
    supabaseSelect<PollOptionRow>('poll_options', 'id,poll_id,title,artist,year,preview,sort_order', {
      limit: 500,
      orderBy: 'sort_order',
      ascending: true,
    }),
    supabaseSelect<PollVoteRow>('poll_votes', 'poll_id,option_id', {
      limit: 50000,
      orderBy: 'created_at',
      ascending: false,
    }),
  ]);

  if (!polls.length || !options.length) return [];

  const optionsByPoll = new Map<string, PollOptionRow[]>();
  options.forEach((option) => {
    if (!optionsByPoll.has(option.poll_id)) {
      optionsByPoll.set(option.poll_id, []);
    }
    optionsByPoll.get(option.poll_id)!.push(option);
  });

  const votesByOption = new Map<string, number>();
  const votesByPoll = new Map<string, number>();
  votes.forEach((vote) => {
    votesByOption.set(vote.option_id, (votesByOption.get(vote.option_id) || 0) + 1);
    votesByPoll.set(vote.poll_id, (votesByPoll.get(vote.poll_id) || 0) + 1);
  });

  return polls
    .map((poll) => {
      const pollOptions = (optionsByPoll.get(poll.id) || [])
        .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
        .map((option) => ({
          id: option.id,
          title: option.title,
          artist: option.artist || undefined,
          year: option.year || undefined,
          preview: option.preview || undefined,
          votes: votesByOption.get(option.id) || 0,
        }));

      return {
        id: poll.id,
        type: poll.type,
        period: poll.period,
        question: poll.question,
        options: pollOptions,
        totalVotes: votesByPoll.get(poll.id) || 0,
        endsAt: formatEndsAtLabel(poll.ends_at),
      } satisfies PollSummary;
    })
    .filter((poll) => poll.options.length > 0);
}

export async function votePollData(
  pollId: string,
  optionId: string,
  userId: string,
): Promise<'ok' | 'already_voted' | 'invalid_option'> {
  const [existingVote, matchingOption] = await Promise.all([
    supabaseSelect<PollVoteRow>('poll_votes', 'id', {
      limit: 1,
      filters: [
        { column: 'poll_id', op: 'eq', value: pollId },
        { column: 'user_id', op: 'eq', value: userId },
      ],
    }),
    supabaseSelect<PollOptionRow>('poll_options', 'id,poll_id,title,artist,year,preview,sort_order', {
      limit: 1,
      filters: [
        { column: 'id', op: 'eq', value: optionId },
        { column: 'poll_id', op: 'eq', value: pollId },
      ],
    }),
  ]);

  if (!matchingOption.length) return 'invalid_option';
  if (existingVote.length) return 'already_voted';

  const inserted = await supabaseInsert<
    {
      poll_id: string;
      option_id: string;
      user_id: string;
      created_at: string;
    },
    PollVoteRow
  >(
    'poll_votes',
    {
      poll_id: pollId,
      option_id: optionId,
      user_id: userId,
      created_at: new Date().toISOString(),
    },
    { returning: 'representation' },
  );

  if (!inserted.length) return 'already_voted';
  return 'ok';
}
