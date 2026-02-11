import { useState } from 'react';
import { Flame } from 'lucide-react';
import { toast } from 'sonner';

interface WarsawDailyProps {
  streak: number;
}

export function WarsawDaily({ streak }: WarsawDailyProps) {
  const [hasPlayed, setHasPlayed] = useState(false);
  const [selectedTemp, setSelectedTemp] = useState<number | null>(null);
  
  const todaysChallenge = {
    type: 'weather',
    question: "What's tomorrow's high in Warsaw?",
    date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
  };

  const tempOptions = ['-2°C', '3°C', '7°C', '12°C'];

  const handleGuess = (temp: string, index: number) => {
    if (hasPlayed) return;
    
    setSelectedTemp(index);
    
    const isCorrect = index === 2;
    
    setTimeout(() => {
      if (isCorrect) {
        toast.success('🎉 Perfect guess! +10 points', {
          description: `${streak + 1} day streak! Keep it going!`
        });
      } else {
        toast.error('Not quite! The answer was 7°C', {
          description: `But your ${streak} day streak continues!`
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
    <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-b from-[#1a2642] via-[#14203a] to-[#0f1829] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.4)]">
      {/* Subtle blue glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-[#2d7dd2] rounded-full opacity-[0.15] blur-[100px]"></div>
      </div>

      <div className="relative p-6">
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
          
          {/* Options - 3D style */}
          <div className="grid grid-cols-2 gap-3">
            {tempOptions.map((temp, index) => (
              <button
                key={index}
                onClick={() => handleGuess(temp, index)}
                disabled={hasPlayed}
                className={`relative p-4 rounded-[20px] font-semibold text-[15px] transition-all ${
                  hasPlayed && selectedTemp === index
                    ? index === 2
                      ? 'bg-gradient-to-b from-[#10b981] to-[#059669] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_6px_20px_rgba(16,185,129,0.4)] scale-105'
                      : 'bg-gradient-to-b from-[#1e293b] to-[#0f172a] text-white/30 shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]'
                    : hasPlayed
                    ? index === 2
                      ? 'bg-gradient-to-b from-[#10b981] to-[#059669] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_6px_20px_rgba(16,185,129,0.4)]'
                      : 'bg-gradient-to-b from-[#1e293b] to-[#0f172a] text-white/30 shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]'
                    : 'bg-gradient-to-b from-[#2d4a7c] via-[#1e3a5f] to-[#0f1f3d] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_0_24px_rgba(45,116,213,0.3)] active:scale-95'
                }`}
              >
                {temp}
                {hasPlayed && index === 2 && (
                  <span className="absolute -top-2 -right-2 text-xl filter drop-shadow-lg">✅</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
          <span className="text-[13px] text-white/50">
            {hasPlayed ? '✨ Come back tomorrow!' : '⚡ First guess counts'}
          </span>
          <button className="text-[13px] text-[#3b9eff] hover:text-[#5fb3ff] font-semibold">
            Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}