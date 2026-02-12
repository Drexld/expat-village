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
    const raw = sessionStorage.getItem('onboarding-profile');
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
  const [userMood, setUserMood] = useState<string>(() => sessionStorage.getItem('mood-check-selected') || '');
  const [showOnboarding, setShowOnboarding] = useState(() => sessionStorage.getItem('onboarding-complete') !== 'true');
  const [user, setUser] = useState(getInitialUser);
  const homePulse = useHomePulse({ enabled: !showOnboarding });
  const dailyBriefing = useDailyBriefing({ enabled: !showOnboarding });
  const meProfileProgress = useMeProfileProgress({ enabled: !showOnboarding });

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
    if (showOnboarding) return;

    const currentHour = new Date().getHours();
    const today = new Date().toDateString();
    const briefingSeenDate = sessionStorage.getItem('briefing-seen-date');
    const moodCheckSeenDate = sessionStorage.getItem('mood-check-date');
    
    // Mood check: only around noon/2 PM, once per day.
    const isMoodWindow = currentHour >= 12 && currentHour < 15;
    if (isMoodWindow && moodCheckSeenDate !== today) {
      setTimeout(() => setShowMoodCheck(true), 2000);
    }
    
    // Morning briefing: only in the morning, first open of the day.
    const isMorningWindow = currentHour >= 5 && currentHour < 12;
    if (isMorningWindow && briefingSeenDate !== today) {
      setTimeout(() => setShowBriefing(true), 1000);
    }
  }, [showOnboarding]);

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
    setShowBriefing(false);
    sessionStorage.setItem('briefing-seen-date', new Date().toDateString());
  };

  const handleOpenBriefing = () => {
    setShowBriefing(true);
  };

  const handleOpenMoodCheck = () => {
    setShowMoodCheck(true);
  };

  const handleCloseMoodCheck = () => {
    setShowMoodCheck(false);
  };

  const handleMoodChange = (mood: string) => {
    if (mood && mood !== 'skip') {
      setUserMood(mood);
      sessionStorage.setItem('mood-check-selected', mood);
    }
    handleCloseMoodCheck();
    sessionStorage.setItem('mood-check-date', new Date().toDateString());
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

    sessionStorage.setItem('onboarding-profile', JSON.stringify(profile));
    sessionStorage.setItem('onboarding-complete', 'true');

    setUser((prev) => ({
      ...prev,
      name: payload.name,
      badges: [...new Set([payload.badge, ...prev.badges])],
    }));
    setShowOnboarding(false);
    toast.success('Welcome to Expat Village', {
      description: `Badge unlocked: ${payload.badge}`,
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
            profileLive={meProfileProgress.isLive}
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
