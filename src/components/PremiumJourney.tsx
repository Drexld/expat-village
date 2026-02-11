import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ChevronRight, CheckCircle2, Circle, Star, Trophy, Map, Zap } from 'lucide-react';

interface PremiumJourneyProps {
  user: {
    completedTasks: number;
    totalTasks: number;
    points: number;
    streak: number;
  };
}

export function PremiumJourney({ user }: PremiumJourneyProps) {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [showJourneyMap, setShowJourneyMap] = useState(false);
  const progress = (user.completedTasks / user.totalTasks) * 100;
  
  // Level-up tier system
  const getTier = (points: number) => {
    if (points < 200) return { name: 'Newcomer', badge: '🌱', color: 'from-[#3b9eff] to-[#0066cc]', next: 200 };
    if (points < 500) return { name: 'Explorer', badge: '🗺️', color: 'from-[#10b981] to-[#059669]', next: 500 };
    if (points < 1000) return { name: 'Warsaw Insider', badge: '🏆', color: 'from-[#f59e0b] to-[#d97706]', next: 1000 };
    return { name: 'Legend', badge: '👑', color: 'from-[#8b5cf6] to-[#7c3aed]', next: null };
  };
  
  const tier = getTier(user.points);
  const pointsToNext = tier.next ? tier.next - user.points : 0;
  
  const currentMilestone = {
    name: "Get PESEL number",
    subtasks: [
      { id: 1, name: "Book office appointment", done: false, points: 15 },
      { id: 2, name: "Prepare documents", done: false, points: 10 },
      { id: 3, name: "Upload proof of address", done: false, points: 10 },
    ],
    reward: 50,
    location: { lat: 52.2297, lng: 21.0122 } // Warsaw coordinates
  };

  const handleCircleClick = () => {
    setShowSubtasks(!showSubtasks);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(40);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative overflow-hidden rounded-[28px] p-[1px] bg-gradient-to-b from-white/25 via-white/10 to-transparent"
    >
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#1a2642]/90 via-[#14203a]/95 to-[#0f1829]/98 backdrop-blur-xl p-6">
        {/* Glossy overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-transparent rounded-[28px] pointer-events-none" />
        
        {/* Ambient glow */}
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-[#2d7dd2] rounded-full opacity-[0.2] blur-[120px]" />
        
        {/* Inner highlight */}
        <div className="absolute inset-0 rounded-[28px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.15),inset_0_-2px_4px_rgba(0,0,0,0.3)] pointer-events-none" />

        <div className="relative">
          {/* Header with Tier Badge */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-[20px] font-bold mb-1">Your Journey</h2>
              <p className="text-[13px] text-white/50">Week 2 in Poland</p>
            </div>
            
            {/* Tier Badge */}
            <div className={`relative px-3 py-1.5 rounded-full bg-gradient-to-r ${tier.color} shadow-[0_4px_16px_rgba(59,158,255,0.4)]`}>
              <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]" />
              <div className="relative flex items-center gap-1.5">
                <span className="text-base">{tier.badge}</span>
                <span className="text-xs font-bold drop-shadow-sm">{tier.name}</span>
              </div>
            </div>
          </div>

          {/* Tier Progress (if not max level) */}
          {tier.next && (
            <div className="mb-4 p-3 rounded-[16px] bg-white/5 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-white/60">Next tier: {getTier(tier.next).name}</p>
                <p className="text-xs font-semibold text-[#3b9eff]">{pointsToNext} pts to go</p>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((user.points % tier.next) / tier.next) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#3b9eff] to-[#8b5cf6] rounded-full"
                />
              </div>
            </div>
          )}

          {/* Interactive Progress Ring */}
          <div className="flex items-center gap-5 mb-5">
            <motion.button
              onClick={handleCircleClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <div className="relative w-20 h-20">
                {/* Pulsing ring on hover */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-[#3b9eff]"
                  initial={{ scale: 1, opacity: 0 }}
                  whileHover={{ scale: 1.3, opacity: [0, 0.5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />

                {/* SVG Progress Circle */}
                <svg className="w-20 h-20 -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="6"
                    fill="none"
                  />
                  <motion.circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="url(#gradient-journey)"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 214" }}
                    animate={{ 
                      strokeDasharray: `${(progress / 100) * 214} 214`,
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="gradient-journey" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b9eff" />
                      <stop offset="100%" stopColor="#0066cc" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Percentage in center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span 
                    className="text-[18px] font-bold"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {Math.round(progress)}%
                  </motion.span>
                </div>
              </div>
            </motion.button>

            <div className="flex-1">
              <p className="text-[13px] text-white/50 mb-1">Next milestone</p>
              <p className="text-[15px] font-semibold mb-2">{currentMilestone.name}</p>
              
              {/* Enhanced Motivation Text */}
              <div className="flex items-center gap-1.5 mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" strokeWidth={2} />
                <p className="text-xs text-amber-400/95 font-medium">
                  {Math.round(progress)}%—great start! Complete for {currentMilestone.reward} points
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 text-[13px] text-[#3b9eff] hover:text-[#5fb3ff] font-semibold group">
                  <span>View details</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                  onClick={() => setShowJourneyMap(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Map className="w-3.5 h-3.5 text-white/70" strokeWidth={2} />
                  <span className="text-[11px] text-white/70 font-medium">Journey Map</span>
                </button>
              </div>
            </div>
          </div>

          {/* Radial Subtasks Menu */}
          <AnimatePresence>
            {showSubtasks && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-5"
              >
                <div className="p-4 rounded-[16px] bg-gradient-to-b from-[#1a2642]/70 to-[#0f172a]/90 border border-white/5 backdrop-blur-sm">
                  <p className="text-xs text-white/50 mb-3 uppercase tracking-wide font-semibold">Subtasks</p>
                  <div className="space-y-2">
                    {currentMilestone.subtasks.map((task, index) => (
                      <motion.button
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center gap-3 p-3 rounded-[12px] bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#3b9eff]/30 transition-all group"
                      >
                        {task.done ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" strokeWidth={2} />
                        ) : (
                          <Circle className="w-5 h-5 text-white/30 group-hover:text-white/50" strokeWidth={2} />
                        )}
                        
                        <div className="flex-1 text-left">
                          <span className={`text-sm ${task.done ? 'text-white/40 line-through' : 'text-white/90 font-medium'}`}>
                            {task.name}
                          </span>
                          <p className="text-[10px] text-white/40 mt-0.5">+{task.points} points</p>
                        </div>
                        
                        {!task.done && (
                          <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#3b9eff] group-hover:translate-x-1 transition-all" strokeWidth={2} />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Premium Quick Stats with Enhanced Styling */}
          <div className="grid grid-cols-3 gap-3">
            <div className="relative text-center p-3 rounded-[16px] bg-white/5 border border-white/5 overflow-hidden group hover:border-[#3b9eff]/30 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3b9eff]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <p className="text-[18px] font-bold text-[#3b9eff] drop-shadow-[0_0_8px_rgba(59,158,255,0.3)]">{user.points}</p>
                <p className="text-[11px] text-white/50">Points</p>
              </div>
            </div>
            
            <div className="relative text-center p-3 rounded-[16px] bg-white/5 border border-white/5 overflow-hidden group hover:border-[#ff6b9d]/30 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b9d]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center justify-center gap-1">
                <p className="text-[18px] font-bold text-[#ff6b9d] drop-shadow-[0_0_8px_rgba(255,107,157,0.3)]">{user.streak}</p>
                <motion.div
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Star className="w-3.5 h-3.5 text-[#ff6b9d] fill-[#ff6b9d] drop-shadow-[0_0_6px_rgba(255,107,157,0.5)]" />
                </motion.div>
              </div>
              <p className="text-[11px] text-white/50">Day Streak</p>
            </div>
            
            <div className="relative text-center p-3 rounded-[16px] bg-white/5 border border-white/5 overflow-hidden group hover:border-[#10b981]/30 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <p className="text-[18px] font-bold text-[#10b981] drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">{user.completedTasks}</p>
                <p className="text-[11px] text-white/50">Tasks Done</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Journey Map Modal */}
      <AnimatePresence>
        {showJourneyMap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-5"
            onClick={() => setShowJourneyMap(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-[24px] p-[1px] bg-gradient-to-b from-white/30 to-white/10"
            >
              <div className="rounded-[24px] bg-gradient-to-b from-[#1a2642]/98 to-[#0f172a]/98 backdrop-blur-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Map className="w-5 h-5 text-[#3b9eff]" strokeWidth={2} />
                  Your Journey Map
                </h3>
                
                <div className="aspect-square rounded-[16px] bg-white/5 border border-white/5 mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-[#3b9eff] mx-auto mb-2" strokeWidth={1.5} />
                    <p className="text-sm text-white/70">PESEL Office pinned</p>
                    <p className="text-xs text-white/50 mt-1">Tap to navigate</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowJourneyMap(false)}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-b from-[#3b9eff] to-[#2d7dd2] font-semibold shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),0_4px_16px_rgba(59,158,255,0.4)] hover:shadow-[0_6px_24px_rgba(59,158,255,0.5)] active:scale-95 transition-all"
                >
                  Open in Maps
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
