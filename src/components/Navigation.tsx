import { Home, ListChecks, Compass, MessageSquare, User } from 'lucide-react';
import { motion } from 'motion/react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'checklist', icon: ListChecks, label: 'Tasks' },
    { id: 'discover', icon: Compass, label: 'Discover' },
    { id: 'community', icon: MessageSquare, label: 'Forum' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-8 px-5">
      <div className="relative w-full max-w-md">
        <div className="relative rounded-[32px] bg-gradient-to-b from-[#1a2947] to-[#0d1829] shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)] px-4 py-4">
          <div className="absolute inset-0 rounded-[32px] shadow-[inset_0_2px_12px_rgba(0,0,0,0.4)] pointer-events-none" />

          <div className="relative flex items-center justify-around">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              if (isActive) {
                return (
                  <div key={tab.id} className="relative flex items-center justify-center">
                    <motion.button
                      onClick={() => onTabChange(tab.id)}
                      className="relative z-10"
                      whileTap={{ scale: 0.95 }}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                        <motion.div
                          className="w-[90px] h-[90px] rounded-full"
                          style={{
                            background: 'radial-gradient(circle, rgba(59,158,255,0.4) 0%, rgba(59,158,255,0) 70%)',
                            filter: 'blur(12px)',
                          }}
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.6, 0.8, 0.6],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        />
                      </div>

                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[68px] h-[68px] rounded-full border-[3px] border-[#3b9eff] shadow-[0_0_20px_rgba(59,158,255,0.5),inset_0_0_20px_rgba(59,158,255,0.2)] pointer-events-none" />

                      <div className="relative w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-b from-[#2d5a8c] to-[#1a3a5f] shadow-[inset_0_2px_0_rgba(255,255,255,0.1),inset_0_-2px_8px_rgba(0,0,0,0.3),0_4px_20px_rgba(59,158,255,0.4)]">
                        <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                      </div>
                    </motion.button>
                  </div>
                );
              }

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className="relative flex flex-col items-center justify-center gap-1 w-11"
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Icon className="w-[22px] h-[22px] text-white/30 hover:text-white/50 transition-colors" strokeWidth={2} />
                  <span className="text-[9px] text-white/30 font-medium">{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
