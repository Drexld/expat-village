import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Mic, ChevronDown } from 'lucide-react';

interface HeaderProps {
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
}

export function Header({ user, notifications, isListening, onVoiceCommand }: HeaderProps) {
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showVoiceTooltip, setShowVoiceTooltip] = useState(true);

  const greeting = () => {
    const hour = new Date().getHours();
    const weeksIn = 2;
    if (hour < 12) return `Good morning ${user.name}—ready for Week ${weeksIn + 1} tasks?`;
    if (hour < 18) return `Good afternoon ${user.name}—${user.completedTasks} tasks done today!`;
    return `Good evening ${user.name}—you're ${user.points} points strong!`;
  };

  const notificationItems = [
    { type: 'visa', text: 'Visa update: Processing started', time: '2h ago', color: 'blue' },
    { type: 'chat', text: 'Sarah replied to your PESEL question', time: '3h ago', color: 'green' },
    { type: 'chat', text: 'New message in "Banking Tips" thread', time: '5h ago', color: 'green' },
  ];

  return (
    <div className="sticky top-0 z-40 px-5 pt-8 pb-4 backdrop-blur-xl bg-gradient-to-b from-[#000000] to-transparent">
      <div className="flex items-center justify-between">
        {/* Avatar & Greeting */}
        <div className="flex items-center gap-3 flex-1">
          <motion.button
            onClick={() => setShowAvatarMenu(!showAvatarMenu)}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <motion.div
              animate={{ scale: showAvatarMenu ? 1.1 : 1 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#3b9eff] to-[#0066cc] rounded-full blur-lg opacity-40" />
              <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-[#3b9eff] to-[#0066cc] flex items-center justify-center text-lg font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_16px_rgba(0,102,204,0.4)]">
                {user.name[0]}
              </div>
            </motion.div>
            
            {/* Avatar Quick Stats Popup */}
            <AnimatePresence>
              {showAvatarMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="absolute top-14 left-0 w-48 rounded-[16px] p-[1px] bg-gradient-to-b from-white/20 via-white/5 to-transparent z-50"
                >
                  <div className="rounded-[16px] bg-gradient-to-b from-[#1a2642]/95 to-[#0f172a]/98 backdrop-blur-xl p-3 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
                    <div className="absolute inset-0 rounded-[16px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] pointer-events-none" />
                    
                    <p className="text-sm font-semibold mb-2">{user.name}</p>
                    <div className="space-y-1.5 text-xs text-white/70">
                      <p>📍 2 weeks in Poland</p>
                      <p>⭐ {user.points} points earned</p>
                      <p>✅ {user.completedTasks}/{user.totalTasks} tasks done</p>
                    </div>
                    <button className="mt-3 w-full py-1.5 rounded-lg bg-gradient-to-b from-[#2d5a8c] to-[#1a3a5f] text-xs font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_0_12px_rgba(59,158,255,0.3)]">
                      Edit Profile
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-white/90 font-medium leading-tight line-clamp-2">{greeting()}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Voice Command with Tooltip */}
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

            {/* Tooltip */}
            <AnimatePresence>
              {showVoiceTooltip && !isListening && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-12 right-0 w-40 rounded-[12px] p-[1px] bg-gradient-to-b from-white/20 to-white/5"
                >
                  <div className="rounded-[12px] bg-gradient-to-b from-[#1a2642]/95 to-[#0f172a]/98 backdrop-blur-xl p-2 shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
                    <p className="text-[10px] text-white/80 leading-relaxed">
                      Tap to ask <span className="text-[#3b9eff]">"Next PESEL step?"</span>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications Bell with Preview */}
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

            {/* Notifications Preview */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="absolute top-14 right-0 w-72 rounded-[16px] p-[1px] bg-gradient-to-b from-white/20 via-white/5 to-transparent z-50"
                >
                  <div className="rounded-[16px] bg-gradient-to-b from-[#1a2642]/95 to-[#0f172a]/98 backdrop-blur-xl p-3 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
                    <div className="absolute inset-0 rounded-[16px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] pointer-events-none" />
                    
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold">Notifications</h3>
                      <span className="text-xs text-white/50">{notifications} new</span>
                    </div>
                    
                    <div className="space-y-2">
                      {notificationItems.map((item, index) => (
                        <div
                          key={index}
                          className="p-2.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <div className="flex items-start gap-2">
                            <div className={`w-2 h-2 rounded-full mt-1.5 ${
                              item.color === 'blue' ? 'bg-[#3b9eff]' : 'bg-green-400'
                            } shadow-[0_0_8px_currentColor]`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-white/90 leading-relaxed">{item.text}</p>
                              <p className="text-[10px] text-white/40 mt-0.5">{item.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <button className="mt-3 w-full py-1.5 rounded-lg bg-gradient-to-b from-[#2d5a8c] to-[#1a3a5f] text-xs font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_0_12px_rgba(59,158,255,0.3)]">
                      View All
                    </button>
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
