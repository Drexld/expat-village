import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Trophy, Mic, Brain, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface PremiumWarsawDailyProps {
  streak: number;
}

export function PremiumWarsawDaily({ streak }: PremiumWarsawDailyProps) {
  const [hasPlayed, setHasPlayed] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [mode, setMode] = useState<'weather' | 'wisdom'>('weather');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  
  const challenges = {
    weather: {
      question: "What's tomorrow's high in Warsaw?",
      options: ['-2°C', '3°C', '7°C', '12°C'],
      correctIndex: 2,
      type: 'weather'
    },
    wisdom: {
      question: "Best pierogi spot in Old Town?",
      options: ['Zapiecek', 'U Babci Maliny', 'Pierogarnia Mandu', 'Stary Dom'],
      correctIndex: 1,
      type: 'wisdom',
      reward: '10% discount code'
    }
  };

  const challenge = challenges[mode];
  
  const leaderboard = [
    { rank: 1, name: 'Sarah M.', points: 280, avatar: 'S', color: 'from-[#fbbf24] to-[#f59e0b]', streak: 14 },
    { rank: 2, name: 'You', points: 150, avatar: 'A', color: 'from-[#3b9eff] to-[#0066cc]', streak: 7 },
    { rank: 3, name: 'Michael K.', points: 140, avatar: 'M', color: 'from-[#ec4899] to-[#db2777]', streak: 5 },
  ];

  const handleGuess = (answer: string, index: number) => {
    if (selectedAnswer !== null) return;
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    setSelectedAnswer(index);
    setShowFeedback(true);
    
    const isCorrect = index === challenge.correctIndex;
    
    setTimeout(() => {
      if (isCorrect) {
        if (mode === 'wisdom') {
          toast.success(`🎉 Correct! +15 points + ${challenge.reward}`, {
            description: `${streak + 1} day streak! Check your rewards.`,
            duration: 4000,
          });
        } else {
          toast.success('🎉 Perfect guess! +10 points', {
            description: `${streak + 1} day streak! Keep it going!`,
            duration: 3000,
          });
        }
      } else {
        toast.error(`Not quite! The answer was ${challenge.options[challenge.correctIndex]}`, {
          description: `But your ${streak} day streak continues!`,
          duration: 3000,
        });
      }
      
      setTimeout(() => {
        setHasPlayed(true);
      }, 2000);
    }, 500);
  };

  const handleVoiceAnswer = () => {
    setIsVoiceMode(true);
    
    // Simulate voice recognition
    setTimeout(() => {
      setIsVoiceMode(false);
      // Auto-select random answer for demo
      handleGuess(challenge.options[2], 2);
    }, 2000);
  };

  if (hasPlayed) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-[28px] p-[1px] bg-gradient-to-b from-white/25 via-white/10 to-transparent">
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-b from-[#1a2642]/90 via-[#14203a]/95 to-[#0f1829]/98 backdrop-blur-xl p-6">
        {/* Glossy overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[28px] pointer-events-none" />
        
        {/* Subtle glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -right-20 -top-20 w-60 h-60 bg-[#ff6b9d] rounded-full opacity-[0.2] blur-[120px]"></div>
        </div>
        
        {/* Inner highlight */}
        <div className="absolute inset-0 rounded-[28px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.15),inset_0_-2px_4px_rgba(0,0,0,0.25)] pointer-events-none" />

        <div className="relative">
          {/* Header with Mode Toggle */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#ff6b9d] to-[#ff8e53] flex items-center justify-center shadow-[0_4px_16px_rgba(255,107,157,0.4)]">
                {mode === 'wisdom' ? (
                  <Brain className="w-5 h-5 text-white" strokeWidth={2} />
                ) : (
                  <Flame className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-[17px]">
                  {mode === 'wisdom' ? 'Warsaw Wisdom' : 'Warsaw Daily'}
                </h3>
                <p className="text-[13px] text-white/50">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
            
            {/* Streak badge */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-[#ff6b9d] to-[#ff4757] rounded-full blur-md opacity-50"></div>
              <div className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-b from-[#ff6b9d] to-[#ff4757] shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_12px_rgba(255,71,87,0.4)]">
                <Flame className="w-4 h-4 text-white drop-shadow-sm" />
                <span className="font-bold text-[13px] text-white drop-shadow-sm">{streak}</span>
              </div>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMode('weather')}
              className={`flex-1 py-2 px-3 rounded-[12px] text-xs font-semibold transition-all ${
                mode === 'weather'
                  ? 'bg-gradient-to-b from-[#3b9eff]/30 to-[#2d7dd2]/20 border border-[#3b9eff]/40 text-white shadow-[0_0_16px_rgba(59,158,255,0.3)]'
                  : 'bg-white/5 border border-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              ⛅ Weather Quiz
            </button>
            <button
              onClick={() => setMode('wisdom')}
              className={`flex-1 py-2 px-3 rounded-[12px] text-xs font-semibold transition-all ${
                mode === 'wisdom'
                  ? 'bg-gradient-to-b from-[#8b5cf6]/30 to-[#7c3aed]/20 border border-[#8b5cf6]/40 text-white shadow-[0_0_16px_rgba(139,92,246,0.3)]'
                  : 'bg-white/5 border border-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              🧠 Warsaw Wisdom
              {mode === 'wisdom' && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-400 text-[9px]">+REWARD</span>
              )}
            </button>
          </div>

          {/* Challenge */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/90 text-center flex-1 py-2 font-medium">
                {challenge.question}
              </p>
              
              {/* Voice Answer Button */}
              <motion.button
                onClick={handleVoiceAnswer}
                disabled={isVoiceMode || selectedAnswer !== null}
                whileTap={{ scale: 0.9 }}
                className={`ml-2 p-2.5 rounded-full transition-all ${
                  isVoiceMode
                    ? 'bg-gradient-to-b from-[#ff6b9d] to-[#ff4757]'
                    : 'bg-gradient-to-b from-[#2d5a8c]/50 to-[#1a3a5f]/70 hover:from-[#2d5a8c]/70 hover:to-[#1a3a5f]/90'
                } shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]`}
              >
                {isVoiceMode && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-[#ff6b9d]"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                <Mic className={`w-4 h-4 relative z-10 ${isVoiceMode ? 'text-white' : 'text-white/70'}`} strokeWidth={2} />
              </motion.button>
            </div>
            
            {/* Options with premium glow effects */}
            <div className="grid grid-cols-2 gap-3">
              {challenge.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleGuess(option, index)}
                  disabled={selectedAnswer !== null}
                  whileTap={{ scale: 0.95 }}
                  className={`relative p-4 rounded-[20px] font-semibold text-[15px] transition-all overflow-hidden ${
                    showFeedback && selectedAnswer === index
                      ? index === challenge.correctIndex
                        ? 'bg-gradient-to-b from-[#10b981] to-[#059669] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_32px_rgba(16,185,129,0.6)] scale-105'
                        : 'bg-gradient-to-b from-[#ef4444] to-[#dc2626] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_32px_rgba(239,68,68,0.6)]'
                      : selectedAnswer !== null
                      ? index === challenge.correctIndex
                        ? 'bg-gradient-to-b from-[#10b981] to-[#059669] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_32px_rgba(16,185,129,0.6)]'
                        : 'bg-gradient-to-b from-[#1e293b] to-[#0f172a] text-white/30 shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]'
                      : 'bg-gradient-to-b from-[#2d4a7c] via-[#1e3a5f] to-[#0f1f3d] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_0_28px_rgba(45,116,213,0.4)]'
                  }`}
                >
                  {/* Glossy overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[20px] pointer-events-none" />
                  
                  <span className="relative z-10">{option}</span>
                  
                  {/* Feedback Icons with animation */}
                  <AnimatePresence>
                    {showFeedback && selectedAnswer === index && (
                      <motion.span
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="absolute -top-2 -right-2 text-2xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                      >
                        {index === challenge.correctIndex ? '✅' : '❌'}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Premium Leaderboard with Avatars */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" strokeWidth={2} />
                <h4 className="text-xs font-bold text-white/70 uppercase tracking-wide">Top Players</h4>
              </div>
              <button className="text-[11px] text-[#3b9eff] hover:text-[#5fb3ff] font-semibold">
                View All →
              </button>
            </div>
            
            <div className="space-y-2">
              {leaderboard.map((player) => (
                <motion.div
                  key={player.rank}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: player.rank * 0.1 }}
                  className={`relative overflow-hidden rounded-[14px] p-[1px] ${
                    player.name === 'You' 
                      ? 'bg-gradient-to-r from-[#3b9eff]/40 to-transparent' 
                      : 'bg-gradient-to-r from-white/10 to-transparent'
                  }`}
                >
                  <div className={`relative rounded-[14px] flex items-center gap-3 p-2.5 ${
                    player.name === 'You' 
                      ? 'bg-gradient-to-r from-[#3b9eff]/15 to-transparent backdrop-blur-sm' 
                      : 'bg-white/5 backdrop-blur-sm'
                  }`}>
                    {/* Glossy overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-[14px] pointer-events-none" />
                    
                    <div className="relative flex items-center gap-2.5 flex-1">
                      {/* Rank with medal */}
                      <span className={`text-sm font-bold w-6 ${
                        player.rank === 1 ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 
                        player.rank === 2 ? 'text-gray-300 drop-shadow-[0_0_8px_rgba(209,213,219,0.6)]' : 
                        'text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]'
                      }`}>
                        {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : '🥉'}
                      </span>
                      
                      {/* Avatar with glow */}
                      <div className="relative">
                        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${player.color} blur-md opacity-50`} />
                        <div className={`relative w-8 h-8 rounded-full bg-gradient-to-br ${player.color} flex items-center justify-center text-sm font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]`}>
                          {player.avatar}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <span className={`text-sm font-medium ${player.name === 'You' ? 'text-white' : 'text-white/80'}`}>
                          {player.name}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Flame className="w-3 h-3 text-[#ff6b9d]" strokeWidth={2} />
                          <span className="text-[10px] text-white/50">{player.streak} days</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-bold text-white/90">{player.points}</span>
                      <span className="text-[10px] text-white/40">pts</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
            <span className="text-[13px] text-white/50">
              {selectedAnswer !== null ? '✨ Come back tomorrow!' : '⚡ First guess counts'}
            </span>
            {mode === 'wisdom' && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-400/10 border border-amber-400/20">
                <MapPin className="w-3 h-3 text-amber-400" strokeWidth={2} />
                <span className="text-[10px] text-amber-400 font-semibold">WIN DISCOUNT</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
