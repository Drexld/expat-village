import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  ClipboardList,
  MessageCircle,
  Heart,
  Eye,
  TrendingUp,
  Mic,
  Image as ImageIcon,
  PlusCircle,
  Sparkles,
  Crown,
  ChevronRight,
  Volume2,
  Send,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCommunity, type CommunityApiFilter } from '../services/api/hooks';
import type { CommunityPostSummary } from '../services/api/types';

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    level: number;
    verified: boolean;
  };
  title: string;
  content: string;
  category: string;
  timestamp: string;
  likes: number;
  comments: number;
  views: number;
  isHot: boolean;
  hasVoice?: boolean;
  hasImage?: boolean;
  hasPoll?: boolean;
  aiSummary?: string;
  culturalNote?: string;
  isVIP?: boolean;
}

const FALLBACK_POSTS: Post[] = [
  {
    id: '1',
    author: { name: 'Sarah M.', avatar: 'S', level: 12, verified: true },
    title: 'PESEL appointment - current wait times?',
    content:
      'Just booked mine online and got a date 3 weeks out. Anyone have recent experience with walk-ins vs online booking?',
    category: 'Moving & Admin',
    timestamp: '2h ago',
    likes: 34,
    comments: 18,
    views: 456,
    isHot: true,
    hasVoice: true,
    aiSummary: 'TL;DR: PESEL wait is usually 2-4 weeks. Book early in the morning for better slots.',
    culturalNote:
      'In Poland, PESEL is your core ID number and is required for banking, utilities, and many public services.',
  },
  {
    id: '2',
    author: { name: 'Luca R.', avatar: 'L', level: 8, verified: true },
    title: 'Red flags in rental contracts - what to watch for',
    content: "After nearly getting scammed, here's my checklist. Number 1: registration clause...",
    category: 'Housing',
    timestamp: '4h ago',
    likes: 67,
    comments: 29,
    views: 892,
    isHot: true,
    hasImage: true,
    aiSummary:
      'TL;DR: Must-have clauses include registration, deposit timeline, and utility breakdown. Beware vague damage terms.',
    culturalNote: 'Landlord registration rules and tax compliance matter in Poland. Missing details are a major warning sign.',
  },
  {
    id: '3',
    author: { name: 'Maria K.', avatar: 'M', level: 15, verified: true },
    title: 'Best Polish series to learn the language?',
    content:
      'Trying to improve my Polish. What shows do you recommend on Netflix that helped with conversational phrases?',
    category: 'Culture',
    timestamp: '1d ago',
    likes: 45,
    comments: 34,
    views: 567,
    isHot: false,
    hasPoll: true,
  },
  {
    id: '4',
    author: { name: 'Alex P.', avatar: 'A', level: 20, verified: true },
    title: '[VIP] Praga community event this weekend',
    content: 'Exclusive expat event in Praga with limited spots and neighborhood networking.',
    category: 'Events',
    timestamp: '3h ago',
    likes: 89,
    comments: 42,
    views: 234,
    isHot: true,
    isVIP: true,
    hasImage: true,
    aiSummary: 'Community meetup with RSVP flow and event details in-thread.',
  },
];

function toApiFilter(tab: string): CommunityApiFilter {
  if (tab === 'hot') return 'hot';
  return 'all';
}

function formatRelativeDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const diffMs = Date.now() - date.getTime();
  const hourMs = 60 * 60 * 1000;
  const dayMs = 24 * hourMs;

  if (diffMs < hourMs) return 'just now';
  if (diffMs < dayMs) {
    const h = Math.floor(diffMs / hourMs);
    return `${h}h ago`;
  }
  const d = Math.floor(diffMs / dayMs);
  return `${d}d ago`;
}

function inferCategory(title: string, preview: string): string {
  const text = `${title} ${preview}`.toLowerCase();
  if (text.includes('pesel') || text.includes('visa') || text.includes('admin')) return 'Moving & Admin';
  if (text.includes('rent') || text.includes('housing') || text.includes('apartment')) return 'Housing';
  if (text.includes('event') || text.includes('social') || text.includes('community')) return 'Social & Events';
  if (text.includes('culture') || text.includes('language')) return 'Culture';
  return 'Community';
}

