import { useState, useEffect, useMemo } from 'react';
import { Toaster, toast } from 'sonner';
import { Navigation } from './components/Navigation';
import { MorningBriefing } from './components/MorningBriefing';
import { MoodCheck } from './components/MoodCheck';
import { VoiceBubble } from './components/VoiceBubble';
import { Home } from './components/Home';
import { EnhancedChecklist } from './components/EnhancedChecklist';
import { Discover } from './components/Discover';
import { WarsawWhisperNetwork } from './components/WarsawWhisperNetwork';
import { PremiumProfile } from './components/PremiumProfile';
import { PersonalityOnboarding } from './components/PersonalityOnboarding';
import { useDailyBriefing, useHomePulse, useMeProfileProgress } from './services/api/hooks';

const CACHE_ONBOARDING_PROFILE = 'onboarding-profile';
const CACHE_ONBOARDING_COMPLETE = 'onboarding-complete';
const CACHE_MOOD_SELECTED = 'mood-check-selected';
const CACHE_MOOD_CHECK_DATE = 'mood-check-date';
const CACHE_BRIEFING_SEEN_DATE = 'briefing-seen-date';

function getWarsawClock(): { dateKey: string; hour: number } {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Warsaw',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      hour12: false,
    }).formatToParts(new Date());

    const map = new Map(parts.map((part) => [part.type, part.value]));
    const year = map.get('year') || '1970';
    const month = map.get('month') || '01';
    const day = map.get('day') || '01';
    const hour = Number(map.get('hour') || '0');
    return { dateKey: `${year}-${month}-${day}`, hour };
  } catch {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return { dateKey: `${now.getFullYear()}-${month}-${day}`, hour: now.getHours() };
  }
}

