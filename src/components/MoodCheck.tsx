import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles } from 'lucide-react';

interface MoodCheckProps {
  isOpen: boolean;
  onClose: (mood: string) => void;
}

export function MoodCheck({ isOpen, onClose }: MoodCheckProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moods = [
    { 
      id: 'homesick', 
      emoji: '🏠', 
      label: 'Homesick', 
      color: 'from-[#ec4899] to-[#db2777]',
      description: 'Missing home? We\'ll show you cultural connections' 
    },
    { 
      id: 'adventurous', 
      emoji: '✨', 
      label: 'Adventurous', 
      color: 'from-[#f59e0b] to-[#d97706]',
      description: 'Ready to explore! We\'ll highlight hidden gems' 
    },
    { 
      id: 'overwhelmed', 
      emoji: '😰', 
      label: 'Overwhelmed', 
      color: 'from-[#8b5cf6] to-[#7c3aed]',
      description: 'Take it easy. We\'ll prioritize simple tasks' 
    },
    { 
      id: 'confident', 
      emoji: '🚀', 
      label: 'Confident', 
      color: 'from-[#10b981] to-[#059669]',
      description: 'You\'re crushing it! Let\'s tackle advanced goals' 
    },
    { 
      id: 'curious', 
      emoji: '🤔', 
      label: 'Curious', 
      color: 'from-[#3b9eff] to-[#0066cc]',
      description: 'Love learning? We\'ll share Poland insights' 
    },
    { 
      id: 'social', 
      emoji: '🎉', 
      label: 'Social', 
      color: 'from-[#06b6d4] to-[#0891b2]',
      description: 'Meet people! We\'ll show expat events nearby' 
    },
  ];

  const handleSelect = (moodId: string) => {
    setSelectedMood(moodId);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
    
    // Close after brief delay
    setTimeout(() => {
      onClose(moodId);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-5"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => onClose('skip')} />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md rounded-[28px] p-[1px] bg-gradient-to-b from-white/30 via-white/15 to-transparent"
      >
        <div className="relative rounded-[28px] bg-gradient-to-b from-[#1a2642]/98 to-[#0f172a]/98 backdrop-blur-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          {/* Glossy overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent rounded-[28px] pointer-events-none" />
          
          {/* Inner highlight */}
          <div className="absolute inset-0 rounded-[28px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.3)] pointer-events-none" />

          {/* Ambient glow */}
          <div className="absolute -right-20 -top-20 w-60 h-60 bg-[#3b9eff] rounded-full opacity-20 blur-[120px] pointer-events-none" />

          <div className="relative">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3b9eff] to-[#8b5cf6] flex items-center justify-center shadow-[0_4px_16px_rgba(59,158,255,0.5)]">
                  <Sparkles className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">How are you feeling today?</h2>
                  <p className="text-xs text-white/60 mt-0.5">We'll personalize your experience</p>
                </div>
              </div>
              
              <button
                onClick={() => onClose('skip')}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/50" strokeWidth={2} />
              </button>
            </div>

            {/* Mood Grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {moods.map((mood, index) => (
                <motion.button
                  key={mood.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSelect(mood.id)}
                  className={`relative p-4 rounded-[20px] text-left transition-all ${
                    selectedMood === mood.id
                      ? 'scale-105'
                      : 'hover:scale-102'
                  }`}
                >
                  {/* Background with gradient */}
                  <div className={`absolute inset-0 rounded-[20px] bg-gradient-to-br ${mood.color} ${
                    selectedMood === mood.id ? 'opacity-30' : 'opacity-10'
                  } transition-opacity`} />
                  
                  {/* Border */}
                  <div className={`absolute inset-0 rounded-[20px] border ${
                    selectedMood === mood.id 
                      ? 'border-white/30' 
                      : 'border-white/5'
                  } transition-colors`} />
                  
                  {/* Glossy overlay */}
                  <div className="absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Content */}
                  <div className="relative">
                    <div className="text-3xl mb-2">{mood.emoji}</div>
                    <p className="text-sm font-semibold mb-1">{mood.label}</p>
                    <p className="text-[10px] text-white/60 leading-relaxed">{mood.description}</p>
                  </div>

                  {/* Selected indicator */}
                  <AnimatePresence>
                    {selectedMood === mood.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-[0_2px_12px_rgba(255,255,255,0.5)]"
                      >
                        <span className="text-sm">✓</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>

            {/* Skip button */}
            <button
              onClick={() => onClose('skip')}
              className="w-full py-2 text-xs text-white/50 hover:text-white/70 transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
