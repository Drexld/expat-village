import { Trophy, Flame, TrendingUp, Award, Star, CheckCircle2, Crown, Zap, Users, Calendar } from 'lucide-react';

interface ProfileProps {
  user: {
    name: string;
    level: string;
    points: number;
    streak: number;
    completedTasks: number;
    totalTasks: number;
    badges: string[];
  };
}

const allBadges = [
  { id: 'early-adopter', icon: Star, title: 'Early Adopter', description: 'Beta user', color: 'from-[#8b5cf6] to-[#7c3aed]', earned: true },
  { id: 'first-steps', icon: CheckCircle2, title: 'First Steps', description: 'Completed profile', color: 'from-[#3b82f6] to-[#2563eb]', earned: true },
  { id: 'week-one', icon: Calendar, title: 'Week One', description: 'First week tasks', color: 'from-[#10b981] to-[#059669]', earned: true },
  { id: 'month-one', icon: Trophy, title: 'Month One', description: 'First month tasks', color: 'from-[#f59e0b] to-[#d97706]', earned: false },
  { id: 'streak-7', icon: Flame, title: '7-Day Streak', description: 'Daily activity', color: 'from-[#ff6b9d] to-[#ff8e53]', earned: true },
  { id: 'helpful', icon: Users, title: 'Helpful', description: '10 forum replies', color: 'from-[#ec4899] to-[#db2777]', earned: false },
  { id: 'settler', icon: Award, title: 'Settler', description: '50% checklist done', color: 'from-[#06b6d4] to-[#0891b2]', earned: false },
  { id: 'village-elder', icon: Crown, title: 'Village Elder', description: 'Legendary status', color: 'from-[#fbbf24] to-[#f59e0b]', earned: false }
];

const levels = [
  { name: 'Newcomer', minPoints: 0, color: 'from-[#94a3b8] to-[#64748b]' },
  { name: 'Settled', minPoints: 500, color: 'from-[#3b82f6] to-[#2563eb]' },
  { name: 'Local', minPoints: 1500, color: 'from-[#10b981] to-[#059669]' },
  { name: 'Village Elder', minPoints: 3500, color: 'from-[#fbbf24] to-[#f59e0b]' }
];

export function Profile({ user }: ProfileProps) {
  const currentLevelIndex = levels.findIndex(l => user.points >= l.minPoints && 
    (levels[levels.indexOf(l) + 1]?.minPoints > user.points || !levels[levels.indexOf(l) + 1]));
  
  const currentLevel = levels[currentLevelIndex];
  const nextLevel = levels[currentLevelIndex + 1];
  const progressToNext = nextLevel 
    ? ((user.points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100;

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="relative px-5 pt-12 pb-8">
        <div className="relative flex flex-col items-center">
          {/* Avatar with glow */}
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-[#3b9eff] to-[#0066cc] rounded-full blur-xl opacity-50"></div>
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#3b9eff] to-[#0066cc] flex items-center justify-center text-4xl font-bold shadow-[inset_0_2px_0_rgba(255,255,255,0.3),0_8px_24px_rgba(59,158,255,0.4)]">
              {user.name[0]}
            </div>
            <div className="absolute -bottom-2 -right-2">
              <div className="absolute inset-0 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-full blur-md opacity-50"></div>
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_12px_rgba(245,158,11,0.4)]">
                <Trophy className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-[20px] font-bold mb-1">{user.name}</h1>
          <p className="text-[#3b9eff] font-semibold text-[13px] mb-4">{user.level}</p>
          
          {/* Stats */}
          <div className="flex items-center gap-6 mb-6">
            <div className="text-center">
              <p className="text-[22px] font-bold">{user.points}</p>
              <p className="text-[12px] text-white/50">Points</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-[22px] font-bold flex items-center gap-1 justify-center">
                <Flame className="w-5 h-5 text-[#ff6b9d]" />
                {user.streak}
              </p>
              <p className="text-[12px] text-white/50">Day Streak</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-[22px] font-bold">#247</p>
              <p className="text-[12px] text-white/50">Rank</p>
            </div>
          </div>

          {/* Level Progress */}
          <div className="w-full rounded-[24px] bg-gradient-to-b from-[#1a2642] via-[#14203a] to-[#0f1829] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.4)] p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-semibold">{currentLevel.name}</span>
              {nextLevel && (
                <span className="text-[13px] text-white/50">
                  {user.points} / {nextLevel.minPoints}
                </span>
              )}
            </div>
            
            <div className="w-full h-3 bg-[#0a0f1a] rounded-full overflow-hidden mb-2 shadow-inner">
              <div
                className={`h-full bg-gradient-to-r ${currentLevel.color} rounded-full shadow-[0_0_12px_rgba(59,158,255,0.6)] transition-all duration-500`}
                style={{ width: `${progressToNext}%` }}
              />
            </div>
            
            {nextLevel && (
              <p className="text-[12px] text-white/50 text-center">
                {nextLevel.minPoints - user.points} points to {nextLevel.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="px-5 mb-8">
        <h2 className="text-[17px] font-semibold mb-4">Badges</h2>
        <div className="grid grid-cols-3 gap-3">
          {allBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.id}
                className={`relative overflow-hidden rounded-[20px] p-4 flex flex-col items-center text-center ${
                  badge.earned
                    ? 'bg-gradient-to-b from-[#1a2642] via-[#14203a] to-[#0f1829] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.3)]'
                    : 'bg-gradient-to-b from-[#0f1829] to-[#0a0f1a] shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)] opacity-40'
                }`}
              >
                <div className={`w-12 h-12 rounded-[14px] bg-gradient-to-br ${badge.color} flex items-center justify-center mb-2 shadow-[0_4px_12px_rgba(0,0,0,0.3)]`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-[12px] font-semibold mb-1">{badge.title}</p>
                <p className="text-[10px] text-white/50">{badge.description}</p>
                {badge.earned && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Summary */}
      <div className="px-5">
        <h2 className="text-[17px] font-semibold mb-4">Activity Summary</h2>
        <div className="space-y-3">
          <div className="rounded-[20px] bg-gradient-to-b from-[#1a2642] via-[#14203a] to-[#0f1829] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.3)] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-[#3b82f6] to-[#2563eb] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-[13px]">Checklist Progress</p>
                <p className="text-[12px] text-white/50">{user.completedTasks} of {user.totalTasks} tasks</p>
              </div>
            </div>
            <span className="text-[17px] font-bold">{Math.round((user.completedTasks / user.totalTasks) * 100)}%</span>
          </div>

          <div className="rounded-[20px] bg-gradient-to-b from-[#1a2642] via-[#14203a] to-[#0f1829] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.3)] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-[#ff6b9d] to-[#ff8e53] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-[13px]">Warsaw Daily</p>
                <p className="text-[12px] text-white/50">Current streak</p>
              </div>
            </div>
            <span className="text-[17px] font-bold">{user.streak} days</span>
          </div>

          <div className="rounded-[20px] bg-gradient-to-b from-[#1a2642] via-[#14203a] to-[#0f1829] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.3)] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-[13px]">Community</p>
                <p className="text-[12px] text-white/50">Forum contributions</p>
              </div>
            </div>
            <span className="text-[17px] font-bold">12</span>
          </div>
        </div>
      </div>
    </div>
  );
}
