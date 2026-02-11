import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cloud, TrendingUp, ChevronDown, Sparkles, ArrowUpRight, Zap, MapPin } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PremiumDailyPulseProps {
  onOpenBriefing: () => void;
  userMood?: string;
}

export function PremiumDailyPulse({ onOpenBriefing, userMood }: PremiumDailyPulseProps) {
  const [expandedAI, setExpandedAI] = useState(false);
  const [showExchange, setShowExchange] = useState(false);
  
  const temp = -3;
  const exchangeRate = 4.05;
  const exchangeChange = +0.02;
  const exchangeTrend = 'up';
  
  // Mood-adaptive suggestions
  const getSuggestion = () => {
    if (userMood === 'homesick') {
      return {
        message: "Comfort food time: Polish hospitality",
        cafe: "Cafe Vinyl",
        emoji: "🏠",
        photo: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop",
        tag: "Cozy vibes"
      };
    } else if (userMood === 'adventurous') {
      return {
        message: "Hidden gem: Praga district cafe",
        cafe: "Kawiarnia Kafka",
        emoji: "✨",
        photo: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop",
        tag: "Local secret"
      };
    } else if (temp < 5) {
      return {
        message: "Perfect weather for a hot chocolate",
        cafe: "Cafe Relaks",
        emoji: "☕",
        photo: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop",
        tag: "Warm & cozy"
      };
    } else {
      return {
        message: "Great day for iced coffee",
        cafe: "Cafe Karma",
        emoji: "🧊",
        photo: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400&h=300&fit=crop",
        tag: "Refreshing"
      };
    }
  };

  const suggestion = getSuggestion();

  // Warsaw Vibes - Hidden Gems (Premium)
  const hiddenGem = {
    name: "Underrated pierogi spot in Mokotów",
    location: "Pierozki u Vincenta",
    distance: "1.2 km away",
    exclusive: true
  };

  return (
    <div className="relative rounded-[24px] p-[1px] bg-gradient-to-b from-white/25 via-white/10 to-transparent">
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-b from-[#1a2642]/90 via-[#14203a]/95 to-[#0f1829]/98 backdrop-blur-xl">
        {/* Glossy overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[24px] pointer-events-none" />
        
        {/* Subtle ambient glow */}
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-[#2d7dd2] rounded-full opacity-20 blur-[120px] pointer-events-none" />
        
        {/* Inner highlight */}
        <div className="absolute inset-0 rounded-[24px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),inset_0_-1px_2px_rgba(0,0,0,0.25)] pointer-events-none" />

        <div className="relative p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Your Daily Pulse</h3>
            <button
              onClick={onOpenBriefing}
              className="relative rounded-full p-[1px] bg-gradient-to-b from-white/30 via-white/15 to-transparent group"
            >
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-b from-[#2d5a8c]/90 to-[#1a3a5f]/95 backdrop-blur-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] text-xs font-semibold text-white transition-all group-hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_0_20px_rgba(59,158,255,0.4)] active:scale-95">
                Full Briefing
                <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />
              </div>
            </button>
          </div>

          {/* Premium Bento Grid */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* Weather (Left) - Enhanced with animation */}
            <div className="relative rounded-[16px] p-[1px] bg-gradient-to-b from-white/20 to-white/5">
              <div className="relative overflow-hidden rounded-[16px] bg-gradient-to-br from-[#2d4a7c]/60 to-[#1e3a5f]/80 backdrop-blur-md p-4 h-full">
                {/* Inner glow */}
                <div className="absolute inset-0 rounded-[16px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),inset_0_-1px_2px_rgba(0,0,0,0.3)] pointer-events-none" />
                
                {/* Animated clouds */}
                <motion.div
                  animate={{ 
                    x: [0, 8, 0], 
                    y: [0, -4, 0],
                    rotate: [0, 2, 0]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="mb-2"
                >
                  <Cloud className="w-9 h-9 text-white/90 drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]" strokeWidth={1.5} />
                </motion.div>
                
                <div className="text-3xl font-bold drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] mb-1">{temp}°C</div>
                <p className="text-[10px] text-white/70">Overcast & Cold</p>
              </div>
            </div>

            {/* Cafe Suggestion (Right) - With real photo */}
            <div className="relative rounded-[16px] p-[1px] bg-gradient-to-b from-white/20 to-white/5">
              <div className="relative overflow-hidden rounded-[16px] h-full">
                {/* Background cafe photo */}
                <img 
                  src={suggestion.photo} 
                  alt={suggestion.cafe}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1829]/98 via-[#1a2642]/85 to-transparent backdrop-blur-[2px]" />
                
                {/* Inner highlight */}
                <div className="absolute inset-0 rounded-[16px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.15)] pointer-events-none" />
                
                {/* Tag */}
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                  <p className="text-[9px] text-white/90 font-medium">{suggestion.tag}</p>
                </div>
                
                {/* Content */}
                <div className="relative p-4 h-full flex flex-col justify-end">
                  <div className="text-xl mb-1.5">{suggestion.emoji}</div>
                  <p className="text-xs font-semibold leading-tight mb-0.5 drop-shadow-sm">{suggestion.message}</p>
                  <div className="flex items-center gap-1">
                    <p className="text-[10px] text-[#3b9eff] drop-shadow-[0_0_8px_rgba(59,158,255,0.6)] font-medium">{suggestion.cafe}</p>
                    <ArrowUpRight className="w-3 h-3 text-[#3b9eff]" strokeWidth={2} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Exchange Rate Widget */}
          <div 
            onClick={() => setShowExchange(!showExchange)}
            className="relative mb-3 p-[1px] rounded-[14px] bg-gradient-to-b from-white/15 to-white/5 cursor-pointer group"
          >
            <div className="relative rounded-[14px] bg-gradient-to-b from-[#1a2642]/70 to-[#0f172a]/90 backdrop-blur-lg p-3">
              {/* Glossy overlay */}
              <div className="absolute inset-0 rounded-[14px] bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500/25 to-green-600/15 backdrop-blur-sm flex items-center justify-center border border-green-400/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                    <TrendingUp className="w-3.5 h-3.5 text-green-400 drop-shadow-[0_0_6px_rgba(34,197,94,0.6)]" strokeWidth={2} />
                  </div>
                  <span className="text-xs text-white/70 font-medium">USD → PLN</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-bold text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.4)]">{exchangeRate}</span>
                    <span className="text-[11px] text-green-400/80 font-medium">+{exchangeChange}</span>
                    
                    {/* Live pulse */}
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.8)]"
                    />
                  </div>
                  
                  <motion.div
                    animate={{ rotate: showExchange ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4 text-white/40" strokeWidth={2} />
                  </motion.div>
                </div>
              </div>

              {/* Expanded Exchange Tool */}
              <AnimatePresence>
                {showExchange && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 mt-3 border-t border-white/5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/50">Best time to transfer</span>
                        <span className="text-green-400 font-semibold">Now! ↑ 0.5%</span>
                      </div>
                      <button className="w-full py-2 rounded-lg bg-gradient-to-b from-green-500/20 to-green-600/10 border border-green-400/20 text-xs font-semibold text-green-400 hover:from-green-500/30 hover:to-green-600/20 transition-all active:scale-95">
                        Simulate Transfer with Wise
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Warsaw Vibes - Hidden Gem (Premium) */}
          <div className="relative mb-3 p-[1px] rounded-[14px] bg-gradient-to-b from-amber-400/20 via-amber-500/10 to-transparent">
            <div className="relative rounded-[14px] bg-gradient-to-br from-[#1a2642]/80 to-[#0f172a]/95 backdrop-blur-lg p-3">
              {/* Premium badge */}
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400/20 to-amber-500/20 border border-amber-400/30 backdrop-blur-sm">
                <p className="text-[9px] text-amber-400 font-bold">EXCLUSIVE</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400/25 to-amber-500/15 flex items-center justify-center border border-amber-400/25">
                  <Sparkles className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" strokeWidth={2} />
                </div>
                
                <div className="flex-1">
                  <p className="text-[10px] text-amber-400/80 uppercase tracking-wide font-bold mb-1">Warsaw Vibes</p>
                  <p className="text-sm font-semibold leading-tight mb-1">{hiddenGem.name}</p>
                  <div className="flex items-center gap-2 text-[10px] text-white/50">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" strokeWidth={2} />
                      <span>{hiddenGem.location}</span>
                    </div>
                    <span>•</span>
                    <span>{hiddenGem.distance}</span>
                  </div>
                </div>
                
                <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <ArrowUpRight className="w-4 h-4 text-white/70" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>

          {/* Expandable AI Summary with Warsaw News */}
          <button
            onClick={() => setExpandedAI(!expandedAI)}
            className="w-full flex items-center justify-between py-2.5 px-3 rounded-[14px] bg-gradient-to-b from-[#2d5a8c]/35 to-[#1a3a5f]/25 border border-[#3b9eff]/20 hover:border-[#3b9eff]/35 transition-all group"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#3b9eff]" strokeWidth={2} />
              <span className="text-xs text-white/90 font-medium">AI Brief: Warsaw Insights</span>
            </div>
            <motion.div
              animate={{ rotate: expandedAI ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-white/50 group-hover:text-white/70" strokeWidth={2} />
            </motion.div>
          </button>

          {/* Expanded AI Content */}
          <AnimatePresence>
            {expandedAI && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-3 space-y-2">
                  <div className="p-3 rounded-[12px] bg-white/5 border border-white/5">
                    <p className="text-xs text-white/80 leading-relaxed">
                      💱 <span className="font-semibold text-white/95">PLN is up today!</span> Good time to transfer funds. Consider using Wise or Revolut for best rates. Predicted to stay stable for 48h.
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-[12px] bg-white/5 border border-white/5">
                    <p className="text-xs text-white/80 leading-relaxed">
                      🏛️ <span className="font-semibold text-white/95">New visa policy update:</span> Processing times reduced by 30% at Mokotów office. Book your PESEL appointment before slots fill!
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-[12px] bg-white/5 border border-white/5">
                    <p className="text-xs text-white/80 leading-relaxed">
                      🎨 <span className="font-semibold text-white/95">Weekend tip:</span> Free museum entry this Sunday at National Museum. Perfect for {userMood === 'homesick' ? 'cultural exploration' : 'adventure'}!
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
