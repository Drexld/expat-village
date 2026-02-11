import { motion, AnimatePresence } from 'motion/react';
import { X, Users, TrendingUp, MessageCircle, Calendar, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface University {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  activeStudents: number;
  totalMembers: number;
  recentTopics: string[];
  location: string;
  verified: boolean;
}

interface UniversityModalProps {
  university: University;
  onClose: () => void;
}

export function UniversityModal({ university, onClose }: UniversityModalProps) {
  const discussions = [
    { id: '1', title: 'Spring semester registration help', author: 'Sarah M.', replies: 23, views: 456, time: '2h ago' },
    { id: '2', title: 'Looking for study partners for Math exam', author: 'Luca R.', replies: 15, views: 234, time: '5h ago' },
    { id: '3', title: 'Best cafes near campus for studying?', author: 'Maria K.', replies: 34, views: 687, time: '1d ago' },
    { id: '4', title: 'Erasmus application tips - Ask me anything!', author: 'Alex P.', replies: 45, views: 892, time: '2d ago' },
  ];

  const upcomingEvents = [
    { id: '1', title: 'International Students Coffee Chat', date: 'Feb 12', attending: 34 },
    { id: '2', title: 'Career Fair 2026', date: 'Feb 15', attending: 156 },
    { id: '3', title: 'Study Abroad Info Session', date: 'Feb 18', attending: 67 },
  ];

  const handleStartDiscussion = () => {
    toast.success('✍️ Start a new topic', {
      description: '+10 points for starting discussions!',
      duration: 2000,
    });
  };

  const handleJoinDiscussion = (discussionId: string) => {
    toast.success('💬 Joined discussion', {
      description: '+5 points earned',
      duration: 2000,
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-5"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
        
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full sm:max-w-2xl sm:rounded-[28px] rounded-t-[28px] p-[1px] bg-gradient-to-b from-white/30 to-white/10 max-h-[90vh] sm:max-h-[85vh] overflow-hidden"
        >
          <div className="sm:rounded-[28px] rounded-t-[28px] bg-gradient-to-b from-[#1a2642]/98 to-[#0f172a]/98 backdrop-blur-xl overflow-y-auto max-h-[90vh] sm:max-h-[85vh]">
            {/* Header */}
            <div className="sticky top-0 z-10 backdrop-blur-xl bg-gradient-to-b from-[#1a2642]/95 to-transparent px-6 pt-6 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#3b9eff] to-[#0066cc] flex items-center justify-center text-2xl shadow-[0_4px_16px_rgba(59,158,255,0.4)]">
                    {university.logo}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{university.name}</h2>
                    <p className="text-sm text-white/50">{university.location}</p>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-[12px] bg-white/5 border border-white/5 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.8)]"
                    />
                    <p className="text-xl font-bold text-green-400">{university.activeStudents}</p>
                  </div>
                  <p className="text-[10px] text-white/50 uppercase tracking-wide">Active Now</p>
                </div>
                <div className="p-3 rounded-[12px] bg-white/5 border border-white/5 text-center">
                  <p className="text-xl font-bold text-[#3b9eff]">{university.totalMembers}</p>
                  <p className="text-[10px] text-white/50 uppercase tracking-wide">Total Members</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 space-y-6">
              {/* Trending Topics */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-[#ec4899]" strokeWidth={2} />
                  <h3 className="font-bold">Trending Topics</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {university.recentTopics.map((topic, index) => (
                    <span key={index} className="px-3 py-1.5 rounded-full bg-[#ec4899]/20 text-[#ec4899] text-xs font-medium">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Discussions */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-[#3b9eff]" strokeWidth={2} />
                    <h3 className="font-bold">Recent Discussions</h3>
                  </div>
                  <button
                    onClick={handleStartDiscussion}
                    className="text-xs font-semibold text-[#3b9eff] hover:text-[#5fb3ff] transition-colors"
                  >
                    + Start Topic
                  </button>
                </div>

                <div className="space-y-2">
                  {discussions.map((discussion) => (
                    <button
                      key={discussion.id}
                      onClick={() => handleJoinDiscussion(discussion.id)}
                      className="w-full relative overflow-hidden rounded-[16px] p-[1px] bg-gradient-to-b from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 transition-all"
                    >
                      <div className="relative rounded-[16px] bg-gradient-to-b from-[#1a2642]/80 to-[#0f172a]/90 backdrop-blur-sm p-3">
                        <h4 className="font-semibold text-sm mb-2 text-left">{discussion.title}</h4>
                        <div className="flex items-center justify-between text-xs text-white/50">
                          <span>@{discussion.author}</span>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" strokeWidth={2} />
                              <span>{discussion.replies}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" strokeWidth={2} />
                              <span>{discussion.views}</span>
                            </div>
                            <span>{discussion.time}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upcoming Events */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-[#10b981]" strokeWidth={2} />
                  <h3 className="font-bold">Upcoming Events</h3>
                </div>

                <div className="space-y-2">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="relative overflow-hidden rounded-[16px] p-[1px] bg-gradient-to-b from-white/10 to-white/5"
                    >
                      <div className="relative rounded-[16px] bg-gradient-to-b from-[#1a2642]/80 to-[#0f172a]/90 backdrop-blur-sm p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-sm mb-1">{event.title}</h4>
                            <p className="text-xs text-white/50">{event.date} • {event.attending} attending</p>
                          </div>
                          <button className="px-3 py-1.5 rounded-lg bg-[#10b981]/20 hover:bg-[#10b981]/30 text-xs font-semibold text-[#10b981] transition-colors">
                            RSVP
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
