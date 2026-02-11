import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Mic, MapPin, Star, Shield, Phone, Globe, Navigation as NavIcon, ChevronRight, Plus, Crown, TrendingUp, Users, CheckCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Business {
  id: string;
  name: string;
  category: string;
  expatScore: number;
  reviews: number;
  verified: boolean;
  englishLevel: 'Fluent' | 'Basic' | 'None';
  priceRange: '$' | '$$' | '$$$';
  distance: string;
  address: string;
  phone?: string;
  website?: string;
  topReview?: string;
  studentFriendly?: boolean;
  hasAR?: boolean;
  featured?: boolean;
}

export function PremiumDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceSearch, setIsVoiceSearch] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedBusiness, setExpandedBusiness] = useState<string | null>(null);
  const [showSuggestModal, setShowSuggestModal] = useState(false);

  const businesses: Business[] = [
    {
      id: '1',
      name: 'mBank',
      category: 'Banks',
      expatScore: 4.8,
      reviews: 247,
      verified: true,
      englishLevel: 'Fluent',
      priceRange: '$',
      distance: '0.5 km',
      address: 'ul. Marszałkowska 142',
      phone: '+48 22 123 4567',
      website: 'mbank.pl',
      topReview: 'Best English support, opened account in 30 minutes!',
      studentFriendly: true,
      hasAR: true,
      featured: true
    },
    {
      id: '2',
      name: 'LegalExpat Warsaw',
      category: 'Immigration Lawyers',
      expatScore: 4.9,
      reviews: 189,
      verified: true,
      englishLevel: 'Fluent',
      priceRange: '$$',
      distance: '1.2 km',
      address: 'ul. Nowy Świat 45',
      phone: '+48 22 987 6543',
      website: 'legalexpat.pl',
      topReview: 'Handled my visa extension perfectly, worth every zloty',
      hasAR: true,
      featured: true
    },
    {
      id: '3',
      name: 'Warsaw Language Hub',
      category: 'Language Schools',
      expatScore: 4.7,
      reviews: 156,
      verified: true,
      englishLevel: 'Fluent',
      priceRange: '$$',
      distance: '0.8 km',
      address: 'ul. Krakowskie Przedmieście 13',
      website: 'warsawlanguagehub.com',
      topReview: 'Small classes, native speakers, rapid progress!',
      studentFriendly: true,
      hasAR: false
    },
    {
      id: '4',
      name: 'Expat Dental Care',
      category: 'Health',
      expatScore: 4.6,
      reviews: 134,
      verified: true,
      englishLevel: 'Fluent',
      priceRange: '$$',
      distance: '2.1 km',
      address: 'al. Jerozolimskie 65',
      phone: '+48 22 456 7890',
      topReview: 'Modern equipment, no-pressure consultations',
      hasAR: true
    },
    {
      id: '5',
      name: 'Warsaw Movers Pro',
      category: 'Moving',
      expatScore: 4.5,
      reviews: 98,
      verified: true,
      englishLevel: 'Basic',
      priceRange: '$',
      distance: '3.5 km',
      phone: '+48 500 123 456',
      topReview: 'Careful with furniture, affordable rates',
      hasAR: false
    }
  ];

  const categories = [
    { id: 'all', name: 'For You', icon: '✨', count: businesses.length },
    { id: 'banks', name: 'Banks', icon: '🏦', count: 12 },
    { id: 'lawyers', name: 'Immigration', icon: '⚖️', count: 8 },
    { id: 'schools', name: 'Language', icon: '📚', count: 15 },
    { id: 'health', name: 'Health', icon: '🏥', count: 24 },
    { id: 'moving', name: 'Moving', icon: '📦', count: 6 },
  ];

  const handleVoiceSearch = () => {
    setIsVoiceSearch(true);
    toast.info('🎙️ Listening...', {
      description: 'Say what you need',
      duration: 2000,
    });

    setTimeout(() => {
      setIsVoiceSearch(false);
      setSearchQuery('English-speaking dentist near Mokotów');
      toast.success('Found 4 matches', { duration: 2000 });
    }, 2000);
  };

  const handlePatronize = (business: Business) => {
    toast.success(`📍 Check-in at ${business.name}`, {
      description: '+5 points earned! Leave a review for +15 more',
      duration: 3000,
    });

    if ('vibrate' in navigator) {
      navigator.vibrate([30, 50, 30]);
    }
  };

  const handleARPreview = (business: Business) => {
    toast.info('🔮 AR Preview', {
      description: 'Opening camera with directions overlay...',
      duration: 2000,
    });
  };

  const handleSuggestBusiness = () => {
    setShowSuggestModal(true);
  };

  const filteredBusinesses = businesses
    .filter(b => activeCategory === 'all' || b.category.toLowerCase().includes(activeCategory))
    .filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                 b.category.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#0a0e1a] to-[#000000] text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 px-5 pt-8 pb-4 backdrop-blur-xl bg-gradient-to-b from-[#000000] to-transparent">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Warsaw Concierge</h1>
            <p className="text-sm text-white/50">Verified expat-friendly services</p>
          </div>
          <button
            onClick={handleSuggestBusiness}
            className="p-2.5 rounded-full bg-gradient-to-b from-[#3b9eff] to-[#2d7dd2] shadow-[0_4px_16px_rgba(59,158,255,0.4)]"
          >
            <Plus className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* AI Search Bar */}
        <div className="relative mb-4">
          <div className="relative rounded-[16px] p-[1px] bg-gradient-to-b from-white/25 to-white/10">
            <div className="relative rounded-[16px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl">
              <div className="flex items-center gap-3 px-4 py-3">
                <Search className="w-5 h-5 text-white/50" strokeWidth={2} />
                <input
                  type="text"
                  placeholder="English-speaking dentist near Mokotów?"
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
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-b from-[#3b9eff] to-[#2d7dd2] text-white shadow-[0_4px_16px_rgba(59,158,255,0.4)]'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              <span className="text-white/40">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-24 space-y-4">
        {/* For You Section */}
        {activeCategory === 'all' && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-5 h-5 text-[#f59e0b]" strokeWidth={2} />
              <h2 className="font-bold">Recommended For You</h2>
            </div>
            <p className="text-xs text-white/50 mb-3">Based on your PESEL task and location</p>
          </div>
        )}

        {/* Business Listings - Bento Grid */}
        <div className="space-y-3">
          {filteredBusinesses.map((business, index) => (
            <motion.div
              key={business.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative overflow-hidden rounded-[24px] p-[1px] ${
                business.featured
                  ? 'bg-gradient-to-b from-amber-400/40 to-amber-500/20'
                  : 'bg-gradient-to-b from-white/20 to-white/5'
              }`}
            >
              <div className="relative rounded-[24px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
                {/* Glossy overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[24px] pointer-events-none" />
                
                {/* Featured badge */}
                {business.featured && (
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-white" strokeWidth={2} />
                    <span className="text-[9px] text-white font-bold uppercase">Featured</span>
                  </div>
                )}

                <div className="relative">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-14 h-14 rounded-[16px] bg-gradient-to-br from-[#3b9eff] to-[#8b5cf6] flex items-center justify-center text-2xl font-bold shadow-[0_4px_16px_rgba(59,158,255,0.4)]">
                      {business.name[0]}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-base">{business.name}</h3>
                        {business.verified && (
                          <div className="relative group">
                            <Shield className="w-4 h-4 text-[#10b981]" strokeWidth={2} fill="currentColor" />
                            
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-[#1a2642] border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                              <p className="text-xs text-white/90">AI-verified + 50+ expat reviews</p>
                              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#1a2642]" />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#3b9eff]/20 text-[#3b9eff] font-medium">
                          {business.category}
                        </span>
                        
                        {/* Expat Score */}
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400" strokeWidth={2} fill="currentColor" />
                          <span className="text-sm font-bold text-amber-400">{business.expatScore}</span>
                          <span className="text-xs text-white/40">({business.reviews})</span>
                        </div>

                        {/* English Level */}
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          business.englishLevel === 'Fluent' 
                            ? 'bg-green-500/20 text-green-400' 
                            : business.englishLevel === 'Basic'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-white/10 text-white/50'
                        }`}>
                          {business.englishLevel === 'Fluent' ? '🇬🇧 Fluent' : 
                           business.englishLevel === 'Basic' ? '🇬🇧 Basic' : 'No English'}
                        </span>

                        {/* Price Range */}
                        <span className="text-xs text-white/50">{business.priceRange}</span>

                        {business.studentFriendly && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8b5cf6]/20 text-[#8b5cf6] font-semibold">
                            🎓 Student-Friendly
                          </span>
                        )}
                      </div>

                      {/* Top Review */}
                      {business.topReview && (
                        <div className="p-2 rounded-lg bg-white/5 border border-white/5 mb-2">
                          <p className="text-xs text-white/70 italic leading-relaxed">
                            "{business.topReview}"
                          </p>
                        </div>
                      )}

                      {/* Location */}
                      <div className="flex items-center gap-4 text-xs text-white/50">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                          <span>{business.distance}</span>
                        </div>
                        <span>{business.address}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setExpandedBusiness(expandedBusiness === business.id ? null : business.id)}
                      className="p-1"
                    >
                      <motion.div
                        animate={{ rotate: expandedBusiness === business.id ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="w-5 h-5 text-white/40" strokeWidth={2} />
                      </motion.div>
                    </button>
                  </div>

                  {/* Expanded Actions */}
                  <AnimatePresence>
                    {expandedBusiness === business.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 mt-3 border-t border-white/10">
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => handlePatronize(business)}
                              className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-b from-[#3b9eff] to-[#2d7dd2] font-semibold text-sm shadow-[0_4px_16px_rgba(59,158,255,0.4)]"
                            >
                              <CheckCircle className="w-4 h-4" strokeWidth={2} />
                              Check-In
                            </button>

                            {business.hasAR && (
                              <button
                                onClick={() => handleARPreview(business)}
                                className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#8b5cf6]/20 hover:bg-[#8b5cf6]/30 font-semibold text-sm text-[#8b5cf6]"
                              >
                                <Eye className="w-4 h-4" strokeWidth={2} />
                                AR View
                              </button>
                            )}

                            {business.phone && (
                              <a
                                href={`tel:${business.phone}`}
                                className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 font-semibold text-sm"
                              >
                                <Phone className="w-4 h-4" strokeWidth={2} />
                                Call
                              </a>
                            )}

                            {business.website && (
                              <a
                                href={`https://${business.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 font-semibold text-sm"
                              >
                                <Globe className="w-4 h-4" strokeWidth={2} />
                                Website
                              </a>
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
        </div>

        {filteredBusinesses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/50 mb-2">No businesses found</p>
            <p className="text-sm text-white/30">Try a different search</p>
          </div>
        )}
      </div>

      {/* Suggest Business Modal */}
      <AnimatePresence>
        {showSuggestModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-end justify-center"
            onClick={() => setShowSuggestModal(false)}
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
                <h3 className="text-xl font-bold mb-4">Suggest a Business</h3>
                
                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    placeholder="Business name"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-[#3b9eff]/50"
                  />
                  <input
                    type="text"
                    placeholder="Category (e.g., Banks, Lawyers)"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-[#3b9eff]/50"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-[#3b9eff]/50"
                  />
                  <textarea
                    placeholder="Why should expats know about this place?"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-[#3b9eff]/50 resize-none"
                  />
                </div>

                <p className="text-xs text-white/50 mb-4 leading-relaxed">
                  AI will verify the business and add it within 24 hours. You'll earn +20 points!
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowSuggestModal(false);
                      toast.success('✅ Suggestion submitted!', {
                        description: 'AI is verifying... Check back in 24h',
                        duration: 3000,
                      });
                    }}
                    className="flex-1 py-3 rounded-lg bg-gradient-to-b from-[#3b9eff] to-[#2d7dd2] font-semibold"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => setShowSuggestModal(false)}
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
