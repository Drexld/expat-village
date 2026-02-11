import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Tv, Play, TrendingUp, Trophy, Share2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Poll {
  id: string;
  type: 'song' | 'series';
  question: string;
  options: {
    id: string;
    title: string;
    artist?: string;
    year?: string;
    votes: number;
    preview?: string;
  }[];
  totalVotes: number;
  endsAt: string;
}

export function VillageVibes() {
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly' | 'results'>('daily');
  const [voted, setVoted] = useState<string[]>([]);

  const dailySongPoll: Poll = {
    id: 'daily-song-1',
    type: 'song',
    question: 'Song of the Day',
    options: [
      { id: '1', title: '5/6', artist: 'Daria Zawiałow', year: '2019', votes: 342, preview: 'spotify' },
      { id: '2', title: 'Wehikuł Czasu', artist: 'Dawid Podsiadło', year: '2018', votes: 287, preview: 'spotify' },
      { id: '3', title: 'Lubię', artist: 'C-BooL', year: '2015', votes: 198, preview: 'spotify' },
      { id: '4', title: 'Jestem Bogiem', artist: 'Paktofonika', year: '2000', votes: 156, preview: 'spotify' },
    ],
    totalVotes: 983,
    endsAt: 'Tonight at 23:59'
  };

  const monthlySeries: Poll = {
    id: 'monthly-series-1',
    type: 'series',
    question: 'Series of the Month - February',
    options: [
      { id: '1', title: 'The Office (US)', year: '2005', votes: 456 },
      { id: '2', title: 'Breaking Bad', year: '2008', votes: 389 },
      { id: '3', title: 'Stranger Things', year: '2016', votes: 298 },
      { id: '4', title: 'The Crown', year: '2016', votes: 234 },
    ],
    totalVotes: 1377,
    endsAt: 'Feb 28, 2026'
  };

  const currentPoll = activeTab === 'daily' ? dailySongPoll : activeTab === 'monthly' ? monthlySeries : dailySongPoll;

  const leaderboard = [
    { rank: 1, name: 'Sarah M.', votes: 89, streak: 28 },
    { rank: 2, name: 'You', votes: 67, streak: 7 },
    { rank: 3, name: 'Luca R.', votes: 54, streak: 14 },
  ];

  const handleVote = (optionId: string) => {
    if (voted.includes(currentPoll.id)) {
      toast.error('Already voted!', {
        description: 'Come back tomorrow for new polls',
        duration: 2000,
      });
      return;
    }

    setVoted([...voted, currentPoll.id]);
    
    toast.success('🎉 Vote submitted!', {
      description: '+3 points earned',
      duration: 2000,
    });

    if ('vibrate' in navigator) {
      navigator.vibrate([30, 50, 30]);
    }

    // Show winner prediction
    setTimeout(() => {
      const winner = currentPoll.options.reduce((prev, current) => 
        prev.votes > current.votes ? prev : current
      );
      
      if (currentPoll.type === 'song') {
        toast.info('🎵 Trending winner', {
          description: `"${winner.title}" by ${winner.artist} - Play on Spotify?`,
          duration: 4000,
        });
      }
    }, 1000);
  };

  const handleShare = () => {
    toast.success('📤 Shared with friends!', {
      description: '+5 bonus points',
      duration: 2000,
    });
  };

  const getVotePercentage = (votes: number) => {
    return Math.round((votes / currentPoll.totalVotes) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#0a0e1a] to-[#000000] text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 px-5 pt-8 pb-4 backdrop-blur-xl bg-gradient-to-b from-[#000000] to-transparent">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold">Village Vibes</h1>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl"
            >
              🎭
            </motion.div>
          </div>
          <p className="text-sm text-white/50">Shape our community culture together</p>
        </div>

        {/* Tabs */}
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
              {tab === 'daily' && '🎵 '}
              {tab === 'monthly' && '📺 '}
              {tab === 'results' && '🏆 '}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Live Stats */}
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
              <p className="text-xl font-bold text-green-400">847</p>
            </div>
            <p className="text-[10px] text-white/50 uppercase tracking-wide">Live Now</p>
          </div>
          <div className="p-3 rounded-[12px] bg-white/5 border border-white/5 text-center">
            <p className="text-xl font-bold text-[#ff6b9d]">7</p>
            <p className="text-[10px] text-white/50 uppercase tracking-wide">Your Streak</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-24">
        {/* Poll Section */}
        {(activeTab === 'daily' || activeTab === 'monthly') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Poll Header */}
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

            {/* Poll Options */}
            <div className="space-y-3">
              {currentPoll.options.map((option, index) => {
                const percentage = getVotePercentage(option.votes);
                const hasVoted = voted.includes(currentPoll.id);
                
                return (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => !hasVoted && handleVote(option.id)}
                    className={`relative w-full overflow-hidden rounded-[20px] p-[1px] transition-all cursor-pointer ${
                      hasVoted 
                        ? 'bg-gradient-to-b from-white/15 to-white/5' 
                        : 'bg-gradient-to-b from-white/20 to-white/5 hover:from-white/30 hover:to-white/10'
                    }`}
                  >
                    <div className="relative rounded-[20px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4 overflow-hidden">
                      {/* Animated vote bar */}
                      {hasVoted && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#3b9eff]/30 to-[#8b5cf6]/20 rounded-[20px]"
                        />
                      )}

                      {/* Glossy overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent rounded-[20px] pointer-events-none" />
                      
                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            currentPoll.type === 'song'
                              ? 'bg-gradient-to-br from-[#1DB954] to-[#1aa34a]'
                              : 'bg-gradient-to-br from-[#E50914] to-[#b20710]'
                          } shadow-[0_4px_16px_rgba(59,158,255,0.3)]`}>
                            {currentPoll.type === 'song' ? (
                              <Music className="w-6 h-6 text-white" strokeWidth={2} />
                            ) : (
                              <Tv className="w-6 h-6 text-white" strokeWidth={2} />
                            )}
                          </div>

                          <div className="text-left flex-1">
                            <p className="font-semibold text-sm">{option.title}</p>
                            {option.artist && (
                              <p className="text-xs text-white/50">{option.artist} • {option.year}</p>
                            )}
                            {hasVoted && (
                              <p className="text-xs text-[#3b9eff] font-medium mt-1">{percentage}% • {option.votes} votes</p>
                            )}
                          </div>
                        </div>

                        {option.preview && (
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.info('🎵 Opening Spotify...', { duration: 1500 });
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

            {/* AI Insight */}
            <div className="p-4 rounded-[16px] bg-gradient-to-r from-[#8b5cf6]/20 to-[#ec4899]/20 border border-[#8b5cf6]/30">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#8b5cf6] mt-0.5" strokeWidth={2} />
                <div>
                  <p className="text-xs font-semibold mb-1">Your Vibes Profile</p>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Based on votes: You love Polish indie! We've added similar tracks to your home playlist.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results/Leaderboard */}
        {activeTab === 'results' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Top Voter Leaderboard */}
            <div className="relative overflow-hidden rounded-[24px] p-[1px] bg-gradient-to-b from-white/25 to-white/10">
              <div className="relative rounded-[24px] bg-gradient-to-br from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-5">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[24px] pointer-events-none" />
                
                <div className="relative">
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="w-6 h-6 text-[#fbbf24]" strokeWidth={2} />
                    <h3 className="font-bold text-lg">Top Voters</h3>
                  </div>

                  <div className="space-y-3">
                    {leaderboard.map((voter) => (
                      <div
                        key={voter.rank}
                        className={`relative overflow-hidden rounded-[14px] p-[1px] ${
                          voter.name === 'You' 
                            ? 'bg-gradient-to-r from-[#3b9eff]/40 to-transparent' 
                            : 'bg-gradient-to-r from-white/10 to-transparent'
                        }`}
                      >
                        <div className={`relative rounded-[14px] flex items-center gap-3 p-3 ${
                          voter.name === 'You' 
                            ? 'bg-gradient-to-r from-[#3b9eff]/15 to-transparent backdrop-blur-sm' 
                            : 'bg-white/5 backdrop-blur-sm'
                        }`}>
                          <span className={`text-lg font-bold w-8 ${
                            voter.rank === 1 ? 'text-[#fbbf24]' : 
                            voter.rank === 2 ? 'text-gray-300' : 
                            'text-orange-400'
                          }`}>
                            {voter.rank === 1 ? '🥇' : voter.rank === 2 ? '🥈' : '🥉'}
                          </span>

                          <div className="flex-1">
                            <p className="text-sm font-semibold">{voter.name}</p>
                            <p className="text-xs text-white/50">{voter.votes} votes • {voter.streak} day streak</p>
                          </div>

                          {voter.name === 'You' && (
                            <span className="px-2 py-1 rounded-full bg-[#3b9eff]/20 text-[#3b9eff] text-xs font-bold">
                              YOU
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Past Winners */}
            <div>
              <h3 className="font-bold mb-3">Recent Winners</h3>
              
              <div className="space-y-3">
                <div className="relative overflow-hidden rounded-[20px] p-[1px] bg-gradient-to-b from-white/20 to-white/5">
                  <div className="relative rounded-[20px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1DB954] to-[#1aa34a] flex items-center justify-center">
                        <Music className="w-6 h-6 text-white" strokeWidth={2} />
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-xs text-white/50 mb-1">Yesterday's Song</p>
                        <p className="font-semibold text-sm">5/6 - Daria Zawiałow</p>
                        <p className="text-xs text-green-400">35% votes (342 total)</p>
                      </div>

                      <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10">
                        <Play className="w-4 h-4" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[20px] p-[1px] bg-gradient-to-b from-white/20 to-white/5">
                  <div className="relative rounded-[20px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E50914] to-[#b20710] flex items-center justify-center">
                        <Tv className="w-6 h-6 text-white" strokeWidth={2} />
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-xs text-white/50 mb-1">January's Series</p>
                        <p className="font-semibold text-sm">The Office (US)</p>
                        <p className="text-xs text-green-400">33% votes (456 total)</p>
                      </div>

                      <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10">
                        <Play className="w-4 h-4" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}