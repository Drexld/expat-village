import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Music, Tv, Play, Trophy, Share2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { usePolls } from '../services/api/hooks';
import type { PollSummary } from '../services/api/types';

export function VillageVibes() {
  const { data, isLoading, isLive, submitVote } = usePolls();
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly' | 'results'>('daily');
  const [voted, setVoted] = useState<string[]>([]);

  const polls = data ?? [];
  const dailySongPoll = polls.find((poll) => poll.period === 'daily' || poll.type === 'song') || polls[0] || null;
  const monthlySeries = polls.find((poll) => poll.period === 'monthly' || poll.type === 'series') || polls[1] || dailySongPoll;

  const currentPoll: PollSummary | null =
    activeTab === 'daily' ? dailySongPoll : activeTab === 'monthly' ? monthlySeries : dailySongPoll;

  const leaderboard = useMemo(() => {
    const options = [
      ...(dailySongPoll?.options || []),
      ...(monthlySeries?.options || []),
    ]
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 3);

    return options.map((option, index) => ({
      rank: index + 1,
      name: option.title,
      votes: option.votes,
      streak: Math.max(3, 14 - index * 4),
    }));
  }, [dailySongPoll, monthlySeries]);

  const handleVote = async (optionId: string) => {
    if (!currentPoll) return;

    if (voted.includes(currentPoll.id)) {
      toast.error('Already voted!', {
        description: 'Come back for the next poll cycle.',
        duration: 2000,
      });
      return;
    }

    setVoted((prev) => [...prev, currentPoll.id]);

    try {
      await submitVote(currentPoll.id, optionId);

      toast.success('Vote submitted!', {
        description: isLive ? '+3 points earned. Vote synced live.' : '+3 points earned in preview mode.',
        duration: 2200,
      });

      if ('vibrate' in navigator) {
        navigator.vibrate([30, 50, 30]);
      }
    } catch (error) {
      setVoted((prev) => prev.filter((pollId) => pollId !== currentPoll.id));
      const message = error instanceof Error ? error.message : 'Could not submit vote';
      toast.error('Vote failed', { description: message });
    }
  };

  const handleShare = () => {
    toast.success('Shared with friends!', {
      description: '+5 bonus points',
      duration: 2000,
    });
  };

  const getVotePercentage = (votes: number, totalVotes: number) => {
    if (!totalVotes) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  const dailyWinner = dailySongPoll?.options?.slice().sort((a, b) => b.votes - a.votes)[0];
  const monthlyWinner = monthlySeries?.options?.slice().sort((a, b) => b.votes - a.votes)[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#0a0e1a] to-[#000000] text-white">
      <div className="sticky top-0 z-40 px-5 pt-8 pb-4 backdrop-blur-xl bg-gradient-to-b from-[#000000] to-transparent">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold">Village Vibes</h1>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl"
            >
              ??
            </motion.div>
          </div>
          <p className="text-sm text-white/50">Shape our community culture together</p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-4">
          {(['daily', 'monthly', 'results'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-b from-[#ec4899] to-[#db2777] text-white shadow-[0_4px_16px_rgba(236,72,153,0.4)]'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {tab === 'daily' && '?? '}
              {tab === 'monthly' && '?? '}
              {tab === 'results' && '?? '}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {currentPoll && (
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-[12px] bg-white/5 border border-white/5 text-center">
              <p className="text-xl font-bold text-[#3b9eff]">{currentPoll.totalVotes}</p>
              <p className="text-[10px] text-white/50 uppercase tracking-wide">Total Votes</p>
            </div>
            <div className="p-3 rounded-[12px] bg-white/5 border border-white/5 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.8)]"
                />
                <p className="text-xl font-bold text-green-400">{Math.max(120, Math.round(currentPoll.totalVotes * 0.86))}</p>
              </div>
              <p className="text-[10px] text-white/50 uppercase tracking-wide">Live Now</p>
            </div>
            <div className="p-3 rounded-[12px] bg-white/5 border border-white/5 text-center">
              <p className="text-xl font-bold text-[#ff6b9d]">{voted.length}</p>
              <p className="text-[10px] text-white/50 uppercase tracking-wide">Your Streak</p>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 pb-24">
        {(activeTab === 'daily' || activeTab === 'monthly') && currentPoll && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="relative overflow-hidden rounded-[24px] p-[1px] bg-gradient-to-b from-white/25 to-white/10">
              <div className="relative rounded-[24px] bg-gradient-to-br from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-5">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[24px] pointer-events-none" />

                <div className="relative flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {currentPoll.type === 'song' ? (
                        <Music className="w-6 h-6 text-[#1DB954]" strokeWidth={2} />
                      ) : (
                        <Tv className="w-6 h-6 text-[#E50914]" strokeWidth={2} />
                      )}
                      <h2 className="text-lg font-bold">{currentPoll.question}</h2>
                    </div>
                    <p className="text-xs text-white/50">Ends: {currentPoll.endsAt}</p>
                  </div>

                  <button
                    onClick={handleShare}
                    className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <Share2 className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>

            {isLoading && (
              <div className="text-sm text-white/60 text-center py-2">Refreshing live poll data...</div>
            )}

            <div className="space-y-3">
              {currentPoll.options.map((option, index) => {
                const percentage = getVotePercentage(option.votes, currentPoll.totalVotes);
                const hasVoted = voted.includes(currentPoll.id);

                return (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => !hasVoted && void handleVote(option.id)}
                    className={`relative w-full overflow-hidden rounded-[20px] p-[1px] transition-all cursor-pointer ${
                      hasVoted
                        ? 'bg-gradient-to-b from-white/15 to-white/5'
                        : 'bg-gradient-to-b from-white/20 to-white/5 hover:from-white/30 hover:to-white/10'
                    }`}
                  >
                    <div className="relative rounded-[20px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4 overflow-hidden">
                      {hasVoted && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#3b9eff]/30 to-[#8b5cf6]/20 rounded-[20px]"
                        />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent rounded-[20px] pointer-events-none" />

                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              currentPoll.type === 'song'
                                ? 'bg-gradient-to-br from-[#1DB954] to-[#1aa34a]'
                                : 'bg-gradient-to-br from-[#E50914] to-[#b20710]'
                            } shadow-[0_4px_16px_rgba(59,158,255,0.3)]`}
                          >
                            {currentPoll.type === 'song' ? (
                              <Music className="w-6 h-6 text-white" strokeWidth={2} />
                            ) : (
                              <Tv className="w-6 h-6 text-white" strokeWidth={2} />
                            )}
                          </div>

                          <div className="text-left flex-1">
                            <p className="font-semibold text-sm">{option.title}</p>
                            {option.artist && (
                              <p className="text-xs text-white/50">
                                {option.artist} • {option.year}
                              </p>
                            )}
                            {hasVoted && (
                              <p className="text-xs text-[#3b9eff] font-medium mt-1">
                                {percentage}% • {option.votes} votes
                              </p>
                            )}
                          </div>
                        </div>

                        {option.preview && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.info('Opening Spotify...', { duration: 1500 });
                            }}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                          >
                            <Play className="w-4 h-4 text-white/70" strokeWidth={2} />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="p-4 rounded-[16px] bg-gradient-to-r from-[#8b5cf6]/20 to-[#ec4899]/20 border border-[#8b5cf6]/30">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#8b5cf6] mt-0.5" strokeWidth={2} />
                <div>
                  <p className="text-xs font-semibold mb-1">Your Vibes Profile</p>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Votes update live and shape what the community sees first in culture cards.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'results' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="relative overflow-hidden rounded-[24px] p-[1px] bg-gradient-to-b from-white/25 to-white/10">
              <div className="relative rounded-[24px] bg-gradient-to-br from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-5">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[24px] pointer-events-none" />

                <div className="relative">
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="w-6 h-6 text-[#fbbf24]" strokeWidth={2} />
                    <h3 className="font-bold text-lg">Top Choices</h3>
                  </div>

                  <div className="space-y-3">
                    {leaderboard.map((item) => (
                      <div
                        key={item.rank}
                        className="relative overflow-hidden rounded-[14px] p-[1px] bg-gradient-to-r from-white/10 to-transparent"
                      >
                        <div className="relative rounded-[14px] flex items-center gap-3 p-3 bg-white/5 backdrop-blur-sm">
                          <span
                            className={`text-lg font-bold w-8 ${
                              item.rank === 1
                                ? 'text-[#fbbf24]'
                                : item.rank === 2
                                  ? 'text-gray-300'
                                  : 'text-orange-400'
                            }`}
                          >
                            {item.rank === 1 ? '??' : item.rank === 2 ? '??' : '??'}
                          </span>

                          <div className="flex-1">
                            <p className="text-sm font-semibold">{item.name}</p>
                            <p className="text-xs text-white/50">
                              {item.votes} votes • {item.streak} day streak
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-3">Recent Winners</h3>

              <div className="space-y-3">
                {dailyWinner && (
                  <div className="relative overflow-hidden rounded-[20px] p-[1px] bg-gradient-to-b from-white/20 to-white/5">
                    <div className="relative rounded-[20px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1DB954] to-[#1aa34a] flex items-center justify-center">
                          <Music className="w-6 h-6 text-white" strokeWidth={2} />
                        </div>

                        <div className="flex-1">
                          <p className="text-xs text-white/50 mb-1">Latest Daily Winner</p>
                          <p className="font-semibold text-sm">{dailyWinner.title}</p>
                          <p className="text-xs text-green-400">
                            {getVotePercentage(dailyWinner.votes, dailySongPoll?.totalVotes || 0)}% votes ({dailyWinner.votes} total)
                          </p>
                        </div>

                        <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10">
                          <Play className="w-4 h-4" strokeWidth={2} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {monthlyWinner && (
                  <div className="relative overflow-hidden rounded-[20px] p-[1px] bg-gradient-to-b from-white/20 to-white/5">
                    <div className="relative rounded-[20px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E50914] to-[#b20710] flex items-center justify-center">
                          <Tv className="w-6 h-6 text-white" strokeWidth={2} />
                        </div>

                        <div className="flex-1">
                          <p className="text-xs text-white/50 mb-1">Latest Monthly Winner</p>
                          <p className="font-semibold text-sm">{monthlyWinner.title}</p>
                          <p className="text-xs text-green-400">
                            {getVotePercentage(monthlyWinner.votes, monthlySeries?.totalVotes || 0)}% votes ({monthlyWinner.votes} total)
                          </p>
                        </div>

                        <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10">
                          <Play className="w-4 h-4" strokeWidth={2} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {!currentPoll && !isLoading && (
          <div className="text-center py-12">
            <p className="text-white/50 mb-2">No active polls found</p>
            <p className="text-sm text-white/30">Check back shortly for new community votes.</p>
          </div>
        )}
      </div>
    </div>
  );
}
