import { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Camera,
  CheckCircle2,
  Compass,
  Flame,
  MapPin,
  Star,
  Trophy,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getFlavorChallenges,
  getFlavorCommunityActivity,
  getFlavorLeaderboard,
  getFlavorRestaurants,
  getTodayCuisineDay,
} from '../services/flavorDays/service';

export function FlavorDays() {
  const today = useMemo(() => getTodayCuisineDay(), []);
  const restaurants = useMemo(() => getFlavorRestaurants(today.cuisine), [today.cuisine]);
  const activity = useMemo(() => getFlavorCommunityActivity(), []);
  const challenges = useMemo(() => getFlavorChallenges(), []);
  const leaderboard = useMemo(() => getFlavorLeaderboard(), []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#0a0e1a] to-[#000000] text-white">
      <div className="px-5 pt-6 pb-24 space-y-4">
        <div className="relative rounded-[24px] p-[1px] bg-gradient-to-b from-[#10b981]/35 to-[#059669]/10">
          <div className="relative rounded-[24px] bg-gradient-to-br from-[#1a2642]/90 to-[#0f172a]/95 p-5">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[24px] pointer-events-none" />
            <div className="relative flex items-start gap-3">
              <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center shadow-[0_4px_18px_rgba(16,185,129,0.4)]">
                <span className="text-2xl">{today.emoji}</span>
              </div>
              <div className="flex-1">
                <p className="text-xs text-green-300/90 mb-1">{today.dateLabel}</p>
                <h2 className="text-lg font-bold mb-1">Flavor Day: {today.cuisine}</h2>
                <p className="text-xs text-white/60 mb-2">{today.vibe}</p>
                <p className="text-[11px] text-white/50">{today.funFact}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold">Partner Restaurants</h3>
            <button
              onClick={() =>
                toast.success('Dining group options loaded', {
                  description: '3 groups available in your area.',
                })
              }
              className="text-xs text-[#10b981] font-semibold"
            >
              Join Dining Group
            </button>
          </div>

          <div className="space-y-3">
            {restaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07 }}
                className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-white/15 to-white/5"
              >
                <div className="relative rounded-[20px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 p-3">
                  <div className="flex gap-3">
                    <div className="relative w-24 h-20 rounded-[12px] overflow-hidden bg-white/5">
                      <img src={restaurant.photo} alt={restaurant.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold">{restaurant.name}</p>
                        {restaurant.verified && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-bold">
                            VERIFIED
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-white/50 mb-1">
                        <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                        <span>{restaurant.district}</span>
                        <span>•</span>
                        <span>{restaurant.distanceKm.toFixed(1)} km</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] mb-2">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" strokeWidth={2} />
                        <span className="text-white/80">{restaurant.rating.toFixed(1)}</span>
                        <span className="text-[#3b9eff]">Expat {restaurant.expatScore.toFixed(1)}/10</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] font-semibold">
                          {restaurant.discount}
                        </span>
                        <button
                          onClick={() =>
                            toast.success(`Route opened for ${restaurant.name}`, {
                              description: 'Navigation + check-in rewards enabled.',
                            })
                          }
                          className="text-xs text-[#3b9eff] font-semibold"
                        >
                          Navigate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="relative rounded-[18px] p-[1px] bg-gradient-to-b from-white/15 to-white/5">
            <div className="relative rounded-[18px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 p-3">
              <div className="flex items-center gap-2 mb-1">
                <Camera className="w-4 h-4 text-[#3b9eff]" strokeWidth={2} />
                <p className="text-xs font-semibold">Photo Mission</p>
              </div>
              <p className="text-[11px] text-white/60 mb-2">Post your meal in Town Hall to earn +12 points.</p>
              <button
                onClick={() =>
                  toast.success('Photo flow launched', { description: 'Tag #FlavorDay to score bonus points.' })
                }
                className="w-full py-2 rounded-[10px] bg-[#3b9eff]/20 text-[#3b9eff] text-xs font-semibold"
              >
                Upload Photo
              </button>
            </div>
          </div>

          <div className="relative rounded-[18px] p-[1px] bg-gradient-to-b from-white/15 to-white/5">
            <div className="relative rounded-[18px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 p-3">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-[#8b5cf6]" strokeWidth={2} />
                <p className="text-xs font-semibold">Community Pulse</p>
              </div>
              <p className="text-[11px] text-white/60 mb-2">42 expats active in Flavor Days now.</p>
              <button
                onClick={() =>
                  toast.success('Town Hall thread opened', {
                    description: 'Flavor Day discussion is live.',
                  })
                }
                className="w-full py-2 rounded-[10px] bg-[#8b5cf6]/20 text-[#8b5cf6] text-xs font-semibold"
              >
                Open Thread
              </button>
            </div>
          </div>
        </div>

        <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-[#f59e0b]/30 to-[#d97706]/10">
          <div className="relative rounded-[20px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-5 h-5 text-amber-400" strokeWidth={2} />
              <h3 className="text-sm font-bold">Flavor Challenges</h3>
            </div>
            <div className="space-y-2">
              {challenges.map((challenge) => {
                const percentage = Math.round((challenge.progress / challenge.total) * 100);
                return (
                  <div key={challenge.id} className="p-3 rounded-[12px] bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold">{challenge.title}</p>
                      <span className="text-[10px] text-amber-300 font-bold">+{challenge.rewardPoints}</span>
                    </div>
                    <p className="text-[11px] text-white/60 mb-2">{challenge.description}</p>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-1">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        className="h-full bg-gradient-to-r from-[#f59e0b] to-[#10b981]"
                      />
                    </div>
                    <p className="text-[10px] text-white/50">
                      {challenge.progress}/{challenge.total} completed
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-white/15 to-white/5">
          <div className="relative rounded-[20px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-[#3b9eff]" strokeWidth={2} />
              <h3 className="text-sm font-bold">Flavor Leaderboard</h3>
            </div>
            <div className="space-y-2">
              {leaderboard.map((entry, index) => (
                <div key={entry.id} className="p-2.5 rounded-[12px] bg-white/5 border border-white/10 flex items-center gap-2">
                  <span className="w-5 text-xs text-white/70 font-bold">{index + 1}</span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3b9eff] to-[#8b5cf6] flex items-center justify-center text-xs font-bold">
                    {entry.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{entry.name}</p>
                    <p className="text-[10px] text-white/50">{entry.badges} badges</p>
                  </div>
                  <span className="text-xs font-bold text-[#10b981]">{entry.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative rounded-[16px] p-[1px] bg-gradient-to-b from-white/10 to-white/5">
          <div className="relative rounded-[16px] bg-gradient-to-b from-[#1a2642]/80 to-[#0f172a]/90 p-3">
            <p className="text-[11px] text-white/60 leading-relaxed">
              <CheckCircle2 className="w-3.5 h-3.5 inline mr-1 text-[#10b981]" />
              Flavor Days is wired to partner-ready flows: discounts, activity feed, challenge progression, and leaderboard rewards.
            </p>
            <button
              onClick={() =>
                toast.success('Partnership pack generated', {
                  description: 'Restaurant onboarding and performance summary ready.',
                })
              }
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#3b9eff]"
            >
              <Compass className="w-3.5 h-3.5" strokeWidth={2} />
              Open Partnership Dashboard
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold mb-2">Live Activity</h3>
          <div className="space-y-2">
            {activity.map((item) => (
              <div key={item.id} className="p-2.5 rounded-[12px] bg-white/5 border border-white/10 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3b9eff] to-[#8b5cf6] flex items-center justify-center text-xs font-bold">
                  {item.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/80">
                    <span className="font-semibold">{item.user}</span> {item.action}
                  </p>
                  <p className="text-[10px] text-white/50">{item.timestamp}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] font-semibold">
                  +{item.points}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

