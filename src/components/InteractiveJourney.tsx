import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ChevronRight, CheckCircle2, Circle, Star } from 'lucide-react';

interface InteractiveJourneyProps {
  user: {
    completedTasks: number;
    totalTasks: number;
    points: number;
    streak: number;
  };
}

export function InteractiveJourney({ user }: InteractiveJourneyProps) {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const progress = (user.completedTasks / user.totalTasks) * 100;
  
  const currentMilestone = {
    name: "Get PESEL number",
    subtasks: [
      { id: 1, name: "Book office appointment", done: false },
      { id: 2, name: "Prepare documents", done: false },
      { id: 3, name: "Upload proof of address", done: false },
    ],
    reward: 50
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative overflow-hidden rounded-[28px] p-[1px] bg-gradient-to-b from-white/20 via-white/5 to-transparent"
    >
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#1a2642]/85 via-[#14203a]/90 to-[#0f1829]/95 backdrop-blur-xl p-6">
        {/* Glossy overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[28px] pointer-events-none" />
        
        {/* Ambient glow */}
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-[#2d7dd2] rounded-full opacity-[0.15] blur-[100px]" />
        
        {/* Inner highlight */}
        <div className="absolute inset-0 rounded-[28px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.12),inset_0_-1px_2px_rgba(0,0,0,0.3)] pointer-events-none" />

        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-[20px] font-bold mb-1">Your Journey</h2>
              <p className="text-[13px] text-white/50">Week 2 in Poland</p>
            </div>
            <div className="relative px-3 py-1.5 rounded-full bg-gradient-to-r from-[#3b9eff] to-[#8b5cf6] shadow-[0_4px_12px_rgba(59,158,255,0.3)]">
              {/* Glowing star for streak */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Star className="w-4 h-4 text-white fill-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              </motion.div>
            </div>
          </div>

          {/* Interactive Progress Ring */}
          <div className="flex items-center gap-5 mb-5">
            <button
              onClick={() => setShowSubtasks(!showSubtasks)}
              className="relative group"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-20 h-20"
              >
                {/* Pulsing ring on hover */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-[#3b9eff]"
                  initial={{ scale: 1, opacity: 0 }}
                  whileHover={{ scale: 1.3, opacity: [0, 0.5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />

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
                    stroke="url(#gradient)"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 214" }}
                    animate={{ strokeDasharray: `${(progress / 100) * 214} 214` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b9eff" />
                      <stop offset="100%" stopColor="#0066cc" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[18px] font-bold">{Math.round(progress)}%</span>
                </div>
              </motion.div>
            </button>

            <div className="flex-1">
              <p className="text-[13px] text-white/50 mb-1">Next milestone</p>
              <p className="text-[15px] font-semibold mb-2">{currentMilestone.name}</p>
              
              {/* Motivation Text */}
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" strokeWidth={2} />
                <p className="text-xs text-amber-400/90 font-medium">
                  {Math.round(progress)}%—great start! Complete for {currentMilestone.reward} points
                </p>
              </div>

              <button className="flex items-center gap-2 text-[13px] text-[#3b9eff] hover:text-[#5fb3ff] font-semibold group">
                <span>View details</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
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
                <div className="p-4 rounded-[16px] bg-gradient-to-b from-[#1a2642]/60 to-[#0f172a]/80 border border-white/5">
                  <p className="text-xs text-white/50 mb-3 uppercase tracking-wide">Subtasks</p>
                  <div className="space-y-2">
                    {currentMilestone.subtasks.map((task, index) => (
                      <motion.button
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all group"
                      >
                        {task.done ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400" strokeWidth={2} />
                        ) : (
                          <Circle className="w-4 h-4 text-white/30 group-hover:text-white/50" strokeWidth={2} />
                        )}
                        <span className={`text-sm flex-1 text-left ${task.done ? 'text-white/40 line-through' : 'text-white/80'}`}>
                          {task.name}
                        </span>
                        {!task.done && (
                          <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/40 group-hover:translate-x-1 transition-all" strokeWidth={2} />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-[16px] bg-white/5 border border-white/5">
              <p className="text-[18px] font-bold text-[#3b9eff]">{user.points}</p>
              <p className="text-[11px] text-white/50">Points</p>
            </div>
            <div className="text-center p-3 rounded-[16px] bg-white/5 border border-white/5">
              <div className="flex items-center justify-center gap-1">
                <p className="text-[18px] font-bold text-[#ff6b9d]">{user.streak}</p>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Star className="w-3 h-3 text-[#ff6b9d] fill-[#ff6b9d]" />
                </motion.div>
              </div>
              <p className="text-[11px] text-white/50">Day Streak</p>
            </div>
            <div className="text-center p-3 rounded-[16px] bg-white/5 border border-white/5">
              <p className="text-[18px] font-bold text-[#10b981]">{user.completedTasks}</p>
              <p className="text-[11px] text-white/50">Tasks Done</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