function getInitialUser() {
  const defaultUser = {
    name: 'Alex',
    level: 'Newcomer',
    points: 340,
    streak: 7,
    completedTasks: 8,
    totalTasks: 24,
    badges: ['early-adopter', 'first-steps', 'week-one'],
  };

  try {
    const raw = sessionStorage.getItem(CACHE_ONBOARDING_PROFILE);
    if (!raw) return defaultUser;
    const parsed = JSON.parse(raw);
    return {
      ...defaultUser,
      name: typeof parsed?.name === 'string' && parsed.name.trim() ? parsed.name.trim() : defaultUser.name,
    };
  } catch {
    return defaultUser;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showBriefing, setShowBriefing] = useState(false);
  const [showMoodCheck, setShowMoodCheck] = useState(false);
  const [userMood, setUserMood] = useState<string>(
    () => sessionStorage.getItem(CACHE_MOOD_SELECTED) || '',
  );
  const [showOnboarding, setShowOnboarding] = useState(
    () => sessionStorage.getItem(CACHE_ONBOARDING_COMPLETE) !== 'true',
  );
  const [user, setUser] = useState(getInitialUser);
  const homePulse = useHomePulse({ enabled: !showOnboarding });
  const dailyBriefing = useDailyBriefing({ enabled: !showOnboarding });
  const meProfileProgress = useMeProfileProgress({ enabled: true });

  const effectiveUser = useMemo(
    () => ({
      ...user,
      name: meProfileProgress.profile?.displayName || user.name,
      level: meProfileProgress.progress?.level || meProfileProgress.profile?.level || user.level,
      points: meProfileProgress.progress?.points ?? meProfileProgress.profile?.points ?? user.points,
      streak: meProfileProgress.progress?.streak ?? meProfileProgress.profile?.streak ?? user.streak,
      completedTasks: meProfileProgress.progress?.completedTasks ?? user.completedTasks,
      totalTasks: meProfileProgress.progress?.totalTasks ?? user.totalTasks,
      badges:
        meProfileProgress.progress?.badges?.filter((badge) => badge.unlocked).map((badge) => badge.id) ||
        user.badges,
    }),
    [user, meProfileProgress.profile, meProfileProgress.progress],
  );

  useEffect(() => {
    const profile = meProfileProgress.profile;
    if (!profile) return;

    const onboardingCompleted = Boolean(profile.onboardingCompleted);
    sessionStorage.setItem(CACHE_ONBOARDING_COMPLETE, onboardingCompleted ? 'true' : 'false');
    setShowOnboarding(!onboardingCompleted);

    const cachedRaw = sessionStorage.getItem(CACHE_ONBOARDING_PROFILE);
    const cached = (() => {
      if (!cachedRaw) return {};
      try {
        return JSON.parse(cachedRaw) as Record<string, unknown>;
      } catch {
        return {};
      }
    })();

    sessionStorage.setItem(
      CACHE_ONBOARDING_PROFILE,
      JSON.stringify({
        ...cached,
        name: profile.displayName,
        tribe: profile.tribe || cached.tribe || '',
        interest: profile.interest || cached.interest || '',
      }),
    );
  }, [
    meProfileProgress.profile?.displayName,
    meProfileProgress.profile?.interest,
    meProfileProgress.profile?.onboardingCompleted,
    meProfileProgress.profile?.tribe,
  ]);

  useEffect(() => {
    const mood = meProfileProgress.preferences?.mood;
    if (!mood) return;
    setUserMood(mood);
    sessionStorage.setItem(CACHE_MOOD_SELECTED, mood);
  }, [meProfileProgress.preferences?.mood]);

  useEffect(() => {
    if (showOnboarding) return;

    const warsawClock = getWarsawClock();
    const todayKey = warsawClock.dateKey;
    const currentHour = warsawClock.hour;
    const briefingSeenDate =
      meProfileProgress.preferences?.morningBriefingSeenDate ||
      sessionStorage.getItem(CACHE_BRIEFING_SEEN_DATE);
    const moodCheckSeenDate =
      meProfileProgress.preferences?.moodCheckSeenDate ||
      sessionStorage.getItem(CACHE_MOOD_CHECK_DATE);

    const timers: number[] = [];

    // Mood check: noon window, once daily.
    const isMoodWindow = currentHour >= 12 && currentHour < 15;
    if (isMoodWindow && moodCheckSeenDate !== todayKey && !showMoodCheck) {
      timers.push(window.setTimeout(() => setShowMoodCheck(true), 2000));
    }

    // Morning briefing: morning window, once daily.
    const isMorningWindow = currentHour >= 5 && currentHour < 12;
    if (isMorningWindow && briefingSeenDate !== todayKey && !showBriefing) {
      timers.push(window.setTimeout(() => setShowBriefing(true), 1000));
    }

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [
    showOnboarding,
    showBriefing,
    showMoodCheck,
    meProfileProgress.preferences?.morningBriefingSeenDate,
    meProfileProgress.preferences?.moodCheckSeenDate,
  ]);

  useEffect(() => {
    const handleOffline = () => {
      toast.warning('Offline mode enabled', {
        description: 'Live feeds will use cached data until connection returns.',
      });
    };

    const handleOnline = () => {
      toast.success('Back online', {
        description: 'Refreshing live data in the background.',
      });
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  const handleCloseBriefing = () => {
    const todayKey = getWarsawClock().dateKey;
    setShowBriefing(false);
    sessionStorage.setItem(CACHE_BRIEFING_SEEN_DATE, todayKey);

    void meProfileProgress
      .savePreferences({ morningBriefingSeenDate: todayKey })
      .catch(() => {
        toast.error('Could not sync briefing state');
      });
  };

  const handleOpenBriefing = () => {
    setShowBriefing(true);
  };

  const handleCloseMoodCheck = () => {
    setShowMoodCheck(false);
  };

  const handleMoodChange = (mood: string) => {
    const todayKey = getWarsawClock().dateKey;
    if (mood && mood !== 'skip') {
      setUserMood(mood);
      sessionStorage.setItem(CACHE_MOOD_SELECTED, mood);
    }
    handleCloseMoodCheck();
    sessionStorage.setItem(CACHE_MOOD_CHECK_DATE, todayKey);

    void meProfileProgress
      .savePreferences({
        mood: mood && mood !== 'skip' ? mood : undefined,
        moodCheckSeenDate: todayKey,
      })
      .catch(() => {
        toast.error('Could not sync mood check state');
      });
  };

  const handleOnboardingComplete = (payload: {
    name: string;
    tribe: string;
    interest: string;
    badge: string;
    score: number;
    total: number;
  }) => {
    const profile = {
      name: payload.name,
      tribe: payload.tribe,
      interest: payload.interest,
      badge: payload.badge,
      score: payload.score,
      total: payload.total,
      completedAt: new Date().toISOString(),
    };

    sessionStorage.setItem(CACHE_ONBOARDING_PROFILE, JSON.stringify(profile));
    sessionStorage.setItem(CACHE_ONBOARDING_COMPLETE, 'true');

    setUser((prev) => ({
      ...prev,
      name: payload.name,
      badges: [...new Set([payload.badge, ...prev.badges])],
    }));
    setShowOnboarding(false);
    toast.success('Welcome to Expat Village', {
      description: `Badge unlocked: ${payload.badge}`,
    });

    void meProfileProgress
      .saveProfile({
        displayName: payload.name,
        tribe: payload.tribe,
        interest: payload.interest,
        onboardingCompleted: true,
      })
      .catch(() => {
        toast.error('Could not sync onboarding state to backend');
      });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Home
            user={effectiveUser}
            onOpenBriefing={handleOpenBriefing}
            userMood={userMood}
            homePulseData={homePulse.data}
            homePulseLive={homePulse.isLive}
            journeyData={meProfileProgress.progress}
          />
        );
      case 'checklist':
        return <EnhancedChecklist user={effectiveUser} />;
      case 'discover':
        return <Discover />;
      case 'community':
        return <WarsawWhisperNetwork />;
      case 'profile':
        return (
          <PremiumProfile
            user={effectiveUser}
            progressData={meProfileProgress.progress}
            profileData={meProfileProgress.profile}
            preferencesData={meProfileProgress.preferences}
            profileLive={meProfileProgress.isLive}
            onSaveProfile={meProfileProgress.saveProfile}
            onSavePreferences={meProfileProgress.savePreferences}
          />
        );
      default:
        return (
          <Home
            user={effectiveUser}
            onOpenBriefing={handleOpenBriefing}
            userMood={userMood}
            homePulseData={homePulse.data}
            homePulseLive={homePulse.isLive}
            journeyData={meProfileProgress.progress}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#0a0e1a] to-[#000000] text-white">
      <Toaster position="top-center" theme="dark" />

      {showOnboarding ? (
        <PersonalityOnboarding onComplete={handleOnboardingComplete} />
      ) : (
        <>
      
      {/* Mood Check Modal */}
      <MoodCheck isOpen={showMoodCheck} onClose={handleMoodChange} />
      
      <MorningBriefing
        isOpen={showBriefing}
        onDismiss={handleCloseBriefing}
        briefingData={dailyBriefing.data}
        homePulseData={homePulse.data}
      />
      
      {/* Voice Bubble - Only show on home tab */}
      {activeTab === 'home' && (
        <VoiceBubble userName={effectiveUser.name} onVoiceCommand={() => {}} />
      )}
      
      <main className="pb-20 min-h-screen max-w-md mx-auto">
        {renderContent()}
      </main>
      
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        </>
      )}
    </div>
  );
}
