import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { Navigation } from './components/Navigation';
import { MorningBriefing } from './components/MorningBriefing';
import { MoodCheck } from './components/MoodCheck';
import { VoiceBubble } from './components/VoiceBubble';
import { Home } from './components/Home';
import { EnhancedChecklist } from './components/EnhancedChecklist';
import { Discover } from './components/Discover';
import { WarsawWhisperNetwork } from './components/WarsawWhisperNetwork';
import { PremiumProfile } from './components/PremiumProfile';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showBriefing, setShowBriefing] = useState(false);
  const [showMoodCheck, setShowMoodCheck] = useState(false);
  const [userMood, setUserMood] = useState<string>(() => sessionStorage.getItem('mood-check-selected') || '');
  const [user] = useState({
    name: 'Alex',
    level: 'Newcomer',
    points: 340,
    streak: 7,
    completedTasks: 8,
    totalTasks: 24,
    badges: ['early-adopter', 'first-steps', 'week-one']
  });

  useEffect(() => {
    const today = new Date().toDateString();
    const briefingSeenDate = sessionStorage.getItem('briefing-seen-date');
    const moodCheckSeenDate = sessionStorage.getItem('mood-check-date');
    const selectedMood = sessionStorage.getItem('mood-check-selected');
    
    // Show mood check once per day, but keep prompting if user hasn't selected a mood yet.
    // This also recovers from old "mood-check-done=true" flags.
    if (!selectedMood || moodCheckSeenDate !== today) {
      setTimeout(() => setShowMoodCheck(true), 2000);
    }
    
    // Show daily briefing once per day, regardless of hour.
    if (briefingSeenDate !== today) {
      setTimeout(() => setShowBriefing(true), 1000);
    }
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

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home user={user} onOpenBriefing={handleOpenBriefing} userMood={userMood} />;
      case 'checklist':
        return <EnhancedChecklist user={user} />;
      case 'discover':
        return <Discover />;
      case 'community':
        return <WarsawWhisperNetwork />;
      case 'profile':
        return <PremiumProfile user={user} />;
      default:
        return <Home user={user} onOpenBriefing={handleOpenBriefing} userMood={userMood} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#0a0e1a] to-[#000000] text-white">
      <Toaster position="top-center" theme="dark" />
      
      {/* Mood Check Modal */}
      <MoodCheck isOpen={showMoodCheck} onClose={handleMoodChange} />
      
      <MorningBriefing isOpen={showBriefing} onDismiss={handleCloseBriefing} />
      
      {/* Voice Bubble - Only show on home tab */}
      {activeTab === 'home' && (
        <VoiceBubble userName={user.name} onVoiceCommand={() => {}} />
      )}
      
      <main className="pb-20 min-h-screen max-w-md mx-auto">
        {renderContent()}
      </main>
      
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
