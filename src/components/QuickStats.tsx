import { CheckCircle2, TrendingUp, Award, Users } from 'lucide-react';

interface QuickStatsProps {
  user: {
    completedTasks: number;
    totalTasks: number;
    points: number;
    streak: number;
  };
}

export function QuickStats({ user }: QuickStatsProps) {
  const progress = Math.round((user.completedTasks / user.totalTasks) * 100);

  const stats = [
    {
      icon: CheckCircle2,
      label: 'Tasks',
      value: `${user.completedTasks}/${user.totalTasks}`,
      color: 'from-[#10b981] to-[#059669]'
    },
    {
      icon: TrendingUp,
      label: 'Points',
      value: user.points,
      color: 'from-[#3b82f6] to-[#2563eb]'
    },
    {
      icon: Award,
      label: 'Progress',
      value: `${progress}%`,
      color: 'from-[#f59e0b] to-[#d97706]'
    },
    {
      icon: Users,
      label: 'Rank',
      value: '#247',
      color: 'from-[#ec4899] to-[#db2777]'
    }
  ];

  return (
    <div>
      <h2 className="text-[17px] font-semibold mb-4">Your Progress</h2>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="relative overflow-hidden rounded-[24px] bg-gradient-to-b from-[#1a2642] via-[#14203a] to-[#0f1829] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.3)] p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.3)]`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-[22px] font-bold mb-1">{stat.value}</p>
              <p className="text-[13px] text-white/50">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
