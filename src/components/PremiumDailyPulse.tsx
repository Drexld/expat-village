import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cloud, TrendingUp, ChevronDown, Sparkles, ArrowUpRight, Zap, MapPin } from 'lucide-react';
import type { HomePulse } from '../services/api/types';

interface PremiumDailyPulseProps {
  onOpenBriefing: () => void;
  userMood?: string;
  pulseData?: HomePulse | null;
  pulseLive?: boolean;
}

type HighlightKind = HomePulse['highlights'][number]['kind'];

const kindLabelMap: Record<HighlightKind, string> = {
  immigration: 'Immigration',
  transport: 'Transit',
  legal: 'Legal',
  parliament: 'Parliament',
  city: 'City',
};

export function PremiumDailyPulse({ onOpenBriefing, userMood, pulseData, pulseLive }: PremiumDailyPulseProps) {
  const [expandedAI, setExpandedAI] = useState(false);
  const [showExchange, setShowExchange] = useState(false);

  const temp = pulseData?.weather?.temperatureC ?? -3;
  const weatherCondition = pulseData?.weather?.condition || 'Overcast and cold';
  const exchangeBase = pulseData?.exchange?.base || 'USD';
  const exchangeQuote = pulseData?.exchange?.quote || 'PLN';
  const exchangeRate = pulseData?.exchange?.rate ?? 4.05;
  const exchangeChange = pulseData?.exchange?.change24h ?? 0.02;
  const exchangePositive = exchangeChange >= 0;
  const liveInsights = pulseData?.highlights || [];

  const suggestion = useMemo(() => {
    if (userMood === 'homesick') {
      return {
        message: 'Comfort food time with warm hospitality',
        cafe: 'Cafe Vinyl',
        tag: 'Cozy vibes',
        photo: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
      };
    }

    if (userMood === 'adventurous') {
      return {
        message: 'Hidden gem in Praga district',
        cafe: 'Kawiarnia Kafka',
        tag: 'Local secret',
        photo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop',
      };
    }

    if (temp < 5 || weatherCondition.toLowerCase().includes('cold')) {
      return {
        message: 'Perfect weather for hot chocolate',
        cafe: 'Cafe Relaks',
        tag: 'Warm and cozy',
        photo: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop',
      };
    }

    return {
      message: 'Great day for iced coffee',
      cafe: 'Cafe Karma',
      tag: 'Refreshing',
      photo: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400&h=300&fit=crop',
    };
  }, [userMood, temp, weatherCondition]);

  const cityHighlight = liveInsights.find((item) => item.kind === 'city');
  const hiddenGem = {
    name: cityHighlight?.title || 'Underrated pierogi spot in Mokotow',
    location: cityHighlight?.summary || 'Pierozki u Vincenta',
    distance: '1.2 km away',
    exclusive: true,
  };

  const aiCards =
    liveInsights.length > 0
      ? liveInsights.slice(0, 3).map((item) => ({
          id: item.id,
          title: `${kindLabelMap[item.kind]} update`,
          body: item.summary,
        }))
      : [
          {
            id: 'fx-fallback',
            title: 'Money update',
            body: 'PLN is stable today. Compare transfer providers before sending funds.',
          },
          {
            id: 'legal-fallback',
            title: 'Immigration note',
            body: 'PESEL and residence appointments are usually busiest mid-week. Book early.',
          },
          {
            id: 'city-fallback',
            title: 'Weekend idea',
            body: 'Museum schedules and free-entry windows can change quickly. Check before you go.',
          },
        ];

  return (
    <div className="relative rounded-[24px] p-[1px] bg-gradient-to-b from-white/25 via-white/10 to-transparent">
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-b from-[#1a2642]/90 via-[#14203a]/95 to-[#0f1829]/98 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[24px] pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-[#2d7dd2] rounded-full opacity-20 blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 rounded-[24px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),inset_0_-1px_2px_rgba(0,0,0,0.25)] pointer-events-none" />

        <div className="relative p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">Your Daily Pulse</h3>
              {pulseLive && (
                <span className="px-2 py-0.5 rounded-full bg-green-500/20 border border-green-400/25 text-[10px] font-semibold text-green-400">
                  LIVE
                </span>
              )}
            </div>
            <button
              onClick={onOpenBriefing}
              className="relative rounded-full p-[1px] bg-gradient-to-b from-white/30 via-white/15 to-transparent group"
            >
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-b from-[#2d5a8c]/90 to-[#1a3a5f]/95 backdrop-blur-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] text-xs font-semibold text-white transition-all group-hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_0_20px_rgba(59,158,255,0.4)] active:scale-95"
              >
                Full Briefing
                <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />
              </div>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="relative rounded-[16px] p-[1px] bg-gradient-to-b from-white/20 to-white/5">
              <div className="relative overflow-hidden rounded-[16px] bg-gradient-to-br from-[#2d4a7c]/60 to-[#1e3a5f]/80 backdrop-blur-md p-4 h-full">
                <div className="absolute inset-0 rounded-[16px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),inset_0_-1px_2px_rgba(0,0,0,0.3)] pointer-events-none" />

                <motion.div
                  animate={{
                    x: [0, 8, 0],
                    y: [0, -4, 0],
                    rotate: [0, 2, 0],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="mb-2"
                >
                  <Cloud className="w-9 h-9 text-white/90 drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]" strokeWidth={1.5} />
                </motion.div>

                <div className="text-3xl font-bold drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] mb-1">{Math.round(temp)} C</div>
                <p className="text-[10px] text-white/70 line-clamp-1">{weatherCondition}</p>
              </div>
            </div>

            <div className="relative rounded-[16px] p-[1px] bg-gradient-to-b from-white/20 to-white/5">
              <div className="relative overflow-hidden rounded-[16px] h-full">
                <img src={suggestion.photo} alt={suggestion.cafe} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1829]/98 via-[#1a2642]/85 to-transparent backdrop-blur-[2px]" />
                <div className="absolute inset-0 rounded-[16px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.15)] pointer-events-none" />

                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                  <p className="text-[9px] text-white/90 font-medium">{suggestion.tag}</p>
                </div>

                <div className="relative p-4 h-full flex flex-col justify-end">
                  <p className="text-xs font-semibold leading-tight mb-0.5 drop-shadow-sm">{suggestion.message}</p>
                  <div className="flex items-center gap-1">
                    <p className="text-[10px] text-[#3b9eff] drop-shadow-[0_0_8px_rgba(59,158,255,0.6)] font-medium">{suggestion.cafe}</p>
                    <ArrowUpRight className="w-3 h-3 text-[#3b9eff]" strokeWidth={2} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            onClick={() => setShowExchange(!showExchange)}
            className="relative mb-3 p-[1px] rounded-[14px] bg-gradient-to-b from-white/15 to-white/5 cursor-pointer group"
          >
            <div className="relative rounded-[14px] bg-gradient-to-b from-[#1a2642]/70 to-[#0f172a]/90 backdrop-blur-lg p-3">
              <div className="absolute inset-0 rounded-[14px] bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500/25 to-green-600/15 backdrop-blur-sm flex items-center justify-center border border-green-400/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                    <TrendingUp className="w-3.5 h-3.5 text-green-400 drop-shadow-[0_0_6px_rgba(34,197,94,0.6)]" strokeWidth={2} />
                  </div>
                  <span className="text-xs text-white/70 font-medium">
                    {exchangeBase} to {exchangeQuote}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-bold text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.4)]">{exchangeRate.toFixed(2)}</span>
                    <span className={`text-[11px] font-medium ${exchangePositive ? 'text-green-400/80' : 'text-red-400/80'}`}>
                      {exchangePositive ? '+' : ''}
                      {exchangeChange.toFixed(2)}
                    </span>
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`w-1.5 h-1.5 rounded-full ${exchangePositive ? 'bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]'}`}
                    />
                  </div>

                  <motion.div animate={{ rotate: showExchange ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4 text-white/40" strokeWidth={2} />
                  </motion.div>
                </div>
              </div>

              <AnimatePresence>
                {showExchange && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 mt-3 border-t border-white/5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/50">Trend</span>
                        <span className={`font-semibold ${exchangePositive ? 'text-green-400' : 'text-red-400'}`}>
                          {exchangePositive ? 'Rate rising' : 'Rate softening'}
                        </span>
                      </div>
                      <button className="w-full py-2 rounded-lg bg-gradient-to-b from-green-500/20 to-green-600/10 border border-green-400/20 text-xs font-semibold text-green-400 hover:from-green-500/30 hover:to-green-600/20 transition-all active:scale-95">
                        Simulate Transfer with Wise
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="relative mb-3 p-[1px] rounded-[14px] bg-gradient-to-b from-amber-400/20 via-amber-500/10 to-transparent">
            <div className="relative rounded-[14px] bg-gradient-to-br from-[#1a2642]/80 to-[#0f172a]/95 backdrop-blur-lg p-3">
              {hiddenGem.exclusive && (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400/20 to-amber-500/20 border border-amber-400/30 backdrop-blur-sm">
                  <p className="text-[9px] text-amber-400 font-bold">EXCLUSIVE</p>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400/25 to-amber-500/15 flex items-center justify-center border border-amber-400/25">
                  <Sparkles className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" strokeWidth={2} />
                </div>

                <div className="flex-1">
                  <p className="text-[10px] text-amber-400/80 uppercase tracking-wide font-bold mb-1">Warsaw Vibes</p>
                  <p className="text-sm font-semibold leading-tight mb-1">{hiddenGem.name}</p>
                  <div className="flex items-center gap-2 text-[10px] text-white/50">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" strokeWidth={2} />
                      <span className="line-clamp-1">{hiddenGem.location}</span>
                    </div>
                    <span>&bull;</span>
                    <span>{hiddenGem.distance}</span>
                  </div>
                </div>

                <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <ArrowUpRight className="w-4 h-4 text-white/70" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => setExpandedAI(!expandedAI)}
            className="w-full flex items-center justify-between py-2.5 px-3 rounded-[14px] bg-gradient-to-b from-[#2d5a8c]/35 to-[#1a3a5f]/25 border border-[#3b9eff]/20 hover:border-[#3b9eff]/35 transition-all group"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#3b9eff]" strokeWidth={2} />
              <span className="text-xs text-white/90 font-medium">AI Brief: Warsaw Insights</span>
            </div>
            <motion.div animate={{ rotate: expandedAI ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4 text-white/50 group-hover:text-white/70" strokeWidth={2} />
            </motion.div>
          </button>

          <AnimatePresence>
            {expandedAI && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-3 space-y-2">
                  {aiCards.map((card) => (
                    <div key={card.id} className="p-3 rounded-[12px] bg-white/5 border border-white/5">
                      <p className="text-xs text-white/80 leading-relaxed">
                        <span className="font-semibold text-white/95">{card.title}:</span> {card.body}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}