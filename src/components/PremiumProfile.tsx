import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, MapPin, Share2, Award, TrendingUp, Users, Settings, ChevronRight, Lock, Bell, Globe, HelpCircle, Crown, Sparkles, Calendar, MessageCircle, Zap, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import type { MeBadgeProgress, MeConnectionSummary, MeInsights, MeJourneyEvent, MeProfile, MeProgress } from '../services/api/types';

interface PremiumProfileProps {
  user: {
    name: string;
    level: string;
    points: number;
    streak: number;
    completedTasks: number;
    totalTasks: number;
    badges: string[];
  };
  profileData?: MeProfile | null;
  progressData?: MeProgress | null;
  profileLive?: boolean;
}

export function PremiumProfile({ user, profileData, progressData, profileLive }: PremiumProfileProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState(profileData?.bio || 'From NYC, Week 2 in Warsaw. Seeking Language Buddies!');

  const defaultBadges: MeBadgeProgress[] = [
    { id: 'early-adopter', name: 'Early Adopter', emoji: '??', category: 'Arrival', unlocked: true, progress: 100 },
    { id: 'first-steps', name: 'First Steps', emoji: '??', category: 'Arrival', unlocked: true, progress: 100 },
    { id: 'week-one', name: 'Week One Warrior', emoji: '???', category: 'Daily', unlocked: true, progress: 100 },
    { id: 'helpful', name: 'Helpful', emoji: '??', category: 'Community', unlocked: false, progress: 60 },
    { id: 'social-butterfly', name: 'Social Butterfly', emoji: '??', category: 'Community', unlocked: false, progress: 40 },
    { id: 'warsaw-insider', name: 'Warsaw Insider', emoji: '??', category: 'Long-Term', unlocked: false, progress: 20 },
    { id: 'village-elder', name: 'Village Elder', emoji: '??', category: 'Long-Term', unlocked: false, progress: 5 },
    { id: 'polish-curator', name: 'Polish Playlist Curator', emoji: '??', category: 'Vibes', unlocked: false, progress: 75 },
  ];

  const defaultJourney: MeJourneyEvent[] = [
    { date: 'Jan 28, 2026', event: 'Arrived in Warsaw', icon: '??', completed: true },
    { date: 'Jan 29, 2026', event: 'First SIM card', icon: '??', completed: true },
    { date: 'Jan 30, 2026', event: 'Bank account opened', icon: '??', completed: true },
    { date: 'Feb 9, 2026', event: 'PESEL appointment', icon: '??', completed: false },
    { date: 'Feb 15, 2026', event: 'Residence permit', icon: '??', completed: false },
  ];

  const defaultConnections: MeConnectionSummary[] = [
    { name: 'Sarah M.', status: 'Online', avatar: 'S', country: 'UK', sharedTasks: 3 },
    { name: 'Luca R.', status: 'Offline', avatar: 'L', country: 'Italy', sharedTasks: 5 },
    { name: 'Priya S.', status: 'Online', avatar: 'P', country: 'India', sharedTasks: 2 },
  ];

  const defaultInsights: MeInsights = {
    aheadOfAverage: 20,
    activityBreakdown: { checklist: 60, community: 25, vibes: 15 },
    forecast: { daysToSettled: 21, confidence: 85 },
    streakCalendar: Array(28)
      .fill(0)
      .map((_, i) => i < 7),
  };

  const badges = progressData?.badges || defaultBadges;
  const journey = progressData?.journey || defaultJourney;
  const connections = progressData?.connections || defaultConnections;
  const insights = progressData?.insights || defaultInsights;

  useEffect(() => {
    if (profileData?.bio) {
      setBio(profileData.bio);
    }
  }, [profileData?.bio]);

  const handleShareStory = () => {
    toast.success('📤 Story shared!', {
      description: 'Your Warsaw journey is inspiring others',
      duration: 2000,
    });
  };

  const handleQRCode = () => {
    setShowQRCode(true);
    toast.info('🔗 Your Expat ID Card', {
      description: 'Scan to connect at meetups',
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0a0e1a] to-[#000000] text-white">
      {/* Header with Warsaw Skyline Gradient */}
      <div className="relative overflow-hidden">
        {/* Vistula River Dusk Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2947]/80 via-[#0d1829]/60 to-transparent h-48" />
        
        {/* Subtle skyline pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-48 bg-gradient-to-b from-white/10 to-transparent" 
               style={{ 
                 backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(255,255,255,0.03) 30px, rgba(255,255,255,0.03) 60px)' 
               }} 
          />
        </div>

        {/* Content */}
        <div className="relative px-5 pt-8 pb-6">
          {/* Top Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Profile</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70 font-semibold">
                {profileLive ? 'LIVE' : 'PREVIEW'}
              </span>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2.5 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              <Settings className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>

          {/* Avatar & Bio Card */}
          <div className="relative rounded-[24px] p-[1px] bg-gradient-to-b from-white/25 to-white/10">
            <div className="relative rounded-[24px] bg-gradient-to-br from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-5">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[24px] pointer-events-none" />
              
              <div className="relative flex items-start gap-4">
                {/* Avatar with AR Option */}
                <div className="relative">
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#3b9eff] to-[#8b5cf6] flex items-center justify-center text-3xl font-bold shadow-[0_8px_32px_rgba(59,158,255,0.5)]">
                    <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]" />
                    <span className="relative">{user.name[0]}</span>
                  </div>
                  <button
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-b from-[#ec4899] to-[#db2777] flex items-center justify-center shadow-[0_4px_12px_rgba(236,72,153,0.5)]"
                  >
                    <Camera className="w-4 h-4 text-white" strokeWidth={2} />
                  </button>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold">{user.name}</h2>
                    <span className="px-2 py-0.5 rounded-full bg-[#f59e0b]/20 text-[#f59e0b] text-xs font-bold flex items-center gap-1">
                      <Crown className="w-3 h-3" strokeWidth={2} />
                      {user.level}
                    </span>
                  </div>
                  
                  {editingBio ? (
                    <input
                      type="text"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      onBlur={() => setEditingBio(false)}
                      className="w-full bg-white/10 rounded-lg px-3 py-1.5 text-sm text-white/90 outline-none border border-[#3b9eff]/30"
                      autoFocus
                    />
                  ) : (
                    <p 
                      onClick={() => setEditingBio(true)}
                      className="text-sm text-white/70 leading-relaxed cursor-pointer hover:text-white/90 transition-colors"
                    >
                      {bio}
                    </p>
                  )}

                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={handleQRCode}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3b9eff]/20 hover:bg-[#3b9eff]/30 text-xs font-semibold text-[#3b9eff] transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5" strokeWidth={2} />
                      Expat ID
                    </button>
                    <button
                      onClick={handleShareStory}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" strokeWidth={2} />
                      Share Story
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-5 pb-24 space-y-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-3">
          <div className="relative rounded-[16px] p-[1px] bg-gradient-to-b from-white/20 to-white/5">
            <div className="relative rounded-[16px] bg-gradient-to-b from-[#1a2642]/80 to-[#0f172a]/90 backdrop-blur-xl p-3 text-center">
              <p className="text-2xl font-bold text-[#3b9eff]">{user.points}</p>
              <p className="text-[10px] text-white/50 uppercase tracking-wide">Points</p>
            </div>
          </div>
          <div className="relative rounded-[16px] p-[1px] bg-gradient-to-b from-white/20 to-white/5">
            <div className="relative rounded-[16px] bg-gradient-to-b from-[#1a2642]/80 to-[#0f172a]/90 backdrop-blur-xl p-3 text-center">
              <p className="text-2xl font-bold text-[#ff6b9d]">{user.streak}</p>
              <p className="text-[10px] text-white/50 uppercase tracking-wide">Day Streak</p>
            </div>
          </div>
          <div className="relative rounded-[16px] p-[1px] bg-gradient-to-b from-white/20 to-white/5">
            <div className="relative rounded-[16px] bg-gradient-to-b from-[#1a2642]/80 to-[#0f172a]/90 backdrop-blur-xl p-3 text-center">
              <p className="text-2xl font-bold text-[#10b981]">{user.completedTasks}</p>
              <p className="text-[10px] text-white/50 uppercase tracking-wide">Tasks Done</p>
            </div>
          </div>
        </div>

        {/* AI Insights & Forecast */}
        <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-amber-400/30 to-amber-500/10">
          <div className="relative rounded-[20px] bg-gradient-to-br from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent rounded-[20px] pointer-events-none" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-amber-400" strokeWidth={2} />
                <h3 className="font-bold">AI Insights</h3>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-[12px] bg-white/5 border border-white/5">
                  <p className="text-sm text-white/90 leading-relaxed">
                    🚀 <span className="font-semibold">You're {insights.aheadOfAverage}% ahead</span> of average expats in admin tasks—great job!
                  </p>
                </div>

                <div className="p-3 rounded-[12px] bg-green-500/10 border border-green-400/20">
                  <p className="text-sm text-green-400 font-semibold mb-1">Expat Forecast</p>
                  <p className="text-xs text-white/70 leading-relaxed">
                    At this rate, you'll be <span className="font-semibold text-white/90">Settled in {insights.forecast.daysToSettled} days</span> ({insights.forecast.confidence}% confidence)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-white/20 to-white/5">
          <div className="relative rounded-[20px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent rounded-[20px] pointer-events-none" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Your Warsaw Journey</h3>
                <span className="text-xs text-white/50">{progressData?.weekLabel || 'Week 2'}</span>
              </div>

              <div className="space-y-3">
                {journey.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                      item.completed 
                        ? 'bg-gradient-to-br from-green-500/30 to-green-600/20 border border-green-400/30' 
                        : 'bg-white/5 border border-white/10'
                    }`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${item.completed ? 'text-white/90' : 'text-white/60'}`}>
                        {item.event}
                      </p>
                      <p className="text-xs text-white/40">{item.date}</p>
                    </div>
                    {item.completed && (
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-xs">✓</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements & Badges */}
        <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-white/20 to-white/5">
          <div className="relative rounded-[20px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent rounded-[20px] pointer-events-none" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#f59e0b]" strokeWidth={2} />
                  <h3 className="font-bold">Achievements</h3>
                </div>
                <span className="text-xs text-white/50">{badges.filter(b => b.unlocked).length}/{badges.length}</span>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {badges.map((badge) => (
                  <motion.div
                    key={badge.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <div className={`aspect-square rounded-[16px] p-3 text-center ${
                      badge.unlocked
                        ? 'bg-gradient-to-br from-[#f59e0b]/30 to-[#d97706]/20 border border-[#f59e0b]/40'
                        : 'bg-white/5 border border-white/5 opacity-50'
                    }`}>
                      {badge.unlocked && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[10px]"
                        >
                          ✓
                        </motion.div>
                      )}
                      <div className="text-2xl mb-1">{badge.emoji}</div>
                      <p className="text-[8px] font-semibold line-clamp-2 leading-tight">{badge.name}</p>
                      
                      {!badge.unlocked && badge.progress > 0 && (
                        <div className="mt-1 h-1 rounded-full bg-white/10 overflow-hidden">
                          <div 
                            className="h-full bg-[#3b9eff] rounded-full"
                            style={{ width: `${badge.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Connections */}
        <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-white/20 to-white/5">
          <div className="relative rounded-[20px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent rounded-[20px] pointer-events-none" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#3b9eff]" strokeWidth={2} />
                  <h3 className="font-bold">Expat Network</h3>
                </div>
                <button className="text-xs text-[#3b9eff] font-semibold hover:text-[#5fb3ff]">
                  Find More →
                </button>
              </div>

              <div className="space-y-3">
                {connections.map((conn, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-[12px] bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3b9eff] to-[#8b5cf6] flex items-center justify-center font-bold">
                        {conn.avatar}
                      </div>
                      {conn.status === 'Online' && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-[#0f172a]" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{conn.name}</p>
                      <p className="text-xs text-white/50">From {conn.country} • {conn.sharedTasks} shared tasks</p>
                    </div>

                    <button className="p-2 rounded-lg bg-[#3b9eff]/20 hover:bg-[#3b9eff]/30 transition-colors">
                      <MessageCircle className="w-4 h-4 text-[#3b9eff]" strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-end justify-center"
            onClick={() => setShowSettings(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-t-[28px] p-[1px] bg-gradient-to-b from-white/30 to-white/10"
            >
              <div className="rounded-t-[28px] bg-gradient-to-b from-[#1a2642]/98 to-[#0f172a]/98 backdrop-blur-xl p-6 max-h-[80vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-6">Settings</h3>
                
                <div className="space-y-3">
                  {[
                    { icon: Lock, label: 'Account & Privacy', color: 'text-[#3b9eff]' },
                    { icon: Crown, label: 'Subscription', color: 'text-[#f59e0b]', badge: 'Premium' },
                    { icon: Bell, label: 'Notifications', color: 'text-[#ec4899]' },
                    { icon: Globe, label: 'Language', color: 'text-[#10b981]' },
                    { icon: HelpCircle, label: 'Help & Support', color: 'text-white/70' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      className="w-full flex items-center justify-between p-4 rounded-[16px] bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-5 h-5 ${item.color}`} strokeWidth={2} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-[#f59e0b]/20 text-[#f59e0b] text-xs font-bold">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="w-5 h-5 text-white/30" strokeWidth={2} />
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full mt-6 py-3 rounded-lg bg-white/10 hover:bg-white/15 font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-5"
            onClick={() => setShowQRCode(false)}
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
                <h3 className="text-lg font-bold mb-4 text-center">Expat ID Card</h3>
                
                <div className="aspect-square rounded-[16px] bg-white p-4 mb-4 flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-br from-[#3b9eff]/20 to-[#8b5cf6]/20 rounded-lg flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-[#1a2642]" strokeWidth={1} />
                  </div>
                </div>

                <p className="text-sm text-center text-white/70 mb-4">
                  Scan to connect at expat meetups
                </p>

                <button
                  onClick={() => setShowQRCode(false)}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-b from-[#3b9eff] to-[#2d7dd2] font-semibold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