function toUiPost(summary: CommunityPostSummary, fallback?: Post): Post {
  const title = summary.title;
  const content = summary.preview;
  const category = fallback?.category || inferCategory(title, content);
  const isVip = fallback?.isVIP || title.toLowerCase().includes('[vip]');

  return {
    id: summary.id,
    author: {
      name: summary.authorName || fallback?.author.name || 'Expat User',
      avatar: (summary.authorName || fallback?.author.name || 'E')[0].toUpperCase(),
      level: fallback?.author.level || Math.max(1, Math.min(25, Math.floor((summary.likes + summary.replies) / 4) + 1)),
      verified: true,
    },
    title,
    content,
    category,
    timestamp: formatRelativeDate(summary.createdAt),
    likes: summary.likes,
    comments: summary.replies,
    views: fallback?.views || Math.max(summary.likes + summary.replies, 1) * 8,
    isHot: fallback?.isHot || summary.likes >= 30 || summary.replies >= 15,
    hasVoice: fallback?.hasVoice,
    hasImage: fallback?.hasImage,
    hasPoll: fallback?.hasPoll,
    aiSummary:
      fallback?.aiSummary ||
      (summary.preview.length > 120 ? `${summary.preview.slice(0, 117).trim()}...` : summary.preview),
    culturalNote: fallback?.culturalNote,
    isVIP: isVip,
  };
}

function shouldShowPostForTab(post: Post, tab: string): boolean {
  if (tab === 'foryou') return true;
  if (tab === 'hot') return post.isHot;
  if (tab === 'admin') return post.category.toLowerCase().includes('admin') || post.title.toLowerCase().includes('pesel');
  if (tab === 'housing') return post.category.toLowerCase().includes('housing');
  if (tab === 'social') {
    const c = post.category.toLowerCase();
    return c.includes('social') || c.includes('culture') || c.includes('event');
  }
  if (tab === 'vip') return Boolean(post.isVIP);
  return true;
}

