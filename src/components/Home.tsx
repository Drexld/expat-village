import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  Mic,
  MessageSquare,
  Calendar,
  Users,
  Zap,
  Activity,
  Clock3,
  TriangleAlert,
  Sun,
  ChevronRight,
} from 'lucide-react';
import { PremiumHeader } from './PremiumHeader';
import { PremiumDailyPulse } from './PremiumDailyPulse';
import { PremiumJourney } from './PremiumJourney';
import { PremiumWarsawDaily } from './PremiumWarsawDaily';
import { PremiumCommunityCards } from './PremiumCommunityCards';
import { toast } from 'sonner';
import type {
  FreshnessMeta,
  HomePulse as HomePulseData,
  MeProgress,
} from '../services/api/types';
import { useHomeSupport, useServices } from '../services/api/hooks';

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
  homePulseData?: HomePulseData | null;
  homePulseLive?: boolean;
  homePulseFreshness?: FreshnessMeta | null;
  journeyData?: MeProgress | null;
}

export function Home({
  user,
  onOpenBriefing,
  userMood,
  homePulseData,
  homePulseLive,
  homePulseFreshness,
  journeyData,
}: HomeProps) {
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [pendingReviewCount, setPendingReviewCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const servicesApi = useServices({ fetchList: false });
  const homeSupport = useHomeSupport();

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

  useEffect(() => {
    if (!servicesApi.isLive) return;

    let active = true;
    servicesApi
      .loadPendingReviewPrompts()
      .then((prompts) => {
        if (!active) return;
        setPendingReviewCount(prompts.length);
      })
      .catch(() => {
        if (!active) return;
      });

    return () => {
      active = false;
    };
  }, [servicesApi.isLive, servicesApi.loadPendingReviewPrompts]);

  const quickActions = homeSupport.data?.quickActions || [];

  const colorFromSeverity = (severity: 'low' | 'medium' | 'high'): 'blue' | 'green' | 'amber' | 'pink' => {
    if (severity === 'high') return 'pink';
    if (severity === 'medium') return 'amber';
    return 'blue';
  };

  const colorFromIsNew = (isNew: boolean): 'blue' | 'green' | 'amber' | 'pink' => {
    return isNew ? 'green' : 'blue';
  };

  const headerNotificationItems: Array<{
    id: string;
    text: string;
    time: string;
    color: 'blue' | 'green' | 'amber' | 'pink';
  }> = [];

  for (const highlight of (homePulseData?.highlights || []).slice(0, 2)) {
    headerNotificationItems.push({
      id: `pulse-${highlight.id}`,
      text: highlight.title,
      time: new Date(highlight.publishedAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      color: colorFromSeverity(highlight.severity),
    });
  }

  for (const preview of (homeSupport.data?.community.townHall.previews || []).slice(0, 2)) {
    headerNotificationItems.push({
      id: `townhall-${preview.id}`,
      text: preview.title,
      time: preview.timestamp,
      color: colorFromIsNew(preview.isNew),
    });
  }

  if (pendingReviewCount > 0) {
    headerNotificationItems.push({
      id: 'review-prompts',
      text: `${pendingReviewCount} pending service review ${pendingReviewCount === 1 ? 'prompt' : 'prompts'}`,
      time: 'Now',
      color: 'green',
    });
  }

  const liveHeaderNotifications = headerNotificationItems.slice(0, 5);

  const resolveFreshnessState = (
    freshness?: FreshnessMeta | null,
  ): {
    label: string;
    detail: string;
    statusTone: 'good' | 'warn';
  } => {
    if (!freshness?.updatedAt) {
      return {
        label: 'Waiting for live feed',
        detail: 'No backend freshness timestamp yet.',
        statusTone: 'warn',
      };
    }

    const updatedMs = new Date(freshness.updatedAt).getTime();
    if (!Number.isFinite(updatedMs)) {
      return {
        label: 'Feed timestamp invalid',
        detail: 'Backend returned an unreadable timestamp.',
        statusTone: 'warn',
      };
    }

    const ageSeconds = Math.max(0, Math.floor((Date.now() - updatedMs) / 1000));
    const ttlSeconds = freshness.ttlSeconds || 0;
    const isFresh = ttlSeconds > 0 ? ageSeconds <= ttlSeconds : ageSeconds <= 300;

    if (isFresh) {
      return {
        label: 'Live',
        detail: `Updated ${Math.floor(ageSeconds / 60)}m ago`,
        statusTone: 'good',
      };
    }

    return {
      label: 'Stale',
      detail: `Last update ${Math.floor(ageSeconds / 60)}m ago`,
      statusTone: 'warn',
    };
  };

  const pulseFreshnessState = resolveFreshnessState(homePulseFreshness);
  const supportFreshnessState = resolveFreshnessState(homeSupport.freshness);

  const iconForQuickAction = (icon: 'calendar' | 'users' | 'message' | 'zap') => {
    if (icon === 'calendar') return Calendar;
    if (icon === 'users') return Users;
    if (icon === 'message') return MessageSquare;
    return Zap;
  };

  const colorForQuickAction = (accent: 'blue' | 'pink' | 'green' | 'amber') => {
    if (accent === 'pink') return 'from-[#ec4899] to-[#db2777]';
    if (accent === 'green') return 'from-[#10b981] to-[#059669]';
    if (accent === 'amber') return 'from-[#f59e0b] to-[#d97706]';
    return 'from-[#3b82f6] to-[#2563eb]';
  };

  const handleQuickAction = (actionId: string, label: string) => {
    if (actionId === 'book-pesel') {
      toast.info('Go to Tasks tab', { description: 'Open urgent legal tasks to continue.' });
      return;
    }
    if (actionId === 'find-expats') {
      toast.info('Go to Community tab', { description: 'Explore active Town Hall discussions.' });
      return;
    }
    if (actionId === 'ask-question') {
      toast.info('Open Warsaw Whisper', { description: 'Create a new post to ask the community.' });
      return;
    }
    if (actionId === 'find-services') {
      toast.info('Go to Discover > Warsaw Concierge', {
        description: 'Browse verified services with reviews.',
      });
      return;
    }
    toast.info(label);
  };

  return (
    <div className="min-h-screen" ref={containerRef}>
      <PremiumHeader
        user={user}
        notificationItems={liveHeaderNotifications}
        isListening={isListening}
        onVoiceCommand={handleVoiceCommand}
        voiceTranscript={voiceTranscript}
        weatherOverride={
          homePulseData
            ? {
                temp: Math.round(homePulseData.weather.temperatureC),
                condition: homePulseData.weather.condition,
              }
            : undefined
        }
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

        {pendingReviewCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.03 }}
            className="w-full mb-3 relative rounded-[16px] p-[1px] bg-gradient-to-b from-[#10b981]/35 to-[#059669]/10"
          >
            <div className="relative rounded-[16px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 p-3.5">
              <div className="absolute inset-0 rounded-[16px] bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
              <div className="relative flex items-center justify-between">
                <div className="text-left">
                  <p className="text-sm font-semibold text-green-300">Review Reminder</p>
                  <p className="text-[11px] text-white/55">
                    You have {pendingReviewCount} pending service review {pendingReviewCount === 1 ? 'prompt' : 'prompts'}.
                  </p>
                </div>
                <button
                  onClick={() =>
                    toast.info('Open Discover > Warsaw Concierge', {
                      description: 'Complete your pending review prompts there.',
                    })
                  }
                  className="px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-400/30 text-[11px] font-semibold text-green-300"
                >
                  Review
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {onOpenBriefing && (
          <motion.div
            style={{ y: y1 }}
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <PremiumDailyPulse
              onOpenBriefing={onOpenBriefing}
              userMood={userMood}
              pulseData={homePulseData}
              pulseLive={homePulseLive}
            />
          </motion.div>
        )}

        <motion.div style={{ y: y1 }} className="mb-4">
          <PremiumJourney user={user} journeyData={journeyData} />
        </motion.div>

        <motion.div style={{ y: y2 }} className="grid grid-cols-2 gap-4 mb-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-2"
          >
            <PremiumWarsawDaily
              streak={user.streak}
              weatherChallenge={homeSupport.data?.warsawDaily.weatherChallenge}
              wisdomChallenge={homeSupport.data?.warsawDaily.wisdomChallenge}
              leaderboard={homeSupport.data?.warsawDaily.leaderboard}
              isLive={homeSupport.isLive}
            />
          </motion.div>

          <PremiumCommunityCards
            townHall={homeSupport.data?.community.townHall || null}
            hotTopics={homeSupport.data?.community.hotTopics || []}
            isLive={homeSupport.isLive}
          />
        </motion.div>

        <motion.div style={{ y: y3 }}>
          <div className="mb-4 relative rounded-[20px] p-[1px] bg-gradient-to-b from-[#3b9eff]/30 to-[#8b5cf6]/10">
            <div className="relative rounded-[20px] bg-gradient-to-br from-[#1a2642]/90 to-[#0f172a]/95 p-4">
              <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent rounded-[20px] pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-[#3b9eff]" strokeWidth={2} />
                  <p className="text-xs text-[#3b9eff] font-semibold">POLAND LIVE FEEDS</p>
                </div>
                <h3 className="text-sm font-bold mb-2">Immigration, legal, transport, weather in English</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-[12px] bg-[#3b9eff]/15 border border-[#3b9eff]/25">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock3 className="w-3.5 h-3.5 text-[#3b9eff]" strokeWidth={2} />
                      <p className="text-[11px] font-semibold">Pulse Feed</p>
                    </div>
                    <p className={`text-[10px] ${pulseFreshnessState.statusTone === 'good' ? 'text-green-300' : 'text-amber-300'}`}>
                      {pulseFreshnessState.label}
                    </p>
                    <p className="text-[10px] text-white/60">{pulseFreshnessState.detail}</p>
                  </div>
                  <div className="p-2.5 rounded-[12px] bg-[#10b981]/15 border border-[#10b981]/25">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock3 className="w-3.5 h-3.5 text-[#10b981]" strokeWidth={2} />
                      <p className="text-[11px] font-semibold">Home Support</p>
                    </div>
                    <p className={`text-[10px] ${supportFreshnessState.statusTone === 'good' ? 'text-green-300' : 'text-amber-300'}`}>
                      {supportFreshnessState.label}
                    </p>
                    <p className="text-[10px] text-white/60">{supportFreshnessState.detail}</p>
                  </div>
                </div>
                {(pulseFreshnessState.statusTone === 'warn' || supportFreshnessState.statusTone === 'warn') && (
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-amber-300">
                    <TriangleAlert className="w-3.5 h-3.5" strokeWidth={2} />
                    <span>Feed may be stale. Check ingestion jobs.</span>
                  </div>
                )}
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
            {quickActions.map((action, index) => {
              const Icon = iconForQuickAction(action.icon);
              return (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickAction(action.id, action.label)}
                  className="relative overflow-hidden rounded-[20px] bg-gradient-to-b from-[#1a2642] via-[#14203a] to-[#0f1829] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.3)] p-4 text-left group"
                >
                  <div className={`w-10 h-10 rounded-[14px] bg-gradient-to-br ${colorForQuickAction(action.accent)} flex items-center justify-center mb-3 shadow-[0_4px_12px_rgba(0,0,0,0.3)] group-hover:shadow-[0_6px_20px_rgba(0,0,0,0.4)] transition-all`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-[13px] font-semibold">{action.label}</p>
                  <p className="text-[10px] text-white/50 mt-0.5">{action.subtitle}</p>
                </motion.button>
              );
            })}
          </motion.div>
          {!homeSupport.isLoading && quickActions.length === 0 && (
            <div className="mt-3 text-xs text-white/50">
              Quick actions are syncing from live backend.
            </div>
          )}
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
