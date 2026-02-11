import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Mic, ChevronDown, Volume2 } from 'lucide-react';
import { BrandAsset } from './BrandAssets';

interface PremiumHeaderProps {
  user: {
    name: string;
    level: string;
    points: number;
    completedTasks: number;
    totalTasks: number;
  };
  notifications: number;
  isListening: boolean;
  onVoiceCommand: () => void;
  voiceTranscript?: string;
}

export function PremiumHeader({ user, notifications, isListening, onVoiceCommand, voiceTranscript }: PremiumHeaderProps) {
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showVoiceTooltip, setShowVoiceTooltip] = useState(true);
  const [weather, setWeather] = useState({ temp: -3, condition: 'cold' });

  const getEmotionalGreeting = () => {
    const hour = new Date().getHours();
    const weeksIn = 2;
    const temp = weather.temp;
    
    // Weather-adaptive emotional greetings
    if (temp < 0) {
      if (hour < 12) return `Chilly morning in Warsaw, ${user.name}? ☕ Warm up with these tips`;
      if (hour < 18) return `Freezing afternoon, ${user.name}? 🧣 Stay cozy with hot spots`;
      return `Cold evening, ${user.name}? 🔥 Find warm places nearby`;
    } else if (temp < 10) {
      if (hour < 12) return `Cool morning, ${user.name}! Ready for Week ${weeksIn + 1} tasks?`;
      if (hour < 18) return `Fresh afternoon, ${user.name}! ${user.completedTasks} tasks crushed today 💪`;
      return `Crisp evening, ${user.name}! You're ${user.points} points strong ⭐`;
    } else {
      if (hour < 12) return `Beautiful morning, ${user.name}! Warsaw awaits ✨`;
      if (hour < 18) return `Lovely afternoon, ${user.name}! Keep the momentum going 🚀`;
      return `Pleasant evening, ${user.name}! Well done today 🎉`;
    }
  };

  const notificationItems = [
    { type: 'visa', text: 'Visa update: Processing started', time: '2h ago', color: 'blue' },
    { type: 'chat', text: 'Sarah replied to your PESEL question', time: '3h ago', color: 'green' },
    { type: 'chat', text: 'New message in "Banking Tips" thread', time: '5h ago', color: 'green' },
  ];

  return (
    <div className="sticky top-0 z-40 px-5 pt-8 pb-4 backdrop-blur-xl bg-gradient-to-b from-[#000000] to-transparent">
      {/* Brand strip */}
      <div className="mb-3">
        <BrandAsset
          variant="icon-navy"
          className="h-6 w-6 object-contain"
          alt="Expat Village icon"
        />
      </div>

      <div className="flex items-center justify-between">
        {/* Avatar & Greeting */}
        <div className="flex items-center gap-3 flex-1">
          {/* Premium Glassmorphism Avatar */}
          <motion.button
            onClick={() => setShowAvatarMenu(!showAvatarMenu)}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <motion.div
              animate={{ scale: showAvatarMenu ? 1.1 : 1 }}
              className="relative"
            >
              {/* Outer glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#3b9eff] to-[#0066cc] rounded-full blur-lg opacity-40" />
              
              {/* Frosted glass border */}
              <div className="relative w-11 h-11 rounded-full p-[2px] bg-gradient-to-br from-white/30 via-white/10 to-transparent">
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#3b9eff] to-[#0066cc] flex items-center justify-center text-lg font-bold shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_4px_16px_rgba(0,102,204,0.4)] backdrop-blur-xl">
                  {/* Glossy overlay */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Inner highlight */}
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),inset_0_-1px_2px_rgba(0,0,0,0.2)] pointer-events-none" />
                  
                  <span className="relative z-10 drop-shadow-sm">{user.name[0]}</span>
                </div>
              </div>
            </motion.div>
            
            {/* Avatar Quick Stats Popup */}
            <AnimatePresence>
              {showAvatarMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="absolute top-14 left-0 w-56 rounded-[20px] p-[1px] bg-gradient-to-b from-white/25 via-white/10 to-transparent z-50"
                >
                  <div className="relative rounded-[20px] bg-gradient-to-b from-[#1a2642]/95 to-[#0f172a]/98 backdrop-blur-xl p-4 shadow-[0_12px_48px_rgba(0,0,0,0.7)]">
                    {/* Glossy overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[20px] pointer-events-none" />
                    
                    {/* Inner highlight */}
                    <div className="absolute inset-0 rounded-[20px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),inset_0_-1px_2px_rgba(0,0,0,0.3)] pointer-events-none" />
                    
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3b9eff] to-[#0066cc] flex items-center justify-center text-base font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
                          {user.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{user.name}</p>
                          <p className="text-xs text-white/50">{user.level}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                          <span className="text-xs text-white/70">📍 Time in Poland</span>
                          <span className="text-xs font-semibold">2 weeks</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                          <span className="text-xs text-white/70">⭐ Points Earned</span>
                          <span className="text-xs font-semibold text-[#3b9eff]">{user.points}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                          <span className="text-xs text-white/70">✅ Tasks Completed</span>
                          <span className="text-xs font-semibold text-green-400">{user.completedTasks}/{user.totalTasks}</span>
                        </div>
                      </div>
                      
                      <button className="w-full py-2 rounded-lg bg-gradient-to-b from-[#2d5a8c] to-[#1a3a5f] text-xs font-semibold shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_4px_12px_rgba(59,158,255,0.3)] hover:shadow-[0_6px_20px_rgba(59,158,255,0.4)] active:scale-95 transition-all">
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Emotional Greeting */}
          <div className="flex-1 min-w-0">
            <motion.p 
              key={getEmotionalGreeting()}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[13px] text-white/90 font-medium leading-tight line-clamp-2"
            >
              {getEmotionalGreeting()}
            </motion.p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Premium Voice Command with Transcription */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setShowVoiceTooltip(false);
                onVoiceCommand();
              }}
              className={`relative p-2.5 rounded-full transition-all ${
                isListening
                  ? 'bg-gradient-to-b from-[#ff6b9d] to-[#ff4757]'
                  : 'bg-gradient-to-b from-[#1e293b] to-[#0f172a]'
              } shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_12px_rgba(0,0,0,0.3)]`}
            >
              {/* Pulsing ring when not listening */}
              {!isListening && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-[#3b9eff]"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              
              {isListening && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-[#ff6b9d]"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              <Mic className={`w-5 h-5 relative z-10 ${isListening ? 'text-white' : 'text-white/70'}`} />
            </motion.button>

            {/* Real-time Transcription Bubble */}
            <AnimatePresence>
              {isListening && voiceTranscript && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  className="absolute top-12 right-0 w-48 rounded-[16px] p-[1px] bg-gradient-to-b from-white/25 to-white/10"
                >
                  <div className="rounded-[16px] bg-gradient-to-b from-[#1a2642]/98 to-[#0f172a]/98 backdrop-blur-xl p-3 shadow-[0_8px_32px_rgba(0,0,0,0.7)]">
                    <div className="flex items-start gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        <Volume2 className="w-4 h-4 text-[#ff6b9d]" strokeWidth={2} />
                      </motion.div>
                      <p className="text-xs text-white/90 leading-relaxed flex-1">
                        "{voiceTranscript}"
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tooltip with Voice Guide */}
            <AnimatePresence>
              {showVoiceTooltip && !isListening && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-12 right-0 w-52 rounded-[16px] p-[1px] bg-gradient-to-b from-white/20 to-white/5"
                >
                  <div className="rounded-[16px] bg-gradient-to-b from-[#1a2642]/95 to-[#0f172a]/98 backdrop-blur-xl p-3 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
                    <div className="space-y-2">
                      <p className="text-[10px] text-white/80 leading-relaxed">
                        🎙️ <span className="text-[#3b9eff]">Try: "Next PESEL step?"</span>
                      </p>
                      <div className="pt-2 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center">
                            <span className="text-[8px]">🇵🇱</span>
                          </div>
                          <p className="text-[9px] text-white/60">
                            Exclusive: Polish local explains PESEL
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Premium Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-full bg-gradient-to-b from-[#1e293b] to-[#0f172a] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_12px_rgba(0,0,0,0.3)]"
            >
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-b from-[#ff3b67] to-[#ff1744] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-[0_2px_12px_rgba(255,59,103,0.5)]"
                >
                  {notifications}
                </motion.span>
              )}
            </button>

            {/* Premium Notifications Preview */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="absolute top-14 right-0 w-80 rounded-[20px] p-[1px] bg-gradient-to-b from-white/25 via-white/10 to-transparent z-50"
                >
                  <div className="relative rounded-[20px] bg-gradient-to-b from-[#1a2642]/95 to-[#0f172a]/98 backdrop-blur-xl p-4 shadow-[0_12px_48px_rgba(0,0,0,0.7)]">
                    {/* Glossy overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[20px] pointer-events-none" />
                    
                    {/* Inner highlight */}
                    <div className="absolute inset-0 rounded-[20px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.15)] pointer-events-none" />
                    
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold">Notifications</h3>
                        <span className="text-xs text-white/50">{notifications} new</span>
                      </div>
                      
                      <div className="space-y-2.5">
                        {notificationItems.map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative p-3 rounded-[12px] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-[#3b9eff]/30 transition-all cursor-pointer group"
                          >
                            <div className="absolute inset-0 rounded-[12px] bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
                            
                            <div className="relative flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-1.5 ${
                                item.color === 'blue' ? 'bg-[#3b9eff]' : 'bg-green-400'
                              } shadow-[0_0_8px_currentColor]`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-white/90 leading-relaxed group-hover:text-white">{item.text}</p>
                                <p className="text-[10px] text-white/40 mt-1">{item.time}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      
                      <button className="mt-3 w-full py-2 rounded-lg bg-gradient-to-b from-[#2d5a8c] to-[#1a3a5f] text-xs font-semibold shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_12px_rgba(59,158,255,0.3)] hover:shadow-[0_6px_20px_rgba(59,158,255,0.4)] active:scale-95 transition-all">
                        View All Notifications
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
