import { motion } from 'motion/react';
import { useRef, type TouchEvent } from 'react';
import { Cloud, Sparkles, Navigation, MapPin, Lightbulb, Calendar, ChevronUp } from 'lucide-react';

interface MorningBriefingProps {
  onDismiss: () => void;
  isOpen: boolean;
}

export function MorningBriefing({ onDismiss, isOpen }: MorningBriefingProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchStartTimeRef = useRef<number>(0);
  const QUICK_SWIPE_DISTANCE = 20;
  const QUICK_SWIPE_TIME_MS = 900;

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? null;
    touchStartTimeRef.current = Date.now();
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartYRef.current === null) return;
    const endY = event.changedTouches[0]?.clientY ?? touchStartYRef.current;
    const deltaY = touchStartYRef.current - endY;
    const elapsed = Date.now() - touchStartTimeRef.current;
    touchStartYRef.current = null;

    // Fast upward flick from handle dismisses immediately.
    if (deltaY >= QUICK_SWIPE_DISTANCE && elapsed <= QUICK_SWIPE_TIME_MS) {
      onDismiss();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onDismiss} />

      {/* Briefing Panel */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative w-full max-h-[90vh] flex flex-col bg-gradient-to-b from-[#1a2642] via-[#14203a] to-[#0d1520] rounded-t-[32px] shadow-[0_-8px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)]"
      >
        {/* Drag Handle */}
        <div
          className="flex justify-center pt-4 pb-3 bg-gradient-to-b from-[#1a2642] to-transparent select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          title="Swipe up from here to dismiss"
        >
          <div className="w-16 h-2 rounded-full bg-white/25" />
        </div>

        {/* Scrollable Content */}
        <div ref={contentRef} className="overflow-y-auto px-5 pb-8 touch-auto">
          {/* Header */}
          <div className="mb-6">
            <p className="text-sm text-white/50 mb-1 tracking-wide uppercase">Your Warsaw Pulse</p>
            <h2 className="text-2xl font-bold">Monday, February 9</h2>
          </div>

          {/* Weather Header Card - Premium Glass */}
          <div className="relative rounded-[24px] p-[1px] mb-4 bg-gradient-to-b from-white/20 via-white/5 to-transparent">
            <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#1a2d4f]/90 via-[#152540]/95 to-[#0d1829]/98 backdrop-blur-xl p-5">
              {/* Glossy overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[24px] pointer-events-none" />
              
              {/* Ambient glow */}
              <div className="absolute -right-20 -top-20 w-60 h-60 bg-[#3b9eff] rounded-full opacity-20 blur-[100px]" />
              
              {/* Inner highlight */}
              <div className="absolute inset-0 rounded-[24px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),inset_0_-1px_2px_rgba(0,0,0,0.3)] pointer-events-none" />
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2d5a8c]/40 to-[#1a3a5f]/60 backdrop-blur-sm flex items-center justify-center border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                    <Cloud className="w-7 h-7 text-white/90" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-5xl font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">-3°C</div>
                    <p className="text-white/60 text-sm">Overcast Clouds</p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex gap-2 mt-4">
                <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                  🦷 tooth rides
                </span>
                <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                  ☕ Coffee-worthy morning
                </span>
              </div>
            </div>
          </div>

          {/* Two Column Cards - Premium Glass */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Weather Mood */}
            <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-white/15 via-white/5 to-transparent">
              <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-b from-[#1a2642]/80 to-[#0f172a]/90 backdrop-blur-xl p-4">
                {/* Glossy top highlight */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent rounded-t-[20px] pointer-events-none" />
                
                {/* Inner glow */}
                <div className="absolute inset-0 rounded-[20px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),inset_0_-1px_2px_rgba(0,0,0,0.4)] pointer-events-none" />
                
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]" strokeWidth={2} />
                    <p className="text-xs text-white/50 uppercase tracking-wide">Weather Mood</p>
                  </div>
                  <h3 className="font-bold text-base mb-1">Cozy day</h3>
                  <p className="text-xs text-white/60 leading-relaxed">Layer up and lean into warm spots.</p>
                </div>
              </div>
            </div>

            {/* Transit Pulse */}
            <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-white/15 via-white/5 to-transparent">
              <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-b from-[#1a2642]/80 to-[#0f172a]/90 backdrop-blur-xl p-4">
                {/* Glossy top highlight */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent rounded-t-[20px] pointer-events-none" />
                
                {/* Inner glow */}
                <div className="absolute inset-0 rounded-[20px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),inset_0_-1px_2px_rgba(0,0,0,0.4)] pointer-events-none" />
                
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Navigation className="w-4 h-4 text-green-400 drop-shadow-[0_0_6px_rgba(34,197,94,0.5)]" strokeWidth={2} />
                    <p className="text-xs text-white/50 uppercase tracking-wide">Transit Pulse</p>
                  </div>
                  <h3 className="font-bold text-base mb-1 text-green-400">Clear routes</h3>
                  <p className="text-xs text-white/60 leading-relaxed">Smooth rides</p>
                </div>
              </div>
            </div>
          </div>

          {/* City Pulse */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-white/70" strokeWidth={2} />
              <h3 className="text-sm font-bold text-white/70 uppercase tracking-wide">City Pulse</h3>
            </div>
            
            <div className="space-y-2">
              <div className="relative rounded-[16px] p-[1px] bg-gradient-to-b from-white/10 via-white/5 to-transparent">
                <div className="relative overflow-hidden rounded-[16px] bg-gradient-to-b from-[#1a2642]/70 to-[#0f172a]/85 backdrop-blur-lg p-4">
                  <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/5 to-transparent rounded-t-[16px] pointer-events-none" />
                  <div className="absolute inset-0 rounded-[16px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] pointer-events-none" />
                  <p className="relative text-sm text-white/70">Live events will appear here as the city wakes up.</p>
                </div>
              </div>
              
              <div className="relative rounded-[16px] p-[1px] bg-gradient-to-b from-white/10 via-white/5 to-transparent">
                <div className="relative overflow-hidden rounded-[16px] bg-gradient-to-b from-[#1a2642]/70 to-[#0f172a]/85 backdrop-blur-lg p-4">
                  <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/5 to-transparent rounded-t-[16px] pointer-events-none" />
                  <div className="absolute inset-0 rounded-[16px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] pointer-events-none" />
                  <p className="relative text-sm text-white/70">Add your interests to see hobby-matched events.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pro Tip - Premium Glass */}
          <div className="mb-4">
            <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-white/20 via-white/5 to-transparent">
              <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#1a2d4f]/85 via-[#152540]/90 to-[#0d1829]/95 backdrop-blur-xl p-5">
                <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent rounded-[20px] pointer-events-none" />
                <div className="absolute inset-0 rounded-[20px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.12),inset_0_-1px_2px_rgba(0,0,0,0.3)] pointer-events-none" />
                
                <div className="relative flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/10 backdrop-blur-sm flex items-center justify-center border border-amber-400/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Pro tip:</p>
                    <p className="text-sm text-white/80 leading-relaxed">
                      When shopping at local markets, try to avoid shopping during peak hours to get better deals and a more authentic experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Today in Poland */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-white/70" strokeWidth={2} />
              <h3 className="text-sm font-bold text-white/70 uppercase tracking-wide">Today in Poland</h3>
            </div>
            
            <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-white/15 via-white/5 to-transparent">
              <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-b from-[#1a2642]/75 to-[#0f172a]/90 backdrop-blur-xl p-5">
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent rounded-t-[20px] pointer-events-none" />
                <div className="absolute inset-0 rounded-[20px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] pointer-events-none" />
                
                <p className="relative text-sm text-white/80 leading-relaxed">
                  On this day in 1945, the Polish city of Poznan was liberated from German occupation, marking a significant event in the country's history. Today is also a great opportunity to learn more about Poland's rich history and cultural heritage.
                </p>
              </div>
            </div>
          </div>

          {/* Swipe Up Hint / Gesture zone */}
          <div
            className="flex items-center justify-center gap-2 py-4 text-white/40 select-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <span className="text-sm">Swipe up to dismiss</span>
            <ChevronUp className="w-4 h-4" strokeWidth={2} />
          </div>

          {/* AI Attribution */}
          <p className="text-center text-xs text-white/30 pb-2">
            ✨ Personalized by AI
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
