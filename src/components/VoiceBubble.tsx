import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, X } from 'lucide-react';

interface VoiceBubbleProps {
  userName: string;
  onVoiceCommand: () => void;
}

export function VoiceBubble({ userName, onVoiceCommand }: VoiceBubbleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const examples = [
    "Warsaw events this week?",
    "Next PESEL step?",
    "Best cafes nearby?",
    "How to get TRC?",
  ];

  if (isDismissed) return null;

  return (
    <motion.div
      className="fixed bottom-24 right-5 z-40"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: "spring", stiffness: 200 }}
    >
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          // Collapsed floating button
          <motion.button
            key="collapsed"
            onClick={() => setIsExpanded(true)}
            className="relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Pulsing rings */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-[#3b9eff] to-[#8b5cf6]"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#3b9eff] to-[#8b5cf6] flex items-center justify-center shadow-[0_8px_24px_rgba(59,158,255,0.5),inset_0_1px_2px_rgba(255,255,255,0.3)]">
              <Mic className="w-6 h-6 text-white drop-shadow-lg" strokeWidth={2} />
            </div>
          </motion.button>
        ) : (
          // Expanded card with examples
          <motion.div
            key="expanded"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-white/25 via-white/10 to-transparent"
          >
            <div className="relative rounded-[20px] bg-gradient-to-b from-[#1a2642]/95 to-[#0f172a]/98 backdrop-blur-xl p-4 w-64 shadow-[0_12px_48px_rgba(0,0,0,0.7)]">
              {/* Glossy overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[20px] pointer-events-none" />
              
              {/* Inner highlight */}
              <div className="absolute inset-0 rounded-[20px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.15)] pointer-events-none" />
              
              <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3b9eff] to-[#8b5cf6] flex items-center justify-center shadow-[0_4px_12px_rgba(59,158,255,0.4)]">
                      <Mic className="w-4 h-4 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold">Ask me anything</p>
                      <p className="text-[10px] text-white/50">Try saying...</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setIsDismissed(true)}
                    className="p-1 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4 text-white/50" strokeWidth={2} />
                  </button>
                </div>

                {/* Examples */}
                <div className="space-y-2 mb-3">
                  {examples.map((example, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => {
                        setIsExpanded(false);
                        onVoiceCommand();
                      }}
                      className="w-full text-left p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-[#3b9eff]/30 transition-all group"
                    >
                      <p className="text-xs text-white/70 group-hover:text-white/90">
                        "{example}"
                      </p>
                    </motion.button>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => {
                    setIsExpanded(false);
                    onVoiceCommand();
                  }}
                  className="w-full py-2 rounded-lg bg-gradient-to-b from-[#3b9eff] to-[#2d7dd2] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_12px_rgba(59,158,255,0.4)] text-sm font-semibold hover:shadow-[0_6px_20px_rgba(59,158,255,0.5)] active:scale-95 transition-all"
                >
                  Start Voice Command
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
