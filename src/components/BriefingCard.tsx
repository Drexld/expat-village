import { Cloud, TrendingUp, ExternalLink } from 'lucide-react';

interface BriefingCardProps {
  onOpenBriefing: () => void;
}

export function BriefingCard({ onOpenBriefing }: BriefingCardProps) {
  const temp = -3;
  const suggestion = temp < 5 
    ? { message: "Perfect weather for a hot chocolate", cafe: "Cafe Relaks", emoji: "☕" }
    : { message: "Great day for iced coffee", cafe: "Cafe Karma", emoji: "🧊" };

  return (
    <div className="relative rounded-[24px] p-[1px] bg-gradient-to-b from-white/20 via-white/5 to-transparent">
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-b from-[#1a2642]/85 via-[#14203a]/90 to-[#0f1829]/95 backdrop-blur-xl p-5">
        {/* Glossy overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent rounded-[24px] pointer-events-none" />
        
        {/* Subtle ambient glow */}
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-[#2d7dd2] rounded-full opacity-15 blur-[100px] pointer-events-none" />
        
        {/* Inner highlight */}
        <div className="absolute inset-0 rounded-[24px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.25)] pointer-events-none" />

        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Your Daily Pulse</h3>
            <button
              onClick={onOpenBriefing}
              className="relative rounded-full p-[1px] bg-gradient-to-b from-white/25 via-white/10 to-transparent group"
            >
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-b from-[#2d5a8c]/80 to-[#1a3a5f]/90 backdrop-blur-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] text-xs font-semibold text-white transition-all group-hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_16px_rgba(59,158,255,0.3)] active:scale-95">
                Open Briefing
                <ExternalLink className="w-3 h-3" strokeWidth={2.5} />
              </div>
            </button>
          </div>

          {/* Weather Section */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/[0.08]">
            <div className="relative w-12 h-12 rounded-full p-[1px] bg-gradient-to-b from-white/20 to-white/5">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#2d4a7c]/50 to-[#1e3a5f]/70 backdrop-blur-sm flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
                <Cloud className="w-6 h-6 text-white/90 drop-shadow-sm" strokeWidth={1.5} />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-2xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">{temp}°C</div>
              <p className="text-xs text-white/50">Overcast Clouds</p>
            </div>
          </div>

          {/* Cafe Suggestion */}
          <div className="mb-4 pb-4 border-b border-white/[0.08]">
            <div className="flex items-start gap-2">
              <span className="text-lg">{suggestion.emoji}</span>
              <div>
                <p className="text-sm text-white/90 font-medium mb-0.5">{suggestion.message}</p>
                <p className="text-xs text-white/50">from <span className="text-[#3b9eff] drop-shadow-[0_0_8px_rgba(59,158,255,0.4)]">{suggestion.cafe}</span></p>
              </div>
            </div>
          </div>

          {/* Exchange Rate */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-sm flex items-center justify-center border border-green-400/20">
                <TrendingUp className="w-3.5 h-3.5 text-green-400 drop-shadow-[0_0_4px_rgba(34,197,94,0.5)]" strokeWidth={2} />
              </div>
              <span className="text-xs text-white/50">USD → PLN</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]">4.05</span>
              <span className="text-xs text-green-400/60">+0.02</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
