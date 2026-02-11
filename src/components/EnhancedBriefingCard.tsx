import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cloud, TrendingUp, ChevronDown, Sparkles } from 'lucide-react';

interface EnhancedBriefingCardProps {
  onOpenBriefing: () => void;
}

export function EnhancedBriefingCard({ onOpenBriefing }: EnhancedBriefingCardProps) {
  const [expanded, setExpanded] = useState(false);
  const temp = -3;
  const suggestion = temp < 5 
    ? { message: "Perfect weather for a hot chocolate", cafe: "Cafe Relaks", emoji: "☕", photo: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop" }
    : { message: "Great day for iced coffee", cafe: "Cafe Karma", emoji: "🧊", photo: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop" };

  const exchangeRate = 4.05;
  const exchangeChange = +0.02;

  return (
    <div className="relative rounded-[24px] p-[1px] bg-gradient-to-b from-white/20 via-white/5 to-transparent">
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-b from-[#1a2642]/85 via-[#14203a]/90 to-[#0f1829]/95 backdrop-blur-xl">
        {/* Glossy overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent rounded-[24px] pointer-events-none" />
        
        {/* Subtle ambient glow */}
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-[#2d7dd2] rounded-full opacity-15 blur-[100px] pointer-events-none" />
        
        {/* Inner highlight */}
        <div className="absolute inset-0 rounded-[24px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.25)] pointer-events-none" />

        <div className="relative p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Your Daily Pulse</h3>
            <button
              onClick={onOpenBriefing}
              className="relative rounded-full p-[1px] bg-gradient-to-b from-white/25 via-white/10 to-transparent group"
            >
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-b from-[#2d5a8c]/80 to-[#1a3a5f]/90 backdrop-blur-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] text-xs font-semibold text-white transition-all group-hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_16px_rgba(59,158,255,0.3)] active:scale-95">
                Full Briefing
              </div>
            </button>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* Weather (Left) - Animated */}
            <div className="relative rounded-[16px] p-[1px] bg-gradient-to-b from-white/15 to-white/5">
              <div className="relative overflow-hidden rounded-[16px] bg-gradient-to-br from-[#2d4a7c]/50 to-[#1e3a5f]/70 backdrop-blur-sm p-4 h-full">
                <div className="absolute inset-0 rounded-[16px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] pointer-events-none" />
                
                {/* Animated clouds */}
                <motion.div
                  animate={{ x: [0, 10, 0], y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="mb-2"
                >
                  <Cloud className="w-8 h-8 text-white/90 drop-shadow-sm" strokeWidth={1.5} />
                </motion.div>
                
                <div className="text-3xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] mb-1">{temp}°C</div>
                <p className="text-[10px] text-white/60">Overcast</p>
              </div>
            </div>

            {/* Cafe Suggestion (Right) - With Photo */}
            <div className="relative rounded-[16px] p-[1px] bg-gradient-to-b from-white/15 to-white/5">
              <div className="relative overflow-hidden rounded-[16px] h-full">
                {/* Background cafe photo */}
                <img 
                  src={suggestion.photo} 
                  alt={suggestion.cafe}
                  className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1829]/95 via-[#1a2642]/80 to-transparent" />
                
                <div className="relative p-4 h-full flex flex-col justify-end">
                  <div className="text-xl mb-1">{suggestion.emoji}</div>
                  <p className="text-xs font-semibold leading-tight mb-0.5">{suggestion.message}</p>
                  <p className="text-[10px] text-[#3b9eff] drop-shadow-[0_0_8px_rgba(59,158,255,0.4)]">{suggestion.cafe}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Exchange Rate Ticker */}
          <div className="flex items-center justify-between py-2.5 px-3 rounded-[12px] bg-white/5 border border-white/5 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-sm flex items-center justify-center border border-green-400/20">
                <TrendingUp className="w-3 h-3 text-green-400 drop-shadow-[0_0_4px_rgba(34,197,94,0.5)]" strokeWidth={2} />
              </div>
              <span className="text-xs text-white/60">USD → PLN</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]">{exchangeRate}</span>
              <span className="text-[10px] text-green-400/70">+{exchangeChange}</span>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-1 rounded-full bg-green-400"
              />
            </div>
          </div>

          {/* Expandable AI Summary */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between py-2 px-3 rounded-[12px] bg-gradient-to-b from-[#2d5a8c]/30 to-[#1a3a5f]/20 border border-[#3b9eff]/20 hover:border-[#3b9eff]/40 transition-all"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#3b9eff]" strokeWidth={2} />
              <span className="text-xs text-white/80 font-medium">Today's AI Brief</span>
            </div>
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-white/50" strokeWidth={2} />
            </motion.div>
          </button>

          {/* Expanded Content */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-3 space-y-2">
                  <div className="p-3 rounded-[12px] bg-white/5 border border-white/5">
                    <p className="text-xs text-white/70 leading-relaxed">
                      💱 <span className="font-semibold text-white/90">PLN is up today!</span> Good time to transfer funds. Consider using Wise or Revolut for best rates.
                    </p>
                  </div>
                  <div className="p-3 rounded-[12px] bg-white/5 border border-white/5">
                    <p className="text-xs text-white/70 leading-relaxed">
                      🏛️ <span className="font-semibold text-white/90">PESEL offices open</span> until 6 PM today. Book your appointment before slots fill up!
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