export function WarsawWhisperNetwork() {
  const [activeTab, setActiveTab] = useState('foryou');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [posts, setPosts] = useState<Post[]>(FALLBACK_POSTS);
  const [createTitle, setCreateTitle] = useState('');
  const [createCategory, setCreateCategory] = useState('Moving & Admin');
  const [createBody, setCreateBody] = useState('');

  const community = useCommunity({ filter: toApiFilter(activeTab) });

  useEffect(() => {
    if (!community.data || community.data.length === 0) return;

    const fallbackByTitle = new Map(FALLBACK_POSTS.map((post) => [post.title.toLowerCase(), post]));
    const mapped = community.data.map((item) => toUiPost(item, fallbackByTitle.get(item.title.toLowerCase())));
    setPosts(mapped);
  }, [community.data]);

  const tabs: Array<{ id: string; label: string; icon: LucideIcon }> = [
    { id: 'foryou', label: 'For You', icon: Sparkles },
    { id: 'hot', label: 'Hot', icon: TrendingUp },
    { id: 'admin', label: 'Admin', icon: ClipboardList },
    { id: 'housing', label: 'Housing', icon: Building2 },
    { id: 'social', label: 'Social', icon: Users },
    { id: 'vip', label: 'VIP', icon: Crown },
  ];

  const visiblePosts = useMemo(() => posts.filter((post) => shouldShowPostForTab(post, activeTab)), [posts, activeTab]);

  const handleVoiceRecord = () => {
    setVoiceRecording((prev) => !prev);
    if (!voiceRecording) {
      toast.info('Recording voice note...', {
        description: 'Tap again to stop',
        duration: 2000,
      });
    } else {
      toast.success('Voice clip attached', {
        description: 'You can now publish your post.',
        duration: 2000,
      });
    }

    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  };

  const handleLike = async (postId: string) => {
    setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)));

    toast.success('Liked', {
      description: '+2 points earned',
      duration: 1500,
    });

    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }

    if (community.isLive) {
      try {
        await community.reactToPost(postId, { reaction: 'like' });
      } catch {
        setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, likes: Math.max(0, post.likes - 1) } : post)));
        toast.error('Could not sync reaction', {
          description: 'Please retry.',
          duration: 2500,
        });
      }
    }
  };

  const handleJoinThread = async (postId: string) => {
    setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, comments: post.comments + 1 } : post)));

    toast.success('Joined thread', {
      description: "You'll get notified of new replies",
      duration: 2000,
    });

    if (community.isLive) {
      try {
        await community.addComment(postId, { body: 'Following this thread.' });
      } catch {
        setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, comments: Math.max(0, post.comments - 1) } : post)));
        toast.error('Could not sync thread join', {
          description: 'Please retry.',
          duration: 2500,
        });
      }
    }
  };

  const resetComposer = () => {
    setCreateTitle('');
    setCreateCategory('Moving & Admin');
    setCreateBody('');
    setVoiceRecording(false);
  };

  const handleCreatePost = async () => {
    const title = createTitle.trim();
    const body = createBody.trim();

    if (!title || !body) {
      toast.error('Add both title and content before posting.');
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const optimistic: Post = {
      id: tempId,
      author: { name: 'You', avatar: 'Y', level: 1, verified: true },
      title,
      content: body,
      category: createCategory,
      timestamp: 'just now',
      likes: 0,
      comments: 0,
      views: 1,
      isHot: false,
      hasVoice: voiceRecording,
      aiSummary: body.length > 120 ? `${body.slice(0, 117).trim()}...` : body,
    };

    setPosts((prev) => [optimistic, ...prev]);
    setShowCreateModal(false);

    try {
      const created = await community.createPost({
        title,
        body,
        hasVoice: voiceRecording,
      });

      const mapped = toUiPost(created, {
        ...optimistic,
        id: created.id,
        author: { ...optimistic.author, name: created.authorName || 'You' },
        category: createCategory,
      });

      setPosts((prev) => prev.map((post) => (post.id === tempId ? mapped : post)));

      toast.success('Post created', {
        description: '+15 points earned',
        duration: 3000,
      });
    } catch {
      setPosts((prev) => prev.filter((post) => post.id !== tempId));
      toast.error('Could not create post', {
        description: 'Please retry in a moment.',
      });
    } finally {
      resetComposer();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#0a0e1a] to-[#000000] text-white">
      <div className="sticky top-0 z-40 px-5 pt-8 pb-4 backdrop-blur-xl bg-gradient-to-b from-[#000000] to-transparent">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold mb-1">Warsaw Whisper Network</h1>
              {community.isLive && (
                <span className="mb-1 px-2 py-0.5 rounded-full bg-green-500/20 border border-green-400/25 text-[10px] font-semibold text-green-400">
                  LIVE
                </span>
              )}
            </div>
            <p className="text-sm text-white/50">Your trusted expat community</p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="p-2.5 rounded-full bg-gradient-to-b from-[#8b5cf6] to-[#7c3aed] shadow-[0_4px_16px_rgba(139,92,246,0.4)]"
          >
            <PlusCircle className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-b from-[#8b5cf6] to-[#7c3aed] text-white shadow-[0_4px_16px_rgba(139,92,246,0.4)]'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={2} />
                <span>{tab.label}</span>
                {tab.id === 'vip' && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-5 pb-24 space-y-4">
        {activeTab === 'foryou' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[20px] p-[1px] bg-gradient-to-b from-[#3b9eff]/30 to-[#2d7dd2]/10"
          >
            <div className="relative rounded-[20px] bg-gradient-to-br from-[#1a2642]/80 to-[#0f172a]/90 backdrop-blur-xl p-4">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-[20px] pointer-events-none" />

              <div className="relative flex items-start gap-3">
                <div className="p-2 rounded-full bg-[#3b9eff]/20">
                  <Sparkles className="w-5 h-5 text-[#3b9eff]" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">AI Suggestion</h3>
                  <p className="text-xs text-white/70 leading-relaxed mb-2">
                    Based on your active tasks, contract and documentation threads may be useful right now.
                  </p>
                  <button className="text-xs font-semibold text-[#3b9eff] hover:text-[#5fb3ff] transition-colors">
                    View Suggested Threads
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="space-y-3">
          {visiblePosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative overflow-hidden rounded-[24px] p-[1px] ${
                post.isVIP
                  ? 'bg-gradient-to-b from-amber-400/40 to-amber-500/20'
                  : post.isHot
                  ? 'bg-gradient-to-b from-red-500/30 to-orange-500/10'
                  : 'bg-gradient-to-b from-white/20 to-white/5'
              }`}
            >
              <div className="relative rounded-[24px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[24px] pointer-events-none" />

                {post.isHot && !post.isVIP && (
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center gap-1">
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                      HOT
                    </motion.div>
                  </div>
                )}

                {post.isVIP && (
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-white" strokeWidth={2} fill="currentColor" />
                    <span className="text-[9px] text-white font-bold uppercase">VIP</span>
                  </div>
                )}

                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3b9eff] to-[#8b5cf6] flex items-center justify-center text-lg font-bold shadow-[0_4px_12px_rgba(59,158,255,0.4)]">
                        {post.author.avatar}
                      </div>
                      {post.author.verified && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-[#0f172a] flex items-center justify-center">
                          <span className="text-[8px]">v</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">{post.author.name}</h4>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-[#8b5cf6]/20 text-[#8b5cf6] font-bold">
                          Lvl {post.author.level}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-white/50">{post.timestamp}</p>
                        <span className="text-white/30">*</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">{post.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h3 className="font-semibold text-base mb-2">{post.title}</h3>
                    <p className="text-sm text-white/70 leading-relaxed line-clamp-2">{post.content}</p>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    {post.hasVoice && (
                      <div className="px-2 py-1 rounded-lg bg-[#ec4899]/20 flex items-center gap-1">
                        <Volume2 className="w-3 h-3 text-[#ec4899]" strokeWidth={2} />
                        <span className="text-[10px] text-[#ec4899] font-semibold">Voice</span>
                      </div>
                    )}
                    {post.hasImage && (
                      <div className="px-2 py-1 rounded-lg bg-[#10b981]/20 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3 text-[#10b981]" strokeWidth={2} />
                        <span className="text-[10px] text-[#10b981] font-semibold">Image</span>
                      </div>
                    )}
                    {post.hasPoll && (
                      <div className="px-2 py-1 rounded-lg bg-[#f59e0b]/20 flex items-center gap-1">
                        <span className="text-[10px] text-[#f59e0b] font-semibold">Poll</span>
                      </div>
                    )}
                  </div>

                  {post.aiSummary && expandedPost !== post.id && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setExpandedPost(post.id)}
                      className="w-full p-3 rounded-lg bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 mb-3 text-left"
                    >
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-[#8b5cf6] mt-0.5 flex-shrink-0" strokeWidth={2} />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-[#8b5cf6] mb-1">AI Summary</p>
                          <p className="text-xs text-white/70 leading-relaxed">{post.aiSummary}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#8b5cf6]" strokeWidth={2} />
                      </div>
                    </motion.button>
                  )}

                  <AnimatePresence>
                    {expandedPost === post.id && post.culturalNote && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-3">
                        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-400/20">
                          <div className="flex items-start gap-2">
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-amber-400 mb-1">Cultural Context</p>
                              <p className="text-xs text-white/70 leading-relaxed">{post.culturalNote}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button onClick={() => void handleLike(post.id)} className="flex items-center gap-1 text-white/60 hover:text-red-400 transition-colors group">
                        <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" strokeWidth={2} />
                        <span className="text-xs font-semibold">{post.likes}</span>
                      </button>

                      <button className="flex items-center gap-1 text-white/60 hover:text-[#3b9eff] transition-colors">
                        <MessageCircle className="w-4 h-4" strokeWidth={2} />
                        <span className="text-xs font-semibold">{post.comments}</span>
                      </button>

                      <div className="flex items-center gap-1 text-white/40">
                        <Eye className="w-4 h-4" strokeWidth={2} />
                        <span className="text-xs font-semibold">{post.views}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => void handleJoinThread(post.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#3b9eff]/20 hover:bg-[#3b9eff]/30 text-xs font-semibold text-[#3b9eff] transition-colors"
                    >
                      Join
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {activeTab === 'foryou' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[24px] p-[1px] bg-gradient-to-b from-[#ec4899]/30 to-[#db2777]/10"
          >
            <div className="relative rounded-[24px] bg-gradient-to-br from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#ec4899]" strokeWidth={2} />
                  <h3 className="font-bold">Topic of the Week</h3>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-[#ec4899]/20 text-[#ec4899] font-bold">Live votes</span>
              </div>

              <p className="text-sm text-white/70 mb-3">Best Warsaw neighborhoods for expats - vote now.</p>

              <button className="w-full py-2 rounded-lg bg-gradient-to-b from-[#ec4899] to-[#db2777] font-semibold text-sm shadow-[0_4px_16px_rgba(236,72,153,0.4)]">
                Vote & Discuss
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-end justify-center"
            onClick={() => setShowCreateModal(false)}
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
              <div className="rounded-t-[28px] bg-gradient-to-b from-[#1a2642]/98 to-[#0f172a]/98 backdrop-blur-xl p-6">
                <h3 className="text-xl font-bold mb-4">Create Post</h3>

                <div className="p-3 rounded-lg bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 mb-4">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-[#8b5cf6] mt-0.5" strokeWidth={2} />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[#8b5cf6] mb-1">AI Suggestion</p>
                      <p className="text-xs text-white/70">Try a practical post title tied to PESEL, housing, or banking.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    placeholder="Post title..."
                    value={createTitle}
                    onChange={(e) => setCreateTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-[#8b5cf6]/50"
                  />

                  <select
                    value={createCategory}
                    onChange={(e) => setCreateCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-[#8b5cf6]/50"
                  >
                    <option value="Moving & Admin" className="bg-[#1a2642]">
                      Moving & Admin
                    </option>
                    <option value="Housing" className="bg-[#1a2642]">
                      Housing
                    </option>
                    <option value="Social & Events" className="bg-[#1a2642]">
                      Social & Events
                    </option>
                    <option value="Culture" className="bg-[#1a2642]">
                      Culture
                    </option>
                  </select>

                  <textarea
                    placeholder="What's on your mind?"
                    value={createBody}
                    onChange={(e) => setCreateBody(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-[#8b5cf6]/50 resize-none"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={handleVoiceRecord}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                        voiceRecording ? 'bg-red-500/20 border border-red-400/30' : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <Mic className={`w-4 h-4 ${voiceRecording ? 'text-red-400' : 'text-white/70'}`} strokeWidth={2} />
                      <span className={`text-xs font-semibold ${voiceRecording ? 'text-red-400' : 'text-white/70'}`}>
                        {voiceRecording ? 'Recording...' : 'Voice'}
                      </span>
                    </button>

                    <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10">
                      <ImageIcon className="w-4 h-4 text-white/70" strokeWidth={2} />
                      <span className="text-xs font-semibold text-white/70">Image</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-green-500/10 border border-green-400/20 mb-4">
                  <p className="text-xs text-green-400 leading-relaxed">
                    <span className="font-semibold">Earn +15 points</span> for helpful posts and +5 bonus for verified answers.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => void handleCreatePost()}
                    className="flex-1 py-3 rounded-lg bg-gradient-to-b from-[#8b5cf6] to-[#7c3aed] font-semibold shadow-[0_4px_16px_rgba(139,92,246,0.4)]"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" strokeWidth={2} />
                      <span>Post</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/15 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
