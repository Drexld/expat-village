import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Mic, ThumbsUp, Eye, Clock, Sparkles, Play, ChevronRight, TrendingUp, User, Upload, FileText, AlertCircle, CheckCircle, Brain, Share2, Users } from 'lucide-react';
import { toast } from 'sonner';

interface Guide {
  id: string;
  title: string;
  category: string;
  views: number;
  upvotes: number;
  lastUpdated: string;
  hasVideo: boolean;
  hasAR: boolean;
  hasAITool?: 'contract' | 'document';
  realTimeData?: string;
  author?: string;
  trending?: boolean;
}

export function EnhancedGuides() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceSearch, setIsVoiceSearch] = useState(false);
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'trending' | 'recent' | 'popular'>('trending');
  const [showContractAnalyzer, setShowContractAnalyzer] = useState(false);
  const [showDocumentAnalyzer, setShowDocumentAnalyzer] = useState(false);
  const [analyzingContract, setAnalyzingContract] = useState(false);
  const [contractResults, setContractResults] = useState<any>(null);

  const guides: Guide[] = [
    {
      id: '1',
      title: 'Getting Your PESEL Number',
      category: 'Admin',
      views: 2847,
      upvotes: 184,
      lastUpdated: '2 days ago',
      hasVideo: true,
      hasAR: true,
      realTimeData: 'Wait times: 2 weeks as of Feb 9, 2026',
      author: 'drexld',
      trending: true
    },
    {
      id: '2',
      title: 'Opening a Polish Bank Account',
      category: 'Finance',
      views: 1923,
      upvotes: 156,
      lastUpdated: '1 week ago',
      hasVideo: true,
      hasAR: false,
      realTimeData: 'PKO BP offers fastest setup (2 days)',
      author: 'MariaK'
    },
    {
      id: '3',
      title: 'Finding Housing in Warsaw',
      category: 'Housing',
      views: 3421,
      upvotes: 289,
      lastUpdated: '3 days ago',
      hasVideo: true,
      hasAR: false,
      realTimeData: 'Avg rent Mokotów: 3,200 PLN (studio)',
      author: 'WarsawLocal',
      trending: true
    },
    {
      id: '4',
      title: 'Healthcare System Guide',
      category: 'Health',
      views: 1456,
      upvotes: 98,
      lastUpdated: '1 day ago',
      hasVideo: false,
      hasAR: false,
      realTimeData: 'English-speaking doctors available 24/7',
      author: 'HealthyExpat'
    },
    {
      id: '5',
      title: 'Polish SIM Cards Comparison',
      category: 'Tech',
      views: 2134,
      upvotes: 167,
      lastUpdated: '5 days ago',
      hasVideo: true,
      hasAR: false,
      realTimeData: 'Orange offers best student deals',
      author: 'TechGuru'
    },
    {
      id: '6',
      title: 'Warsaw Public Transport 101',
      category: 'Transport',
      views: 2876,
      upvotes: 221,
      lastUpdated: '1 week ago',
      hasVideo: true,
      hasAR: true,
      realTimeData: 'Monthly pass: 110 PLN, Student: 55 PLN',
      author: 'CommuterPro',
      trending: true
    },
  ];

  const categories = [
    { id: 'all', name: 'All', count: guides.length },
    { id: 'admin', name: 'Admin', count: guides.filter(g => g.category === 'Admin').length },
    { id: 'finance', name: 'Finance', count: guides.filter(g => g.category === 'Finance').length },
    { id: 'housing', name: 'Housing', count: guides.filter(g => g.category === 'Housing').length },
    { id: 'health', name: 'Health', count: guides.filter(g => g.category === 'Health').length },
  ];

  const [activeCategory, setActiveCategory] = useState('all');

  const handleVoiceSearch = () => {
    setIsVoiceSearch(true);
    toast.info('🎙️ Listening...', {
      description: 'Say what you need help with',
      duration: 2000,
    });

    // Simulate voice recognition
    setTimeout(() => {
      setIsVoiceSearch(false);
      setSearchQuery('Warsaw doctors');
      toast.success('Found 3 guides about doctors', {
        duration: 2000,
      });
    }, 2000);
  };

  const handleUpvote = (guide: Guide) => {
    toast.success(`👍 Upvoted "${guide.title}"`, {
      description: '+2 points earned',
      duration: 2000,
    });

    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  };

  const filteredGuides = guides
    .filter(g => activeCategory === 'all' || g.category.toLowerCase() === activeCategory)
    .filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'trending') return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
      if (sortBy === 'popular') return b.upvotes - a.upvotes;
      return 0; // recent
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#0a0e1a] to-[#000000] text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 px-5 pt-8 pb-4 backdrop-blur-xl bg-gradient-to-b from-[#000000] to-transparent">
        <h1 className="text-2xl font-bold mb-4">Guides</h1>

        {/* AI-Powered Search Bar */}
        <div className="relative mb-4">
          <div className="relative rounded-[16px] p-[1px] bg-gradient-to-b from-white/20 to-white/5">
            <div className="relative rounded-[16px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl">
              <div className="flex items-center gap-3 px-4 py-3">
                <Search className="w-5 h-5 text-white/50" strokeWidth={2} />
                <input
                  type="text"
                  placeholder="Search guides or ask AI..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-sm"
                />
                <button
                  onClick={handleVoiceSearch}
                  className={`p-2 rounded-full transition-all ${
                    isVoiceSearch
                      ? 'bg-gradient-to-b from-[#ff6b9d] to-[#ff4757]'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {isVoiceSearch && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-[#ff6b9d]"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                  <Mic className="w-4 h-4 relative z-10" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>

          {/* AI Suggestion */}
          {searchQuery === '' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 p-2 rounded-lg bg-[#3b9eff]/10 border border-[#3b9eff]/20"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-[#3b9eff]" strokeWidth={2} />
                <p className="text-xs text-white/70">
                  <span className="font-semibold">AI Tip:</span> Try "PESEL for students" or "cheap housing"
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-white/50 mr-2">Sort:</span>
          {(['trending', 'popular', 'recent'] as const).map((sort) => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                sortBy === sort
                  ? 'bg-gradient-to-b from-[#3b9eff] to-[#2d7dd2] text-white shadow-[0_4px_12px_rgba(59,158,255,0.3)]'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {sort === 'trending' && '🔥 '}
              {sort.charAt(0).toUpperCase() + sort.slice(1)}
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-b from-[#3b9eff] to-[#2d7dd2] text-white shadow-[0_4px_16px_rgba(59,158,255,0.4)]'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {cat.name} <span className="text-white/40">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Guides List */}
      <div className="px-5 pb-24 space-y-3">
        <AnimatePresence>
          {filteredGuides.map((guide, index) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="relative overflow-hidden rounded-[20px] p-[1px] bg-gradient-to-b from-white/20 to-white/5"
            >
              <div className="relative rounded-[20px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
                {/* Glossy overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent rounded-[20px] pointer-events-none" />
                
                {/* Trending badge */}
                {guide.trending && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-red-400" strokeWidth={2} />
                      <span className="text-[9px] text-red-400 font-bold">TRENDING</span>
                    </div>
                  </div>
                )}

                <div className="relative">
                  {/* Title & Category */}
                  <div className="mb-3">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold mb-1">{guide.title}</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#3b9eff]/20 text-[#3b9eff] font-medium">
                            {guide.category}
                          </span>
                          
                          {guide.hasVideo && (
                            <div className="flex items-center gap-1 text-xs text-white/50">
                              <Play className="w-3 h-3" strokeWidth={2} />
                              <span>Video</span>
                            </div>
                          )}
                          
                          {guide.hasAR && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#8b5cf6]/20 text-[#8b5cf6] font-medium">
                              AR
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => setExpandedGuide(expandedGuide === guide.id ? null : guide.id)}
                        className="p-1"
                      >
                        <motion.div
                          animate={{ rotate: expandedGuide === guide.id ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="w-5 h-5 text-white/40" strokeWidth={2} />
                        </motion.div>
                      </button>
                    </div>

                    {/* Real-Time Data */}
                    {guide.realTimeData && (
                      <div className="p-2 rounded-lg bg-green-500/10 border border-green-400/20">
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.8)]"
                          />
                          <p className="text-xs text-green-400 font-medium">{guide.realTimeData}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stats & Author */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleUpvote(guide)}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-white/50 group-hover:text-[#3b9eff]" strokeWidth={2} />
                        <span className="text-xs font-semibold text-white/70 group-hover:text-[#3b9eff]">
                          {guide.upvotes}
                        </span>
                      </button>

                      <div className="flex items-center gap-1 text-xs text-white/50">
                        <Eye className="w-3.5 h-3.5" strokeWidth={2} />
                        <span>{guide.views.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-white/50">
                        <Clock className="w-3.5 h-3.5" strokeWidth={2} />
                        <span>{guide.lastUpdated}</span>
                      </div>
                    </div>

                    {guide.author && (
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 text-white/40" strokeWidth={2} />
                        <span className="text-xs text-white/50">@{guide.author}</span>
                      </div>
                    )}
                  </div>

                  {/* Expanded View */}
                  <AnimatePresence>
                    {expandedGuide === guide.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 mt-3 border-t border-white/10 space-y-3">
                          <p className="text-sm text-white/70 leading-relaxed">
                            This comprehensive guide walks you through everything you need to know. 
                            Updated with the latest information as of {new Date().toLocaleDateString()}.
                          </p>

                          <div className="flex gap-2">
                            <button className="flex-1 py-2 rounded-lg bg-gradient-to-b from-[#3b9eff] to-[#2d7dd2] text-sm font-semibold shadow-[0_4px_16px_rgba(59,158,255,0.4)] hover:shadow-[0_6px_24px_rgba(59,158,255,0.5)] transition-all">
                              Read Guide
                            </button>
                            
                            {guide.hasVideo && (
                              <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                <Play className="w-4 h-4" strokeWidth={2} />
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

        {filteredGuides.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-white/50 mb-2">No guides found</p>
            <p className="text-sm text-white/30">Try a different search or category</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}