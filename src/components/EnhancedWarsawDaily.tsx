import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Trophy } from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedWarsawDailyProps {
  streak: number;
}

export function EnhancedWarsawDaily({ streak }: EnhancedWarsawDailyProps) {
  const [hasPlayed, setHasPlayed] = useState(false);
  const [selectedTemp, setSelectedTemp] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const todaysChallenge = {
    type: 'weather',
    question: "What's tomorrow's high in Warsaw?",
    date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
  };

  const tempOptions = ['-2°C', '3°C', '7°C', '12°C'];
  
  const leaderboard = [
    { rank: 1, name: 'Sarah M.', points: 280, avatar: 'S', color: 'from-[#fbbf24] to-[#f59e0b]' },
    { rank: 2, name: 'You', points: 150, avatar: 'A', color: 'from-[#3b9eff] to-[#0066cc]' },
    { rank: 3, name: 'Michael K.', points: 140, avatar: 'M', color: 'from-[#ec4899] to-[#db2777]' },
  ];

  const handleGuess = (temp: string, index: number) => {
    if (hasPlayed) return;
    
    // Haptic feedback (if supported)
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    setSelectedTemp(index);
    setShowFeedback(true);
    
    const isCorrect = index === 2;
    
    setTimeout(() => {
      if (isCorrect) {
        toast.success('🎉 Perfect guess! +10 points', {
          description: `${streak + 1} day streak! Keep it going!`,
          duration: 3000,
        });
      } else {
        toast.error('Not quite! The answer was 7°C', {
          description: `But your ${streak} day streak continues!`,
          duration: 3000,
        });
      }
      
      // Hide after showing result
      setTimeout(() => {
        setHasPlayed(true);
      }, 2000);
    }, 500);
  };

  // Don't render if already played
  if (hasPlayed) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-[28px] p-[1px] bg-gradient-to-b from-white/20 via-white/5 to-transparent">
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-b from-[#1a2642]/85 via-[#14203a]/90 to-[#0f1829]/95 backdrop-blur-xl p-6">
        {/* Glossy overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent rounded-[28px] pointer-events-none" />
        
        {/* Subtle blue glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -right-20 -top-20 w-60 h-60 bg-[#2d7dd2] rounded-full opacity-[0.15] blur-[100px]"></div>
        </div>
        
        {/* Inner highlight */}
        <div className="absolute inset-0 rounded-[28px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.25)] pointer-events-none" />

        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#ff6b9d] to-[#ff8e53] flex items-center justify-center shadow-[0_4px_16px_rgba(255,107,157,0.4)]">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[17px]">Warsaw Daily</h3>
                <p className="text-[13px] text-white/50">{todaysChallenge.date}</p>
              </div>
            </div>
            
            {/* Streak badge - glossy 3D */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-[#ff6b9d] to-[#ff4757] rounded-full blur-md opacity-50"></div>
              <div className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-b from-[#ff6b9d] to-[#ff4757] shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_12px_rgba(255,71,87,0.4)]">
                <Flame className="w-4 h-4 text-white drop-shadow-sm" />
                <span className="font-bold text-[13px] text-white drop-shadow-sm">{streak}</span>
              </div>
            </div>
          </div>

          {/* Challenge */}
          <div className="mb-5">
            <p className="text-white/90 mb-5 text-center py-2 font-medium">
              {todaysChallenge.question}
            </p>
            
            {/* Options - 3D style with haptic feedback */}
            <div className="grid grid-cols-2 gap-3">
              {tempOptions.map((temp, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleGuess(temp, index)}
                  disabled={selectedTemp !== null}
                  whileTap={{ scale: 0.95 }}
                  className={`relative p-4 rounded-[20px] font-semibold text-[15px] transition-all ${
                    showFeedback && selectedTemp === index
                      ? index === 2
                        ? 'bg-gradient-to-b from-[#10b981] to-[#059669] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_6px_20px_rgba(16,185,129,0.4)] scale-105'
                        : 'bg-gradient-to-b from-[#ef4444] to-[#dc2626] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_6px_20px_rgba(239,68,68,0.4)]'
                      : selectedTemp !== null
                      ? index === 2
                        ? 'bg-gradient-to-b from-[#10b981] to-[#059669] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_6px_20px_rgba(16,185,129,0.4)]'
                        : 'bg-gradient-to-b from-[#1e293b] to-[#0f172a] text-white/30 shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]'
                      : 'bg-gradient-to-b from-[#2d4a7c] via-[#1e3a5f] to-[#0f1f3d] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_0_24px_rgba(45,116,213,0.3)] active:scale-95'
                  }`}
                >
                  {temp}
                  
                  {/* Immediate Feedback Icons */}
                  <AnimatePresence>
                    {showFeedback && selectedTemp === index && (
                      <motion.span
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute -top-2 -right-2 text-xl filter drop-shadow-lg"
                      >
                        {index === 2 ? '✅' : '❌'}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Leaderboard - Top 3 with Avatars */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4 text-amber-400" strokeWidth={2} />
              <h4 className="text-xs font-bold text-white/70 uppercase tracking-wide">Top Players</h4>
            </div>
            
            <div className="space-y-2">
              {leaderboard.map((player) => (
                <div
                  key={player.rank}
                  className={`flex items-center gap-3 p-2.5 rounded-[12px] ${
                    player.name === 'You' 
                      ? 'bg-gradient-to-r from-[#3b9eff]/20 to-transparent border border-[#3b9eff]/30' 
                      : 'bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span className={`text-xs font-bold w-5 ${
                      player.rank === 1 ? 'text-amber-400' : 
                      player.rank === 2 ? 'text-gray-400' : 
                      'text-orange-400'
                    }`}>
                      #{player.rank}
                    </span>
                    
                    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${player.color} flex items-center justify-center text-xs font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]`}>
                      {player.avatar}
                    </div>
                    
                    <span className={`text-sm font-medium ${player.name === 'You' ? 'text-white' : 'text-white/70'}`}>
                      {player.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-white/90">{player.points}</span>
                    <span className="text-[10px] text-white/40">pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
            <span className="text-[13px] text-white/50">
              {selectedTemp !== null ? '✨ Come back tomorrow!' : '⚡ First guess counts'}
            </span>
            <button className="text-[13px] text-[#3b9eff] hover:text-[#5fb3ff] font-semibold">
              Full Leaderboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
