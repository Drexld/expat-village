import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Circle,
  ChevronRight,
  MapPin,
  Volume2,
  Users,
  Flame,
  Award,
  Share2,
  Sparkles,
  Navigation,
} from 'lucide-react';
import { toast } from 'sonner';
import { useChecklistTasks } from '../services/api/hooks';
import type { ChecklistTask as ApiChecklistTask } from '../services/api/types';

interface Task {
  id: string;
  title: string;
  category: string;
  points: number;
  completed: boolean;
  urgent: boolean;
  location?: {
    name: string;
    distance: string;
    coords: { lat: number; lng: number };
  };
  voiceGuide?: string;
  collaborative?: boolean;
}

interface EnhancedChecklistProps {
  user: {
    nationality?: string;
    location?: string;
    completedTasks: number;
    totalTasks: number;
    streak: number;
    badges: string[];
  };
}

const STATIC_CATEGORIES = ['All', 'Essentials', 'Admin', 'Finance', 'Social'];

function getFallbackTasks(nationality?: string): Task[] {
  const baseTasks: Task[] = [
    {
      id: 'fallback-1',
      title: 'Get SIM card',
      category: 'Essentials',
      points: 10,
      completed: true,
      urgent: false,
      location: {
        name: 'Orange Store - Mokotow',
        distance: '0.3 km',
        coords: { lat: 52.2297, lng: 21.0122 },
      },
    },
    {
      id: 'fallback-2',
      title: 'Open Polish bank account',
      category: 'Finance',
      points: 20,
      completed: true,
      urgent: false,
      location: {
        name: 'PKO BP - Centrum',
        distance: '0.8 km',
        coords: { lat: 52.2297, lng: 21.0122 },
      },
      voiceGuide:
        'Opening a bank account in Poland is simple. Bring your passport, proof of address, and PESEL number if you have one.',
    },
    {
      id: 'fallback-3',
      title: 'Get PESEL number',
      category: 'Admin',
      points: 30,
      completed: false,
      urgent: true,
      location: {
        name: 'Urzad Dzielnicy Mokotow',
        distance: '1.2 km',
        coords: { lat: 52.2297, lng: 21.0122 },
      },
      voiceGuide:
        'PESEL is your Polish ID number. Book an appointment online, bring passport and proof of address. Processing takes around two weeks.',
    },
    {
      id: 'fallback-4',
      title: 'Register residence permit',
      category: 'Admin',
      points: 50,
      completed: false,
      urgent: false,
      location: {
        name: 'Mazowiecki Urzad Wojewodzki',
        distance: '3.5 km',
        coords: { lat: 52.2297, lng: 21.0122 },
      },
    },
    {
      id: 'fallback-5',
      title: 'Find housing',
      category: 'Essentials',
      points: 40,
      completed: false,
      urgent: false,
      collaborative: true,
    },
    {
      id: 'fallback-6',
      title: 'Explore Mokotow neighborhood',
      category: 'Social',
      points: 15,
      completed: false,
      urgent: false,
      collaborative: true,
      location: {
        name: 'Mokotow District',
        distance: '0.5 km',
        coords: { lat: 52.2297, lng: 21.0122 },
      },
    },
  ];

  if (nationality === 'EU') {
    return [...baseTasks].sort((a, b) => {
      if (a.category === 'Finance' && b.category === 'Admin') return -1;
      return 0;
    });
  }

  return baseTasks;
}

function enrichTask(base: Task): Task {
  const t = base.title.toLowerCase();

  if (t.includes('pesel')) {
    return {
      ...base,
      urgent: true,
      location:
        base.location || {
          name: 'Urzad Dzielnicy Mokotow',
          distance: '1.2 km',
          coords: { lat: 52.2297, lng: 21.0122 },
        },
      voiceGuide:
        base.voiceGuide ||
        'PESEL is your Polish identifier. Prepare passport and proof of address before your visit.',
    };
  }

  if (t.includes('bank')) {
    return {
      ...base,
      location:
        base.location || {
          name: 'PKO BP - Centrum',
          distance: '0.8 km',
          coords: { lat: 52.2297, lng: 21.0122 },
        },
      voiceGuide:
        base.voiceGuide ||
        'Bring passport and address confirmation to open a Polish bank account smoothly.',
    };
  }

  if (t.includes('sim')) {
    return {
      ...base,
      location:
        base.location || {
          name: 'Orange Store - Mokotow',
          distance: '0.3 km',
          coords: { lat: 52.2297, lng: 21.0122 },
        },
    };
  }

  if (t.includes('housing') || t.includes('apartment') || t.includes('roommate')) {
    return {
      ...base,
      collaborative: true,
    };
  }

  return base;
}

function mapApiTask(apiTask: ApiChecklistTask, categoryName: string): Task {
  const mapped: Task = {
    id: apiTask.id,
    title: apiTask.title,
    category: categoryName || 'General',
    points: apiTask.points,
    completed: apiTask.status === 'done',
    urgent: apiTask.urgency === 'urgent',
  };

  return enrichTask(mapped);
}

