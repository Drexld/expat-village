import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  Share2,
  Award,
  Users,
  Settings,
  ChevronRight,
  Lock,
  Bell,
  Globe,
  HelpCircle,
  Crown,
  Sparkles,
  MessageCircle,
  QrCode,
  Mail,
  LogIn,
  LogOut,
  KeyRound,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getCurrentSupabaseAuthSession,
  sendMagicLink,
  signInWithPassword,
  signOutSupabaseAuthSession,
  signUpWithPassword,
} from '../services/auth/supabaseAuth';
import type {
  MeBadgeProgress,
  MeConnectionSummary,
  MeInsights,
  MeJourneyEvent,
  MePreferences,
  MeProfile,
  MeProgress,
} from '../services/api/types';

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
  preferencesData?: MePreferences | null;
  profileLive?: boolean;
  onSaveProfile?: (input: {
    displayName?: string;
    bio?: string;
    mood?: string;
    language?: string;
  }) => Promise<void>;
  onSavePreferences?: (input: {
    mood?: string;
    language?: string;
    notificationsEnabled?: boolean;
  }) => Promise<void>;
}

export function PremiumProfile({
  user,
  profileData,
  progressData,
  preferencesData,
  profileLive,
  onSaveProfile,
  onSavePreferences,
}: PremiumProfileProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState(profileData?.bio || '');
  const [isSavingBio, setIsSavingBio] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    preferencesData?.notificationsEnabled ?? true,
  );
  const [language, setLanguage] = useState(preferencesData?.language || 'en');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [showAuthPanel, setShowAuthPanel] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(Boolean(getCurrentSupabaseAuthSession()));

  const badges: MeBadgeProgress[] = progressData?.badges || [];
  const journey: MeJourneyEvent[] = progressData?.journey || [];
  const connections: MeConnectionSummary[] = progressData?.connections || [];
  const insights: MeInsights | null = progressData?.insights || null;

  useEffect(() => {
    setBio(profileData?.bio || '');
  }, [profileData?.bio]);

  useEffect(() => {
    setNotificationsEnabled(preferencesData?.notificationsEnabled ?? true);
    setLanguage(preferencesData?.language || 'en');
  }, [preferencesData?.language, preferencesData?.notificationsEnabled]);

  useEffect(() => {
    setIsSignedIn(Boolean(getCurrentSupabaseAuthSession()));
  }, [showSettings]);

  const unlockedBadges = useMemo(
    () => badges.filter((badge) => badge.unlocked).length,
    [badges],
  );

  const saveBio = async () => {
    if (!onSaveProfile) return;
    setIsSavingBio(true);
    try {
      await onSaveProfile({ bio });
      toast.success('Bio updated');
    } catch (errorValue) {
      const message = errorValue instanceof Error ? errorValue.message : 'Failed to save bio';
      toast.error('Could not save bio', { description: message });
    } finally {
      setIsSavingBio(false);
      setEditingBio(false);
    }
  };

  const saveSettings = async () => {
    if (!onSavePreferences) {
      toast.info('Preferences API not connected');
      return;
    }
    setIsSavingSettings(true);
    try {
      await onSavePreferences({
        language,
        notificationsEnabled,
      });
      toast.success('Preferences updated');
      setShowSettings(false);
    } catch (errorValue) {
      const message =
        errorValue instanceof Error ? errorValue.message : 'Failed to update preferences';
      toast.error('Could not update preferences', { description: message });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleShareStory = () => {
    toast.success('Story shared', {
      description: 'Your Warsaw journey was posted.',
      duration: 2000,
    });
  };

  const handleQRCode = () => {
    setShowQRCode(true);
    toast.info('Your Expat ID card is ready');
  };

  const handleSignIn = async () => {
    if (!authEmail.trim() || !authPassword.trim()) {
      toast.error('Email and password are required');
      return;
    }
    setIsAuthLoading(true);
    try {
      await signInWithPassword(authEmail, authPassword);
      setIsSignedIn(true);
      toast.success('Signed in successfully');
      window.setTimeout(() => window.location.reload(), 250);
    } catch (errorValue) {
      const message = errorValue instanceof Error ? errorValue.message : 'Sign in failed';
      toast.error(message);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!authEmail.trim() || !authPassword.trim()) {
      toast.error('Email and password are required');
      return;
    }
    setIsAuthLoading(true);
    try {
      await signUpWithPassword(authEmail, authPassword);
      setIsSignedIn(Boolean(getCurrentSupabaseAuthSession()));
      toast.success('Account created. Check your email if confirmation is required.');
    } catch (errorValue) {
      const message = errorValue instanceof Error ? errorValue.message : 'Sign up failed';
      toast.error(message);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!authEmail.trim()) {
      toast.error('Email is required');
      return;
    }
    setIsAuthLoading(true);
    try {
      await sendMagicLink(authEmail);
      toast.success('Magic link sent. Open it on this device to sign in.');
    } catch (errorValue) {
      const message = errorValue instanceof Error ? errorValue.message : 'Could not send magic link';
      toast.error(message);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsAuthLoading(true);
    try {
      await signOutSupabaseAuthSession();
      setIsSignedIn(false);
      toast.success('Signed out');
      window.setTimeout(() => window.location.reload(), 250);
    } catch (errorValue) {
      const message = errorValue instanceof Error ? errorValue.message : 'Sign out failed';
      toast.error(message);
    } finally {
      setIsAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0a0e1a] to-[#000000] text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2947]/80 via-[#0d1829]/60 to-transparent h-48" />
        <div className="relative px-5 pt-8 pb-6">
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

          <div className="relative rounded-[24px] p-[1px] bg-gradient-to-b from-white/25 to-white/10">
            <div className="relative rounded-[24px] bg-gradient-to-br from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-5">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[24px] pointer-events-none" />

              <div className="relative flex items-start gap-4">
                <div className="relative">
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#3b9eff] to-[#8b5cf6] flex items-center justify-center text-3xl font-bold shadow-[0_8px_32px_rgba(59,158,255,0.5)]">
                    <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]" />
                    <span className="relative">{user.name[0]}</span>
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-b from-[#ec4899] to-[#db2777] flex items-center justify-center shadow-[0_4px_12px_rgba(236,72,153,0.5)]">
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
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={bio}
                        onChange={(event) => setBio(event.target.value)}
                        className="flex-1 bg-white/10 rounded-lg px-3 py-1.5 text-sm text-white/90 outline-none border border-[#3b9eff]/30"
                        autoFocus
                      />
                      <button
                        onClick={() => void saveBio()}
                        disabled={isSavingBio}
                        className="px-3 rounded-lg bg-[#3b9eff]/20 text-[#3b9eff] text-xs font-semibold disabled:opacity-60"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <p
                      onClick={() => setEditingBio(true)}
                      className="text-sm text-white/70 leading-relaxed cursor-pointer hover:text-white/90 transition-colors"
                    >
                      {bio || 'Add a short bio to personalize your profile.'}
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

      <div className="px-5 pb-[calc(8rem+env(safe-area-inset-bottom))] space-y-4">
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

        <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-amber-400/30 to-amber-500/10">
          <div className="relative rounded-[20px] bg-gradient-to-br from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent rounded-[20px] pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-amber-400" strokeWidth={2} />
                <h3 className="font-bold">AI Insights</h3>
              </div>
              {insights ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-[12px] bg-white/5 border border-white/5">
                    <p className="text-sm text-white/90 leading-relaxed">
                      You are <span className="font-semibold">{insights.aheadOfAverage}% ahead</span> of average expats in admin tasks.
                    </p>
                  </div>
                  <div className="p-3 rounded-[12px] bg-green-500/10 border border-green-400/20">
                    <p className="text-sm text-green-400 font-semibold mb-1">Expat Forecast</p>
                    <p className="text-xs text-white/70 leading-relaxed">
                      At this rate, you will be settled in{' '}
                      <span className="font-semibold text-white/90">
                        {insights.forecast.daysToSettled} days
                      </span>{' '}
                      ({insights.forecast.confidence}% confidence).
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-white/60">Insights are syncing from live backend.</p>
              )}
            </div>
          </div>
        </div>

        <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-white/20 to-white/5">
          <div className="relative rounded-[20px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent rounded-[20px] pointer-events-none" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Your Warsaw Journey</h3>
                <span className="text-xs text-white/50">{progressData?.weekLabel || 'Week'}</span>
              </div>
              <div className="space-y-3">
                {journey.map((item, index) => (
                  <div key={`${item.id || item.date}-${index}`} className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${
                        item.completed
                          ? 'bg-gradient-to-br from-green-500/30 to-green-600/20 border border-green-400/30'
                          : 'bg-white/5 border border-white/10'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          item.completed ? 'text-white/90' : 'text-white/60'
                        }`}
                      >
                        {item.event}
                      </p>
                      <p className="text-xs text-white/40">{item.date}</p>
                    </div>
                    {item.completed && (
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-xs">OK</span>
                      </div>
                    )}
                  </div>
                ))}
                {journey.length === 0 && (
                  <p className="text-xs text-white/60">No journey events yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-white/20 to-white/5">
          <div className="relative rounded-[20px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent rounded-[20px] pointer-events-none" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#f59e0b]" strokeWidth={2} />
                  <h3 className="font-bold">Achievements</h3>
                </div>
                <span className="text-xs text-white/50">
                  {unlockedBadges}/{badges.length}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {badges.map((badge) => (
                  <motion.div key={badge.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <div
                      className={`aspect-square rounded-[16px] p-3 text-center ${
                        badge.unlocked
                          ? 'bg-gradient-to-br from-[#f59e0b]/30 to-[#d97706]/20 border border-[#f59e0b]/40'
                          : 'bg-white/5 border border-white/5 opacity-50'
                      }`}
                    >
                      <div className="text-xl mb-1">{badge.emoji}</div>
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
              {badges.length === 0 && (
                <p className="text-xs text-white/60 mt-3">Badges will appear as you progress.</p>
              )}
            </div>
          </div>
        </div>

        <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-white/20 to-white/5">
          <div className="relative rounded-[20px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent rounded-[20px] pointer-events-none" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#3b9eff]" strokeWidth={2} />
                  <h3 className="font-bold">Expat Network</h3>
                </div>
              </div>
              <div className="space-y-3">
                {connections.map((connection, index) => (
                  <div
                    key={`${connection.name}-${index}`}
                    className="flex items-center gap-3 p-3 rounded-[12px] bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3b9eff] to-[#8b5cf6] flex items-center justify-center font-bold">
                        {connection.avatar}
                      </div>
                      {connection.status === 'Online' && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-[#0f172a]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{connection.name}</p>
                      <p className="text-xs text-white/50">
                        From {connection.country} | {connection.sharedTasks} shared tasks
                      </p>
                    </div>
                    <button className="p-2 rounded-lg bg-[#3b9eff]/20 hover:bg-[#3b9eff]/30 transition-colors">
                      <MessageCircle className="w-4 h-4 text-[#3b9eff]" strokeWidth={2} />
                    </button>
                  </div>
                ))}
                {connections.length === 0 && (
                  <p className="text-xs text-white/60">No connections yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

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
              onClick={(event) => event.stopPropagation()}
              className="relative w-full max-w-md rounded-t-[28px] p-[1px] bg-gradient-to-b from-white/30 to-white/10"
            >
              <div className="rounded-t-[28px] bg-gradient-to-b from-[#1a2642]/98 to-[#0f172a]/98 backdrop-blur-xl p-6 max-h-[80vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-6">Settings</h3>

                <div className="space-y-3">
                  <div className="w-full flex items-center justify-between p-4 rounded-[16px] bg-white/5">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-[#ec4899]" strokeWidth={2} />
                      <span className="font-medium">Notifications</span>
                    </div>
                    <button
                      onClick={() => setNotificationsEnabled((prev) => !prev)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        notificationsEnabled
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {notificationsEnabled ? 'On' : 'Off'}
                    </button>
                  </div>

                  <div className="w-full flex items-center justify-between p-4 rounded-[16px] bg-white/5">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-[#10b981]" strokeWidth={2} />
                      <span className="font-medium">Language</span>
                    </div>
                    <select
                      value={language}
                      onChange={(event) => setLanguage(event.target.value)}
                      className="bg-white/10 rounded-lg px-2 py-1 text-xs outline-none"
                    >
                      <option value="en">English</option>
                      <option value="pl">Polish</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setShowAuthPanel((value) => !value)}
                    className="w-full flex items-center justify-between p-4 rounded-[16px] bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-[#3b9eff]" strokeWidth={2} />
                      <span className="font-medium">Account & Privacy</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30" strokeWidth={2} />
                  </button>

                  <AnimatePresence>
                    {showAuthPanel && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="p-4 rounded-[16px] bg-white/5 border border-white/10 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold">Account Session</p>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                              isSignedIn
                                ? 'bg-green-500/20 text-green-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {isSignedIn ? 'Signed In' : 'Signed Out'}
                          </span>
                        </div>

                        <div className="relative">
                          <Mail className="w-4 h-4 text-white/50 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            value={authEmail}
                            onChange={(event) => setAuthEmail(event.target.value)}
                            placeholder="Email"
                            className="w-full bg-white/10 rounded-lg pl-9 pr-3 py-2 text-sm outline-none border border-white/10 focus:border-[#3b9eff]/40"
                          />
                        </div>

                        <div className="relative">
                          <KeyRound className="w-4 h-4 text-white/50 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="password"
                            value={authPassword}
                            onChange={(event) => setAuthPassword(event.target.value)}
                            placeholder="Password"
                            className="w-full bg-white/10 rounded-lg pl-9 pr-3 py-2 text-sm outline-none border border-white/10 focus:border-[#3b9eff]/40"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            disabled={isAuthLoading}
                            onClick={() => void handleSignIn()}
                            className="py-2 rounded-lg bg-[#3b9eff]/20 border border-[#3b9eff]/30 text-[#3b9eff] text-xs font-semibold disabled:opacity-60"
                          >
                            <span className="inline-flex items-center gap-1">
                              <LogIn className="w-3.5 h-3.5" />
                              Sign In
                            </span>
                          </button>
                          <button
                            disabled={isAuthLoading}
                            onClick={() => void handleSignUp()}
                            className="py-2 rounded-lg bg-white/10 border border-white/20 text-white text-xs font-semibold disabled:opacity-60"
                          >
                            Create Account
                          </button>
                        </div>

                        <button
                          disabled={isAuthLoading}
                          onClick={() => void handleMagicLink()}
                          className="w-full py-2 rounded-lg bg-white/10 border border-white/20 text-white text-xs font-semibold disabled:opacity-60"
                        >
                          Send Magic Link
                        </button>

                        <button
                          disabled={isAuthLoading || !isSignedIn}
                          onClick={() => void handleSignOut()}
                          className="w-full py-2 rounded-lg bg-red-500/15 border border-red-400/30 text-red-300 text-xs font-semibold disabled:opacity-60"
                        >
                          <span className="inline-flex items-center gap-1">
                            <LogOut className="w-3.5 h-3.5" />
                            Sign Out
                          </span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button className="w-full flex items-center justify-between p-4 rounded-[16px] bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-white/70" strokeWidth={2} />
                      <span className="font-medium">Help & Support</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30" strokeWidth={2} />
                  </button>
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => void saveSettings()}
                    disabled={isSavingSettings}
                    className="flex-1 py-3 rounded-lg bg-gradient-to-b from-[#3b9eff] to-[#2d7dd2] font-semibold disabled:opacity-60"
                  >
                    {isSavingSettings ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/15 font-semibold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              onClick={(event) => event.stopPropagation()}
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
