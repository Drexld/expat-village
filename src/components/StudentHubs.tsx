import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Users, Calendar, Tag, MessageCircle, Heart, X, ChevronRight, MapPin, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { UniversityModal } from './UniversityModal';
import { AddUniversityModal } from './AddUniversityModal';
import { useStudentHub } from '../services/api/hooks';
import type { RoommateProfileSummary, StudentUniversitySummary } from '../services/api/types';

type Student = RoommateProfileSummary;
type University = StudentUniversitySummary;

export function StudentHubs() {
  const {
    universities,
    events,
    roommates,
    isLoading,
    isLive,
    joinUniversity,
    swipeRoommate,
  } = useStudentHub();

  const [activeTab, setActiveTab] = useState<'universities' | 'events' | 'roommates' | 'discounts' | 'groups'>(
    'universities',
  );
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [swipeIndex, setSwipeIndex] = useState(0);
  const [showAddUniversityModal, setShowAddUniversityModal] = useState(false);

  const universityHub = useMemo(
    () =>
      universities[0] || {
        id: 'hub-default',
        name: 'University Hub',
        shortName: 'HUB',
        logo: '??',
        activeStudents: 0,
        totalMembers: 0,
        recentTopics: [],
        location: 'Warsaw',
        verified: false,
      },
    [universities],
  );

  const discounts = [
    {
      id: '1',
      name: 'Cafe Relaks',
      discount: '15% off with student ID',
      category: 'Food & Drink',
      distance: '0.3 km',
      validUntil: 'Feb 28, 2026',
    },
    {
      id: '2',
      name: 'Cinema City',
      discount: '30% off Tue-Thu',
      category: 'Entertainment',
      distance: '1.2 km',
      validUntil: 'Ongoing',
    },
    {
      id: '3',
      name: 'Empik Bookstore',
      discount: '20% off books',
      category: 'Books',
      distance: '0.8 km',
      validUntil: 'Mar 15, 2026',
    },
  ];

  const groups = [
    { id: '1', name: 'International Students in Mokotow', members: 234, category: 'Location', active: true },
    { id: '2', name: 'Desi Students Warsaw', members: 89, category: 'Culture', active: true },
    { id: '3', name: 'UW Tech & Coding', members: 156, category: 'Interest', active: false },
    { id: '4', name: 'Warsaw Foodies', members: 312, category: 'Interest', active: true },
  ];

  const handleHubJoin = async () => {
    if (!universityHub.id || universityHub.id === 'hub-default') {
      toast.info('No university selected yet');
      return;
    }

    try {
      await joinUniversity(universityHub.id);
      toast.success('University joined', {
        description: isLive
          ? `You are now active in ${universityHub.shortName} student hub.`
          : `Preview mode: join captured for ${universityHub.shortName}.`,
        duration: 2500,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not join university';
      toast.error('Join failed', { description: message });
    }
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    const currentStudent = roommates[swipeIndex];
    if (!currentStudent) return;

    try {
      await swipeRoommate({ profileId: currentStudent.id, direction });

      if (direction === 'right') {
        toast.success(`Liked ${currentStudent.name}`, {
          description: isLive ? 'Match notification sent!' : 'Preview mode: like recorded locally.',
          duration: 2000,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not submit swipe';
      toast.error('Swipe failed', { description: message });
      return;
    }

    if (swipeIndex < roommates.length - 1) {
      setSwipeIndex((prev) => prev + 1);
    } else {
      toast.info('No more roommates', {
        description: 'Check back tomorrow for new matches',
        duration: 2000,
      });
    }

    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  };

  const handleRSVP = (eventId: string) => {
    toast.success('RSVP confirmed!', {
      description: `Event ${eventId} added to your student calendar`,
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#0a0e1a] to-[#000000] text-white">
      <div className="sticky top-0 z-40 px-5 pt-8 pb-4 backdrop-blur-xl bg-gradient-to-b from-[#000000] to-transparent">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-1">Student Hubs</h1>
          <p className="text-sm text-white/50">Connect with your university community</p>
        </div>

        <div className="relative overflow-hidden rounded-[20px] p-[1px] bg-gradient-to-b from-white/25 to-white/10 mb-4">
          <div className="relative rounded-[20px] bg-gradient-to-br from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[20px] pointer-events-none" />

            <div className="relative flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#3b9eff] to-[#0066cc] flex items-center justify-center text-2xl shadow-[0_4px_16px_rgba(59,158,255,0.4)]">
                {universityHub.logo}
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-base">{universityHub.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.8)]"
                    />
                    <span className="text-xs text-green-400 font-semibold">{universityHub.activeStudents} active</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70 font-semibold">
                    {isLive ? 'LIVE' : 'PREVIEW'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleHubJoin}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <span className="text-xs font-semibold">Join</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {(['universities', 'events', 'roommates', 'discounts', 'groups'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-b from-[#3b9eff] to-[#2d7dd2] text-white shadow-[0_4px_16px_rgba(59,158,255,0.4)]'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pb-24">
        {activeTab === 'universities' && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
            <button
              onClick={() => setShowAddUniversityModal(true)}
              className="w-full relative overflow-hidden rounded-[20px] p-[1px] bg-gradient-to-b from-[#3b9eff]/30 to-[#2d7dd2]/10 hover:from-[#3b9eff]/40 hover:to-[#2d7dd2]/20 transition-all"
            >
              <div className="relative rounded-[20px] bg-gradient-to-b from-[#1a2642]/70 to-[#0f172a]/80 backdrop-blur-xl p-4">
                <div className="flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5 text-[#3b9eff]" strokeWidth={2} />
                  <span className="font-semibold text-[#3b9eff]">Add a University</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#f59e0b]/20 text-[#f59e0b] font-bold">
                    +25 Points
                  </span>
                </div>
              </div>
            </button>

            {isLoading && universities.length === 0 && (
              <div className="text-sm text-white/60 text-center py-4">Loading universities...</div>
            )}

            {universities.map((university, index) => (
              <motion.button
                key={university.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedUniversity(university)}
                className="w-full relative overflow-hidden rounded-[20px] p-[1px] bg-gradient-to-b from-white/20 to-white/5 hover:from-white/30 hover:to-white/10 transition-all"
              >
                <div className="relative rounded-[20px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent rounded-[20px] pointer-events-none" />

                  <div className="relative flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3b9eff] to-[#0066cc] flex items-center justify-center shadow-[0_4px_16px_rgba(59,158,255,0.4)]">
                      {university.logo}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-base mb-1">{university.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-white/50">
                        <span>{university.activeStudents} active</span>
                        <span>•</span>
                        <span>{university.totalMembers} total members</span>
                        <span>•</span>
                        <span>{university.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-white/50">
                        {university.recentTopics.map((topic, i) => (
                          <span key={i}>
                            {topic}
                            {i < university.recentTopics.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-white/40" strokeWidth={2} />
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {activeTab === 'events' && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
            {isLoading && events.length === 0 && (
              <div className="text-sm text-white/60 text-center py-4">Loading student events...</div>
            )}
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative overflow-hidden rounded-[20px] p-[1px] bg-gradient-to-b from-white/20 to-white/5"
              >
                <div className="relative rounded-[20px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent rounded-[20px] pointer-events-none" />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#ec4899]/20 text-[#ec4899] font-medium">
                            {event.category}
                          </span>
                        </div>
                        <h3 className="font-semibold text-base mb-2">{event.title}</h3>

                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-sm text-white/70">
                            <Calendar className="w-4 h-4" strokeWidth={2} />
                            <span>
                              {event.date} • {event.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-white/70">
                            <MapPin className="w-4 h-4" strokeWidth={2} />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-white/70">
                            <Users className="w-4 h-4" strokeWidth={2} />
                            <span>{event.attending} attending</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRSVP(event.id)}
                      className="w-full py-2.5 rounded-lg bg-gradient-to-b from-[#3b9eff] to-[#2d7dd2] font-semibold shadow-[0_4px_16px_rgba(59,158,255,0.4)] hover:shadow-[0_6px_24px_rgba(59,158,255,0.5)] transition-all"
                    >
                      RSVP Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'roommates' && swipeIndex < roommates.length && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <motion.div
              key={swipeIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative overflow-hidden rounded-[28px] p-[1px] bg-gradient-to-b from-white/25 to-white/10"
            >
              <div className="relative rounded-[28px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-6">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[28px] pointer-events-none" />

                <div className="relative">
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#3b9eff] to-[#8b5cf6] flex items-center justify-center text-4xl font-bold shadow-[0_8px_32px_rgba(59,158,255,0.5)]">
                        {roommates[swipeIndex].avatar}
                      </div>
                      {roommates[swipeIndex].verified && (
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 border-2 border-[#0f172a] flex items-center justify-center">
                          <span className="text-sm">?</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold mb-1">{roommates[swipeIndex].name}</h3>
                    <p className="text-sm text-white/50 mb-2">From {roommates[swipeIndex].country}</p>
                    <div className="flex items-center justify-center gap-2 text-xs text-white/60">
                      <span className="px-2 py-1 rounded-full bg-white/10">{roommates[swipeIndex].university}</span>
                    </div>
                  </div>

                  <div className="mb-4 p-3 rounded-[16px] bg-white/5 border border-white/10">
                    <p className="text-sm font-semibold mb-1">Looking for:</p>
                    <p className="text-sm text-white/70">{roommates[swipeIndex].lookingFor}</p>
                    {roommates[swipeIndex].budget && (
                      <p className="text-xs text-white/50 mt-1">Budget: {roommates[swipeIndex].budget}</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <p className="text-sm font-semibold mb-2">Interests:</p>
                    <div className="flex flex-wrap gap-2">
                      {roommates[swipeIndex].interests.map((interest) => (
                        <span
                          key={interest}
                          className="px-3 py-1 rounded-full bg-[#3b9eff]/20 text-[#3b9eff] text-xs font-medium"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-6">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleSwipe('left')}
                      className="w-16 h-16 rounded-full bg-gradient-to-b from-[#ef4444] to-[#dc2626] flex items-center justify-center shadow-[0_4px_20px_rgba(239,68,68,0.4)]"
                    >
                      <X className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleSwipe('right')}
                      className="w-16 h-16 rounded-full bg-gradient-to-b from-[#10b981] to-[#059669] flex items-center justify-center shadow-[0_4px_20px_rgba(16,185,129,0.4)]"
                    >
                      <Heart className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'roommates' && roommates.length > 0 && swipeIndex >= roommates.length && (
          <div className="text-center py-10 text-white/60">
            <p className="font-semibold">No more roommate cards today</p>
            <p className="text-sm text-white/40 mt-1">New profiles refresh periodically.</p>
          </div>
        )}

        {activeTab === 'discounts' && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
            {discounts.map((discount, index) => (
              <motion.div
                key={discount.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative overflow-hidden rounded-[20px] p-[1px] bg-gradient-to-b from-white/20 to-white/5"
              >
                <div className="relative rounded-[20px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent rounded-[20px] pointer-events-none" />

                  <div className="relative flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center shadow-[0_4px_16px_rgba(245,158,11,0.4)]">
                      <Tag className="w-6 h-6 text-white" strokeWidth={2} />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-base mb-1">{discount.name}</h3>
                      <p className="text-sm text-[#10b981] font-medium mb-1">{discount.discount}</p>
                      <div className="flex items-center gap-2 text-xs text-white/50">
                        <span>{discount.category}</span>
                        <span>•</span>
                        <span>{discount.distance}</span>
                        <span>•</span>
                        <span>Until {discount.validUntil}</span>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-white/40" strokeWidth={2} />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'groups' && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
            {groups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative overflow-hidden rounded-[20px] p-[1px] bg-gradient-to-b from-white/20 to-white/5"
              >
                <div className="relative rounded-[20px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent rounded-[20px] pointer-events-none" />

                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ec4899] to-[#db2777] flex items-center justify-center shadow-[0_4px_16px_rgba(236,72,153,0.4)]">
                        <MessageCircle className="w-6 h-6 text-white" strokeWidth={2} />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm">{group.name}</h3>
                          {group.active && <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/50">
                          <span>{group.members} members</span>
                          <span>•</span>
                          <span className="px-2 py-0.5 rounded bg-white/10">{group.category}</span>
                        </div>
                      </div>
                    </div>

                    <button className="px-3 py-1.5 rounded-lg bg-[#3b9eff]/20 hover:bg-[#3b9eff]/30 text-xs font-semibold text-[#3b9eff] transition-colors">
                      Join
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {selectedUniversity && <UniversityModal university={selectedUniversity} onClose={() => setSelectedUniversity(null)} />}

      <AddUniversityModal isOpen={showAddUniversityModal} onClose={() => setShowAddUniversityModal(false)} />
    </div>
  );
}
