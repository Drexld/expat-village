import { motion } from 'motion/react';
import { MessageSquare, TrendingUp, Users, Eye } from 'lucide-react';

export function PremiumCommunityCards() {
  return (
    <>
      {/* Town Hall - Enhanced with live count */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="relative overflow-hidden rounded-[24px] p-[1px] bg-gradient-to-b from-white/15 to-white/5 cursor-pointer"
      >
        <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-b from-[#1a2642]/90 via-[#14203a]/95 to-[#0f1829]/98 backdrop-blur-xl p-5 text-left h-full">
          {/* Glossy overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent rounded-[24px] pointer-events-none" />
          
          {/* Inner highlight */}
          <div className="absolute inset-0 rounded-[24px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.2)] pointer-events-none" />
          
          {/* Live indicator */}
          <div className="absolute top-4 right-4">
            <div className="relative flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 backdrop-blur-sm border border-green-400/20">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_12px_rgba(16,185,129,0.8)]"
              />
              <span className="text-[10px] text-green-400 font-semibold">LIVE</span>
            </div>
          </div>
          
          <div className="relative">
            <MessageSquare className="w-9 h-9 text-[#3b9eff] mb-3 drop-shadow-[0_0_12px_rgba(59,158,255,0.4)]" strokeWidth={1.5} />
            <p className="text-[15px] font-semibold mb-1">Town Hall</p>
            
            {/* Enhanced live count */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-white/50" strokeWidth={2} />
                <span className="text-[12px] text-white/70 font-medium">12 active</span>
              </div>
              <span className="text-white/30">•</span>
              <div className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-white/50" strokeWidth={2} />
                <span className="text-[12px] text-white/70 font-medium">47 viewing</span>
              </div>
            </div>
            
            {/* Live Preview with timestamps */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#3b9eff] to-[#0066cc] rounded-full blur-sm opacity-50" />
                  <div className="relative w-6 h-6 rounded-full bg-gradient-to-br from-[#3b9eff] to-[#0066cc] flex items-center justify-center text-[10px] font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
                    S
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-white/70 line-clamp-1">PESEL appointment times?</p>
                  <p className="text-[9px] text-white/40">2m ago</p>
                </div>
                <span className="text-[10px] text-green-400 font-semibold">NEW</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ec4899] to-[#db2777] rounded-full blur-sm opacity-50" />
                  <div className="relative w-6 h-6 rounded-full bg-gradient-to-br from-[#ec4899] to-[#db2777] flex items-center justify-center text-[10px] font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
                    J
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-white/60 line-clamp-1">Red flags in contract help!</p>
                  <p className="text-[9px] text-white/40">8m ago</p>
                </div>
                <span className="text-[10px] text-white/40">3 replies</span>
              </div>
            </div>
            
            {/* Quick action */}
            <div className="mt-3 pt-3 border-t border-white/5">
              <button className="w-full py-1.5 rounded-lg bg-[#3b9eff]/10 border border-[#3b9eff]/20 text-xs font-semibold text-[#3b9eff] hover:bg-[#3b9eff]/20 hover:border-[#3b9eff]/30 transition-all">
                Join Discussion
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hot Topics - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="relative overflow-hidden rounded-[24px] p-[1px] bg-gradient-to-b from-white/15 to-white/5 cursor-pointer"
      >
        <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-b from-[#1a2642]/90 via-[#14203a]/95 to-[#0f1829]/98 backdrop-blur-xl p-5 text-left h-full">
          {/* Glossy overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent rounded-[24px] pointer-events-none" />
          
          {/* Inner highlight */}
          <div className="absolute inset-0 rounded-[24px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.2)] pointer-events-none" />
          
          {/* Trending indicator */}
          <div className="absolute top-4 right-4">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-xl"
            >
              🔥
            </motion.div>
          </div>
          
          <div className="relative">
            <TrendingUp className="w-9 h-9 text-[#ff6b9d] mb-3 drop-shadow-[0_0_12px_rgba(255,107,157,0.4)]" strokeWidth={1.5} />
            <p className="text-[15px] font-semibold mb-1">Hot Topics</p>
            <p className="text-[12px] text-white/50 mb-3">Trending this hour</p>
            
            <div className="space-y-2">
              {[
                { emoji: '🔥', text: 'Banking tips', count: 156, trend: '+12' },
                { emoji: '📍', text: 'Mokotów area', count: 89, trend: '+8' },
                { emoji: '💼', text: 'Job hunting', count: 67, trend: '+5' }
              ].map((topic, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (index * 0.1) }}
                  className="relative overflow-hidden rounded-[10px] px-2.5 py-2 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
                >
                  {/* Glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b9d]/0 to-[#ff6b9d]/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-[10px]" />
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{topic.emoji}</span>
                      <span className="text-[11px] text-white/80 font-medium">{topic.text}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-white/50">{topic.count}</span>
                      <span className="text-[10px] text-green-400 font-semibold">{topic.trend}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Quick action */}
            <div className="mt-3 pt-3 border-t border-white/5">
              <button className="w-full py-1.5 rounded-lg bg-[#ff6b9d]/10 border border-[#ff6b9d]/20 text-xs font-semibold text-[#ff6b9d] hover:bg-[#ff6b9d]/20 hover:border-[#ff6b9d]/30 transition-all">
                Explore Topics
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}