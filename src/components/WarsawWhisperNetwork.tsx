import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Heart, Eye, TrendingUp, Mic, Image as ImageIcon, PlusCircle, Sparkles, Crown, MapPin, Users, ChevronRight, Volume2, Send } from 'lucide-react';
import { toast } from 'sonner';

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

export function WarsawWhisperNetwork() {
  const [activeTab, setActiveTab] = useState('foryou');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [voiceRecording, setVoiceRecording] = useState(false);

  const tabs = [
    { id: 'foryou', label: 'For You', icon: Sparkles },
    { id: 'hot', label: 'Hot', icon: TrendingUp },
    { id: 'admin', label: 'Admin', icon: '📋' },
    { id: 'housing', label: 'Housing', icon: '🏠' },
    { id: 'social', label: 'Social', icon: '🎉' },
    { id: 'vip', label: 'VIP', icon: Crown },
  ];

  const posts: Post[] = [
    {
      id: '1',
      author: {
        name: 'Sarah M.',
        avatar: 'S',
        level: 12,
        verified: true
      },
      title: 'PESEL appointment - Current wait times?',
      content: 'Just booked mine online and got a date 3 weeks out. Anyone have recent experience with walk-ins vs online booking?',
      category: 'Moving & Admin',
      timestamp: '2h ago',
      likes: 34,
      comments: 18,
      views: 456,
      isHot: true,
      hasVoice: true,
      aiSummary: 'TL;DR: PESEL wait 2-4 weeks. Top tip: Book online at 6am for faster slots.',
      culturalNote: 'In Poland, PESEL is your permanent ID number - essential for everything from bank accounts to SIM cards.'
    },
    {
      id: '2',
      author: {
        name: 'Luca R.',
        avatar: 'L',
        level: 8,
        verified: true
      },
      title: 'Red flags in rental contracts - What to watch for',
      content: 'After nearly getting scammed, here\'s my checklist. Number 1: Registration clause...',
      category: 'Housing',
      timestamp: '4h ago',
      likes: 67,
      comments: 29,
      views: 892,
      isHot: true,
      hasImage: true,
      aiSummary: 'TL;DR: Must-have clauses: Registration, deposit return (30 days), utilities breakdown. Red flags: No registration, vague damages.',
      culturalNote: 'Polish law requires landlords to register tenancy with tax authorities - not doing so is illegal.'
    },
    {
      id: '3',
      author: {
        name: 'Maria K.',
        avatar: 'M',
        level: 15,
        verified: true
      },
      title: 'Best Polish series to learn the language?',
      content: 'Trying to improve my Polish. What shows do you recommend on Netflix that helped you pick up conversational phrases?',
      category: 'Culture',
      timestamp: '1d ago',
      likes: 45,
      comments: 34,
      views: 567,
      isHot: false,
      hasPoll: true,
      culturalNote: 'Watching Polish TV with subtitles is one of the most effective ways to learn - try "1983" or "Sexify" for modern dialogue.'
    },
    {
      id: '4',
      author: {
        name: 'Alex P.',
        avatar: 'A',
        level: 20,
        verified: true
      },
      title: '[VIP] Praga Warehouse Party - Feb 14',
      content: 'Exclusive expat event in the coolest neighborhood. Limited to 50 people. AR preview available.',
      category: 'Events',
      timestamp: '3h ago',
      likes: 89,
      comments: 42,
      views: 234,
      isHot: true,
      isVIP: true,
      hasImage: true,
      aiSummary: 'Exclusive Praga event - RSVP with escrow deposit. AR map preview shows venue + attendees.'
    }
  ];

  const handleCreatePost = () => {
    setShowCreateModal(true);
  };

  const handleVoiceRecord = () => {
    setVoiceRecording(!voiceRecording);
    if (!voiceRecording) {
      toast.info('🎙️ Recording...', {
        description: 'Tap again to stop',
        duration: 2000,
      });
    } else {
      toast.success('✅ Voice post created!', {
        description: '+15 points earned',
        duration: 2000,
      });
    }

    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  };

  const handleLike = (postId: string) => {
    toast.success('❤️ Liked!', {
      description: '+2 points earned',
      duration: 1500,
    });

    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  };

  const handleJoinThread = (postId: string) => {
    toast.success('🔔 Joined thread!', {
      description: 'You\'ll get notified of new replies',
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#0a0e1a] to-[#000000] text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 px-5 pt-8 pb-4 backdrop-blur-xl bg-gradient-to-b from-[#000000] to-transparent">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Warsaw Whisper Network</h1>
            <p className="text-sm text-white/50">Your trusted expat community</p>
          </div>
          
          <button
            onClick={handleCreatePost}
            className="p-2.5 rounded-full bg-gradient-to-b from-[#8b5cf6] to-[#7c3aed] shadow-[0_4px_16px_rgba(139,92,246,0.4)]"
          >
            <PlusCircle className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* Swipeable Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = typeof tab.icon === 'string' ? null : tab.icon;
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
                {Icon ? <Icon className="w-4 h-4" strokeWidth={2} /> : <span>{tab.icon}</span>}
                <span>{tab.label}</span>
                {tab.id === 'vip' && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-24 space-y-4">
        {/* AI Suggestion Card - For You Tab */}
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
                    Based on your "Open Bank Account" task, you might find these contract discussions helpful
                  </p>
                  <button className="text-xs font-semibold text-[#3b9eff] hover:text-[#5fb3ff] transition-colors">
                    View Suggested Threads →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Posts - Bento Grid Style */}
        <div className="space-y-3">
          {posts.map((post, index) => (
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
                {/* Glossy overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[24px] pointer-events-none" />
                
                {/* Hot Badge with Animation */}
                {post.isHot && !post.isVIP && (
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center gap-1">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      🔥
                    </motion.div>
                    <span className="text-[9px] text-white font-bold uppercase">Hot</span>
                  </div>
                )}

                {/* VIP Badge */}
                {post.isVIP && (
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-white" strokeWidth={2} fill="currentColor" />
                    <span className="text-[9px] text-white font-bold uppercase">VIP</span>
                  </div>
                )}

                <div className="relative">
                  {/* Author Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3b9eff] to-[#8b5cf6] flex items-center justify-center text-lg font-bold shadow-[0_4px_12px_rgba(59,158,255,0.4)]">
                        {post.author.avatar}
                      </div>
                      {post.author.verified && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-[#0f172a] flex items-center justify-center">
                          <span className="text-[8px]">✓</span>
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
                        <span className="text-white/30">•</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                          {post.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="mb-3">
                    <h3 className="font-semibold text-base mb-2">{post.title}</h3>
                    <p className="text-sm text-white/70 leading-relaxed line-clamp-2">
                      {post.content}
                    </p>
                  </div>

                  {/* Media Indicators */}
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
                        <span className="text-[10px] text-[#f59e0b] font-semibold">📊 Poll</span>
                      </div>
                    )}
                  </div>

                  {/* AI Summary */}
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

                  {/* Expanded View with Cultural Note */}
                  <AnimatePresence>
                    {expandedPost === post.id && post.culturalNote && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mb-3"
                      >
                        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-400/20">
                          <div className="flex items-start gap-2">
                            <span className="text-lg">🇵🇱</span>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-amber-400 mb-1">Cultural Context</p>
                              <p className="text-xs text-white/70 leading-relaxed">{post.culturalNote}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Stats & Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-1 text-white/60 hover:text-red-400 transition-colors group"
                      >
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
                      onClick={() => handleJoinThread(post.id)}
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

        {/* Topic of the Week - Community Vote */}
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
                <span className="text-xs px-2 py-1 rounded-full bg-[#ec4899]/20 text-[#ec4899] font-bold">
                  234 votes
                </span>
              </div>

              <p className="text-sm text-white/70 mb-3">
                "Best Warsaw neighborhoods for expats - Vote now!"
              </p>

              <button className="w-full py-2 rounded-lg bg-gradient-to-b from-[#ec4899] to-[#db2777] font-semibold text-sm shadow-[0_4px_16px_rgba(236,72,153,0.4)]">
                Vote & Discuss
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Create Post Modal */}
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
                
                {/* AI Suggestion */}
                <div className="p-3 rounded-lg bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 mb-4">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-[#8b5cf6] mt-0.5" strokeWidth={2} />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[#8b5cf6] mb-1">AI Suggestion</p>
                      <p className="text-xs text-white/70">Based on your tasks: Try "PESEL Tips Needed" or "Bank Account Recommendations"</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    placeholder="Post title..."
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-[#8b5cf6]/50"
                  />
                  
                  <select className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-[#8b5cf6]/50">
                    <option value="" className="bg-[#1a2642]">Select category</option>
                    <option value="admin" className="bg-[#1a2642]">Moving & Admin</option>
                    <option value="housing" className="bg-[#1a2642]">Housing</option>
                    <option value="social" className="bg-[#1a2642]">Social & Events</option>
                    <option value="culture" className="bg-[#1a2642]">Culture</option>
                  </select>

                  <textarea
                    placeholder="What's on your mind?"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-[#8b5cf6]/50 resize-none"
                  />

                  {/* Media Options */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleVoiceRecord}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                        voiceRecording
                          ? 'bg-red-500/20 border border-red-400/30'
                          : 'bg-white/5 hover:bg-white/10'
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
                    <span className="font-semibold">✓ Earn +15 points</span> for helpful posts • +5 bonus for verified answers
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      toast.success('✅ Post created!', {
                        description: '+15 points earned',
                        duration: 3000,
                      });
                    }}
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