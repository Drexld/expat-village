import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  Mic,
  MessageSquare,
  Calendar,
  Users,
  Zap,
  BrainCircuit,
  UtensilsCrossed,
  Sun,
  ChevronRight,
} from 'lucide-react';
import { PremiumHeader } from './PremiumHeader';
import { PremiumDailyPulse } from './PremiumDailyPulse';
import { PremiumJourney } from './PremiumJourney';
import { PremiumWarsawDaily } from './PremiumWarsawDaily';
import { PremiumCommunityCards } from './PremiumCommunityCards';
import { toast } from 'sonner';

interface HomeProps {
  user: {
    name: string;
    level: string;
    points: number;
    streak: number;
    completedTasks: number;
    totalTasks: number;
  };
  onOpenBriefing?: () => void;
  userMood?: string;
}

export function Home({ user, onOpenBriefing, userMood }: HomeProps) {
  const [notifications] = useState(3);
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -30]);
  const y3 = useTransform(scrollY, [0, 300], [0, -15]);

  const handleVoiceCommand = () => {
    setIsListening(true);
    setVoiceTranscript('Show my next task');

    setTimeout(() => {
      setIsListening(false);
      setVoiceTranscript('');

      const nextTask = 'Get PESEL number';
      toast.success('Your next task', {
        description: nextTask,
        duration: 3000,
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen" ref={containerRef}>
      <PremiumHeader
        user={user}
        notifications={notifications}
        isListening={isListening}
        onVoiceCommand={handleVoiceCommand}
        voiceTranscript={voiceTranscript}
      />

      <div className="px-5 pb-8">
        {onOpenBriefing && (
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.02 }}
            onClick={onOpenBriefing}
            className="w-full mb-3 relative rounded-[16px] p-[1px] bg-gradient-to-b from-[#3b9eff]/35 to-[#2d7dd2]/10"
          >
            <div className="relative rounded-[16px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 p-3.5">
              <div className="absolute inset-0 rounded-[16px] bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#3b9eff]/20 flex items-center justify-center">
                    <Sun className="w-4 h-4 text-[#3b9eff]" strokeWidth={2} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">Open Morning Briefing</p>
                    <p className="text-[11px] text-white/55">Review your Warsaw pulse any time</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/50" strokeWidth={2} />
              </div>
            </div>
          </motion.button>
        )}

        {onOpenBriefing && (
          <motion.div
            style={{ y: y1 }}
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <PremiumDailyPulse onOpenBriefing={onOpenBriefing} userMood={userMood} />
          </motion.div>
        )}

        <motion.div style={{ y: y1 }} className="mb-4">
          <PremiumJourney user={user} />
        </motion.div>

        <motion.div style={{ y: y2 }} className="grid grid-cols-2 gap-4 mb-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-2"
          >
            <PremiumWarsawDaily streak={user.streak} />
          </motion.div>

          <PremiumCommunityCards />
        </motion.div>

        <motion.div style={{ y: y3 }}>
          <div className="mb-4 relative rounded-[20px] p-[1px] bg-gradient-to-b from-[#3b9eff]/30 to-[#8b5cf6]/10">
            <div className="relative rounded-[20px] bg-gradient-to-br from-[#1a2642]/90 to-[#0f172a]/95 p-4">
              <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent rounded-[20px] pointer-events-none" />
              <div className="relative">
                <p className="text-xs text-[#3b9eff] font-semibold mb-1">COMPLETE AI BUILD</p>
                <h3 className="text-sm font-bold mb-2">New modules are live in Discover</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      toast.info('Open Discover > AI Hub', {
                        description: 'Predictive, DNA, Advisor, Coach, Luck, Shadow, Student AI',
                      })
                    }
                    className="p-2.5 rounded-[12px] bg-[#3b9eff]/15 border border-[#3b9eff]/25 text-left"
                  >
                    <BrainCircuit className="w-4 h-4 text-[#3b9eff] mb-1" strokeWidth={2} />
                    <p className="text-xs font-semibold">AI Hub</p>
                  </button>
                  <button
                    onClick={() =>
                      toast.info('Open Discover > Flavor Days', {
                        description: 'Daily cuisine, partner restaurants, challenges, and leaderboard',
                      })
                    }
                    className="p-2.5 rounded-[12px] bg-[#10b981]/15 border border-[#10b981]/25 text-left"
                  >
                    <UtensilsCrossed className="w-4 h-4 text-[#10b981] mb-1" strokeWidth={2} />
                    <p className="text-xs font-semibold">Flavor Days</p>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-semibold">Quick Actions</h3>
          </div>

          <motion.div
            className="grid grid-cols-2 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[
              { icon: Calendar, label: 'Book PESEL', color: 'from-[#3b82f6] to-[#2563eb]', delay: 0.6 },
              { icon: Users, label: 'Find Expats', color: 'from-[#ec4899] to-[#db2777]', delay: 0.7 },
              { icon: MessageSquare, label: 'Ask Question', color: 'from-[#10b981] to-[#059669]', delay: 0.8 },
              { icon: Zap, label: 'Find Services', color: 'from-[#f59e0b] to-[#d97706]', delay: 0.9 },
            ].map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: action.delay }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative overflow-hidden rounded-[20px] bg-gradient-to-b from-[#1a2642] via-[#14203a] to-[#0f1829] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.3)] p-4 text-left group"
                >
                  <div className={`w-10 h-10 rounded-[14px] bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 shadow-[0_4px_12px_rgba(0,0,0,0.3)] group-hover:shadow-[0_6px_20px_rgba(0,0,0,0.4)] transition-all`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-[13px] font-semibold">{action.label}</p>
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>

        {!isListening && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-6 p-4 rounded-[20px] bg-gradient-to-r from-[rgba(59,158,255,0.1)] to-[rgba(139,92,246,0.1)] border border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3b9eff] to-[#8b5cf6] flex items-center justify-center shadow-[0_4px_12px_rgba(59,158,255,0.3)]">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-semibold mb-0.5">Try voice commands</p>
                <p className="text-[11px] text-white/50">Say &quot;What&apos;s my next task?&quot;</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