export function EnhancedChecklist({ user }: EnhancedChecklistProps) {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [showBadges, setShowBadges] = useState(false);
  const [showARMap, setShowARMap] = useState(false);
  const [selectedTaskForAR, setSelectedTaskForAR] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>(() => getFallbackTasks(user.nationality));
  const [activeCategory, setActiveCategory] = useState('All');

  const checklist = useChecklistTasks();

  useEffect(() => {
    if (!checklist.data) return;

    const categoryById = new Map(checklist.data.categories.map((cat) => [cat.id, cat.name]));
    const liveTasks = checklist.data.tasks.map((task) => mapApiTask(task, categoryById.get(task.categoryId) || 'General'));

    if (liveTasks.length > 0) {
      setTasks(liveTasks);
    }
  }, [checklist.data]);

  const completed = tasks.filter((t) => t.completed).length;
  const total = tasks.length || 1;
  const progress = (completed / total) * 100;

  const categories = useMemo(() => {
    const dynamic = Array.from(new Set(tasks.map((t) => t.category).filter(Boolean)));
    if (!dynamic.length) return STATIC_CATEGORIES;
    return ['All', ...dynamic];
  }, [tasks]);

  useEffect(() => {
    if (!categories.includes(activeCategory)) {
      setActiveCategory('All');
    }
  }, [categories, activeCategory]);

  const filteredTasks = activeCategory === 'All' ? tasks : tasks.filter((t) => t.category === activeCategory);

  const badges = [
    { id: 'first-steps', name: 'First Steps', emoji: '??', unlocked: true },
    { id: 'week-one', name: 'Week One Warrior', emoji: '???', unlocked: true },
    { id: 'social-butterfly', name: 'Social Butterfly', emoji: '??', unlocked: false },
    { id: 'warsaw-insider', name: 'Warsaw Insider', emoji: '??', unlocked: false },
  ];

  const topUrgent = tasks.find((task) => task.urgent && !task.completed);
  const aiTip = topUrgent
    ? `AI Tip: Prioritize "${topUrgent.title}" next to avoid delays and unlock +${topUrgent.points} points.`
    : 'AI Tip: Great momentum. Complete one social task today to keep your streak growing.';

  const handleTaskComplete = async (task: Task) => {
    if (task.completed) return;

    if ('vibrate' in navigator) {
      navigator.vibrate([50, 100, 50]);
    }

    const completedBefore = completed;

    setTasks((prev) => prev.map((item) => (item.id === task.id ? { ...item, completed: true } : item)));

    toast.success(`?? +${task.points} points earned!`, {
      description: `Great job! ${user.streak + 1} day streak!`,
      duration: 3000,
    });

    if (checklist.isLive) {
      try {
        await checklist.updateStatus(task.id, 'done');
      } catch {
        setTasks((prev) => prev.map((item) => (item.id === task.id ? { ...item, completed: false } : item)));
        toast.error('Could not sync task status', {
          description: 'Please retry. Your UI was reverted to keep data consistent.',
          duration: 3500,
        });
        return;
      }
    }

    if (completedBefore + 1 === 3) {
      window.setTimeout(() => {
        toast.success('??? New badge unlocked: Week One Warrior!', {
          description: 'Share your progress with friends',
          duration: 4000,
        });
      }, 1000);
    }
  };

  const handleVoiceGuide = (task: Task) => {
    if (!task.voiceGuide) return;

    toast.info('??? Playing voice guide...', {
      description: 'Tap to stop',
      duration: 2000,
    });

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(task.voiceGuide);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleARMap = (task: Task) => {
    setSelectedTaskForAR(task);
    setShowARMap(true);
  };

  const handleShare = () => {
    toast.success('?? Progress shared!', {
      description: '+5 bonus points earned',
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#0a0e1a] to-[#000000] text-white">
      <div className="sticky top-0 z-40 px-5 pt-8 pb-4 backdrop-blur-xl bg-gradient-to-b from-[#000000] to-transparent">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold mb-1">My Checklist</h1>
              {checklist.isLive && (
                <span className="mb-1 px-2 py-0.5 rounded-full bg-green-500/20 border border-green-400/25 text-[10px] font-semibold text-green-400">
                  LIVE
                </span>
              )}
            </div>
            <p className="text-sm text-white/50">Your journey to Warsaw life</p>
          </div>

          <button onClick={() => setShowBadges(true)} className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center shadow-[0_4px_16px_rgba(245,158,11,0.4)]">
              <Award className="w-6 h-6 text-white" strokeWidth={2} />
              {badges.filter((b) => b.unlocked).length > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                  {badges.filter((b) => b.unlocked).length}
                </div>
              )}
            </div>
          </button>
        </div>

        <div className="mb-4 p-3 rounded-[16px] bg-gradient-to-r from-[#3b9eff]/20 to-[#8b5cf6]/20 border border-[#3b9eff]/30">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#3b9eff] mt-0.5" strokeWidth={2} />
            <div className="flex-1">
              <p className="text-xs text-white/90 leading-relaxed">
                <span className="font-semibold">{checklist.isLive ? 'Live AI Tip:' : 'AI Tip:'}</span> {aiTip}
              </p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">
              {completed}/{tasks.length} completed
            </span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-[#ff6b9d]" strokeWidth={2} />
                <span className="text-sm font-semibold text-[#ff6b9d]">{user.streak} day streak</span>
              </div>
              <button onClick={handleShare} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Share2 className="w-4 h-4 text-white/70" strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="h-3 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-[#3b9eff] to-[#8b5cf6] rounded-full relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="px-5 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-gradient-to-b from-[#3b9eff] to-[#2d7dd2] text-white shadow-[0_4px_16px_rgba(59,158,255,0.4)]'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pb-24 space-y-3">
        <AnimatePresence>
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="relative overflow-hidden rounded-[20px] p-[1px] bg-gradient-to-b from-white/20 to-white/5"
            >
              <div
                className={`relative rounded-[20px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4 ${
                  task.completed ? 'opacity-60' : ''
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent rounded-[20px] pointer-events-none" />

                {task.urgent && !task.completed && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30">
                    <span className="text-[9px] text-red-400 font-bold">URGENT</span>
                  </div>
                )}

                <div className="relative">
                  <div className="flex items-start gap-3 mb-3">
                    <button onClick={() => void handleTaskComplete(task)} className="mt-0.5">
                      {task.completed ? (
                        <CheckCircle2
                          className="w-6 h-6 text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                          strokeWidth={2}
                        />
                      ) : (
                        <Circle className="w-6 h-6 text-white/30 hover:text-white/50 transition-colors" strokeWidth={2} />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-base font-semibold ${task.completed ? 'line-through text-white/40' : 'text-white'}`}>
                          {task.title}
                        </h3>
                        {task.collaborative && <Users className="w-4 h-4 text-[#3b9eff]" strokeWidth={2} />}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-white/50">{task.category}</span>
                        <span className="text-white/30">•</span>
                        <span className="text-xs font-semibold text-[#3b9eff]">+{task.points} pts</span>

                        {task.location && (
                          <>
                            <span className="text-white/30">•</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-white/40" strokeWidth={2} />
                              <span className="text-xs text-white/40">{task.location.distance}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <button onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)} className="p-1">
                      <motion.div animate={{ rotate: expandedTask === task.id ? 90 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronRight className="w-5 h-5 text-white/40" strokeWidth={2} />
                      </motion.div>
                    </button>
                  </div>

                  <AnimatePresence>
                    {expandedTask === task.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 mt-3 border-t border-white/10 space-y-2">
                          {task.location && (
                            <div className="p-3 rounded-[12px] bg-white/5 border border-white/5">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <p className="text-sm font-semibold">{task.location.name}</p>
                                  <p className="text-xs text-white/50">{task.location.distance} away</p>
                                </div>
                                <button
                                  onClick={() => handleARMap(task)}
                                  className="p-2 rounded-lg bg-[#3b9eff]/20 hover:bg-[#3b9eff]/30 transition-colors"
                                >
                                  <Navigation className="w-4 h-4 text-[#3b9eff]" strokeWidth={2} />
                                </button>
                              </div>
                            </div>
                          )}

                          <div className="flex gap-2">
                            {task.voiceGuide && (
                              <button
                                onClick={() => handleVoiceGuide(task)}
                                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-[#8b5cf6]/20 border border-[#8b5cf6]/30 text-xs font-semibold text-[#8b5cf6] hover:bg-[#8b5cf6]/30 transition-all"
                              >
                                <Volume2 className="w-4 h-4" strokeWidth={2} />
                                Voice Guide
                              </button>
                            )}

                            {task.collaborative && (
                              <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-[#ec4899]/20 border border-[#ec4899]/30 text-xs font-semibold text-[#ec4899] hover:bg-[#ec4899]/30 transition-all">
                                <Users className="w-4 h-4" strokeWidth={2} />
                                Find Buddy
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showBadges && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-5"
            onClick={() => setShowBadges(false)}
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
                <h3 className="text-lg font-bold mb-4">Your Badges</h3>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-[16px] text-center ${
                        badge.unlocked
                          ? 'bg-gradient-to-br from-[#f59e0b]/20 to-[#d97706]/10 border border-[#f59e0b]/30'
                          : 'bg-white/5 border border-white/5 opacity-50'
                      }`}
                    >
                      <div className="text-3xl mb-2">{badge.emoji}</div>
                      <p className="text-xs font-semibold">{badge.name}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowBadges(false)}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-b from-[#3b9eff] to-[#2d7dd2] font-semibold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showARMap && selectedTaskForAR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-5"
            onClick={() => setShowARMap(false)}
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
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-[#3b9eff]" strokeWidth={2} />
                  AR Navigation
                </h3>

                <div className="aspect-square rounded-[16px] bg-white/5 border border-white/5 mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-[#3b9eff] mx-auto mb-2" strokeWidth={1.5} />
                    <p className="text-sm text-white/70">{selectedTaskForAR.location?.name}</p>
                    <p className="text-xs text-white/50 mt-1">{selectedTaskForAR.location?.distance} away</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowARMap(false)}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-b from-[#3b9eff] to-[#2d7dd2] font-semibold"
                >
                  Open in Google Maps
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}