import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Mic,
  MapPin,
  Star,
  Shield,
  Phone,
  Globe,
  Navigation as NavIcon,
  ChevronRight,
  Plus,
  Crown,
  TrendingUp,
  CheckCircle,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import { useServices } from '../services/api/hooks';
import type { ServiceReview, ServiceSummary } from '../services/api/types';

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

const FALLBACK_BUSINESSES: Business[] = [
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
    address: 'ul. Marszalkowska 142',
    phone: '+48 22 123 4567',
    website: 'mbank.pl',
    topReview: 'Best English support, opened account in 30 minutes!',
    studentFriendly: true,
    hasAR: true,
    featured: true,
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
    address: 'ul. Nowy Swiat 45',
    phone: '+48 22 987 6543',
    website: 'legalexpat.pl',
    topReview: 'Handled my visa extension perfectly, worth every zloty.',
    hasAR: true,
    featured: true,
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
    address: 'ul. Krakowskie Przedmiescie 13',
    website: 'warsawlanguagehub.com',
    topReview: 'Small classes, native speakers, rapid progress!',
    studentFriendly: true,
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
    topReview: 'Modern equipment and no-pressure consultations.',
    hasAR: true,
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
    address: 'Mokotow district',
    phone: '+48 500 123 456',
    topReview: 'Careful with furniture, affordable rates.',
  },
];

const CATEGORY_META: Record<string, { icon: string; rank: number }> = {
  banks: { icon: '??', rank: 1 },
  immigration: { icon: '??', rank: 2 },
  lawyers: { icon: '??', rank: 2 },
  language: { icon: '??', rank: 3 },
  health: { icon: '??', rank: 4 },
  moving: { icon: '??', rank: 5 },
};

function normalizeCategoryId(name: string): string {
  const value = name.toLowerCase();
  if (value.includes('immigration') || value.includes('law')) return 'immigration';
  if (value.includes('bank')) return 'banks';
  if (value.includes('language')) return 'language';
  if (value.includes('health') || value.includes('doctor') || value.includes('dental')) return 'health';
  if (value.includes('moving')) return 'moving';
  return value.replace(/\s+/g, '-');
}

function inferEnglishLevel(category: string): Business['englishLevel'] {
  const value = category.toLowerCase();
  if (value.includes('immigration') || value.includes('law') || value.includes('language') || value.includes('bank')) {
    return 'Fluent';
  }
  if (value.includes('health')) return 'Fluent';
  return 'Basic';
}

function mapServiceSummary(service: ServiceSummary, fallback?: Business): Business {
  return {
    id: service.id,
    name: service.name,
    category: service.category,
    expatScore: service.expatScore ?? fallback?.expatScore ?? 4.4,
    reviews: fallback?.reviews ?? 0,
    verified: service.verified,
    englishLevel: fallback?.englishLevel ?? inferEnglishLevel(service.category),
    priceRange: fallback?.priceRange ?? '$$',
    distance: fallback?.distance ?? 'Nearby',
    address: fallback?.address ?? service.district ?? 'Warsaw',
    phone: fallback?.phone,
    website: fallback?.website,
    topReview: fallback?.topReview,
    studentFriendly: fallback?.studentFriendly,
    hasAR: fallback?.hasAR ?? false,
    featured: fallback?.featured,
  };
}

export function PremiumDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceSearch, setIsVoiceSearch] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedBusiness, setExpandedBusiness] = useState<string | null>(null);
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<Business | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [businesses, setBusinesses] = useState<Business[]>(FALLBACK_BUSINESSES);
  const [reviewsByBusiness, setReviewsByBusiness] = useState<Record<string, ServiceReview[]>>({});

  const servicesApi = useServices();

  useEffect(() => {
    if (!servicesApi.data || servicesApi.data.length === 0) return;

    const fallbackByName = new Map(FALLBACK_BUSINESSES.map((item) => [item.name.toLowerCase(), item]));
    const mapped = servicesApi.data.map((service) => mapServiceSummary(service, fallbackByName.get(service.name.toLowerCase())));
    setBusinesses(mapped);
  }, [servicesApi.data]);

  useEffect(() => {
    if (!expandedBusiness || !servicesApi.isLive || reviewsByBusiness[expandedBusiness]) return;

    let active = true;

    servicesApi
      .loadReviews(expandedBusiness)
      .then((reviews) => {
        if (!active) return;
        setReviewsByBusiness((prev) => ({ ...prev, [expandedBusiness]: reviews }));

        if (reviews.length > 0) {
          const latest = reviews[0];
          setBusinesses((prev) =>
            prev.map((item) =>
              item.id === expandedBusiness
                ? {
                    ...item,
                    reviews: reviews.length,
                    topReview: latest.title ? `${latest.title}: ${latest.body}` : latest.body,
                  }
                : item,
            ),
          );
        }
      })
      .catch(() => {
        if (!active) return;
      });

    return () => {
      active = false;
    };
  }, [expandedBusiness, servicesApi, reviewsByBusiness]);

  const categories = useMemo(() => {
    const grouped = businesses.reduce<Record<string, { name: string; count: number }>>((acc, business) => {
      const id = normalizeCategoryId(business.category);
      if (!acc[id]) {
        acc[id] = { name: business.category, count: 0 };
      }
      acc[id].count += 1;
      return acc;
    }, {});

    return [
      { id: 'all', name: 'For You', icon: '?', count: businesses.length, rank: 0 },
      ...Object.entries(grouped)
        .map(([id, value]) => ({
          id,
          name: value.name,
          icon: CATEGORY_META[id]?.icon || '??',
          count: value.count,
          rank: CATEGORY_META[id]?.rank ?? 99,
        }))
        .sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name)),
    ];
  }, [businesses]);

  useEffect(() => {
    if (!categories.some((cat) => cat.id === activeCategory)) {
      setActiveCategory('all');
    }
  }, [categories, activeCategory]);

  const filteredBusinesses = useMemo(() => {
    const q = searchQuery.toLowerCase();

    return businesses
      .filter((b) => activeCategory === 'all' || normalizeCategoryId(b.category) === activeCategory)
      .filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.address.toLowerCase().includes(q),
      );
  }, [businesses, activeCategory, searchQuery]);

  const handleVoiceSearch = () => {
    setIsVoiceSearch(true);
    toast.info('Listening...', {
      description: 'Say what you need',
      duration: 2000,
    });

    window.setTimeout(() => {
      setIsVoiceSearch(false);
      setSearchQuery('English-speaking dentist near Mokotow');
      toast.success('Found matching services', { duration: 2000 });
    }, 2000);
  };

  const openReviewPrompt = (business: Business) => {
    setReviewTarget(business);
    setReviewRating(5);
    setReviewTitle('');
    setReviewBody('');
    setShowReviewModal(true);
  };

  const handlePatronize = async (business: Business) => {
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 50, 30]);
    }

    if (servicesApi.isLive) {
      try {
        await servicesApi.checkIn(business.id);
      } catch {
        toast.error('Check-in failed', {
          description: 'Please retry in a moment.',
          duration: 2500,
        });
        return;
      }
    }

    toast.success(`Check-in at ${business.name}`, {
      description: 'Great. Please leave a review to help the community.',
      duration: 3000,
    });

    window.setTimeout(() => openReviewPrompt(business), 500);
  };

  const handleARPreview = (business: Business) => {
    toast.info('AR Preview', {
      description: `Opening guided view for ${business.name}...`,
      duration: 2000,
    });
  };

  const submitReview = async () => {
    if (!reviewTarget) return;
    if (!reviewBody.trim()) {
      toast.error('Add a short review before submitting.');
      return;
    }

    const body = reviewBody.trim();

    try {
      const created = await servicesApi.submitReview(reviewTarget.id, {
        rating: reviewRating,
        title: reviewTitle.trim() || undefined,
        body,
      });

      setReviewsByBusiness((prev) => {
        const existing = prev[reviewTarget.id] || [];
        return { ...prev, [reviewTarget.id]: [created, ...existing] };
      });

      setBusinesses((prev) =>
        prev.map((item) => {
          if (item.id !== reviewTarget.id) return item;
          const newCount = item.reviews + 1;
          const nextScore = Math.min(5, Math.max(0, (item.expatScore * item.reviews + reviewRating) / newCount));
          return {
            ...item,
            reviews: newCount,
            expatScore: Number(nextScore.toFixed(1)),
            topReview: reviewTitle.trim() ? `${reviewTitle.trim()}: ${body}` : body,
          };
        }),
      );

      toast.success('Review submitted', {
        description: servicesApi.isLive
          ? 'Thanks. Your feedback now helps rank this service for other expats.'
          : 'Saved locally for now. It will sync after API setup.',
      });

      setShowReviewModal(false);
      setReviewTarget(null);
    } catch {
      toast.error('Could not submit review', {
        description: 'Please retry in a moment.',
      });
    }
  };

  const handleSuggestBusiness = () => {
    setShowSuggestModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#0a0e1a] to-[#000000] text-white">
      <div className="sticky top-0 z-40 px-5 pt-8 pb-4 backdrop-blur-xl bg-gradient-to-b from-[#000000] to-transparent">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold mb-1">Warsaw Concierge</h1>
              {servicesApi.isLive && (
                <span className="mb-1 px-2 py-0.5 rounded-full bg-green-500/20 border border-green-400/25 text-[10px] font-semibold text-green-400">
                  LIVE
                </span>
              )}
            </div>
            <p className="text-sm text-white/50">Verified expat-friendly services</p>
          </div>
          <button
            onClick={handleSuggestBusiness}
            className="p-2.5 rounded-full bg-gradient-to-b from-[#3b9eff] to-[#2d7dd2] shadow-[0_4px_16px_rgba(59,158,255,0.4)]"
          >
            <Plus className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <div className="relative mb-4">
          <div className="relative rounded-[16px] p-[1px] bg-gradient-to-b from-white/25 to-white/10">
            <div className="relative rounded-[16px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl">
              <div className="flex items-center gap-3 px-4 py-3">
                <Search className="w-5 h-5 text-white/50" strokeWidth={2} />
                <input
                  type="text"
                  placeholder="English-speaking dentist near Mokotow?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-sm"
                />
                <button
                  onClick={handleVoiceSearch}
                  className={`p-2 rounded-full transition-all ${
                    isVoiceSearch ? 'bg-gradient-to-b from-[#ff6b9d] to-[#ff4757]' : 'bg-white/5 hover:bg-white/10'
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

      <div className="px-5 pb-24 space-y-4">
        {activeCategory === 'all' && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-5 h-5 text-[#f59e0b]" strokeWidth={2} />
              <h2 className="font-bold">Recommended For You</h2>
            </div>
            <p className="text-xs text-white/50 mb-3">Based on your location and current checklist journey</p>
          </div>
        )}

        <div className="space-y-3">
          {filteredBusinesses.map((business, index) => (
            <motion.div
              key={business.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative overflow-hidden rounded-[24px] p-[1px] ${
                business.featured ? 'bg-gradient-to-b from-amber-400/40 to-amber-500/20' : 'bg-gradient-to-b from-white/20 to-white/5'
              }`}
            >
              <div className="relative rounded-[24px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[24px] pointer-events-none" />

                {business.featured && (
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-white" strokeWidth={2} />
                    <span className="text-[9px] text-white font-bold uppercase">Featured</span>
                  </div>
                )}

                <div className="relative">
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
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-[#1a2642] border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                              <p className="text-xs text-white/90">AI-verified + community reviews</p>
                              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#1a2642]" />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#3b9eff]/20 text-[#3b9eff] font-medium">{business.category}</span>

                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400" strokeWidth={2} fill="currentColor" />
                          <span className="text-sm font-bold text-amber-400">{business.expatScore}</span>
                          <span className="text-xs text-white/40">({business.reviews})</span>
                        </div>

                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            business.englishLevel === 'Fluent'
                              ? 'bg-green-500/20 text-green-400'
                              : business.englishLevel === 'Basic'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-white/10 text-white/50'
                          }`}
                        >
                          {business.englishLevel === 'Fluent'
                            ? 'Fluent EN'
                            : business.englishLevel === 'Basic'
                            ? 'Basic EN'
                            : 'No EN'}
                        </span>

                        <span className="text-xs text-white/50">{business.priceRange}</span>

                        {business.studentFriendly && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8b5cf6]/20 text-[#8b5cf6] font-semibold">Student-Friendly</span>
                        )}
                      </div>

                      {business.topReview && (
                        <div className="p-2 rounded-lg bg-white/5 border border-white/5 mb-2">
                          <p className="text-xs text-white/70 italic leading-relaxed">"{business.topReview}"</p>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-white/50">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                          <span>{business.distance}</span>
                        </div>
                        <span className="line-clamp-1">{business.address}</span>
                      </div>
                    </div>

                    <button onClick={() => setExpandedBusiness(expandedBusiness === business.id ? null : business.id)} className="p-1">
                      <motion.div animate={{ rotate: expandedBusiness === business.id ? 90 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronRight className="w-5 h-5 text-white/40" strokeWidth={2} />
                      </motion.div>
                    </button>
                  </div>

                  <AnimatePresence>
                    {expandedBusiness === business.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 mt-3 border-t border-white/10 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => void handlePatronize(business)}
                              className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-b from-[#3b9eff] to-[#2d7dd2] font-semibold text-sm shadow-[0_4px_16px_rgba(59,158,255,0.4)]"
                            >
                              <CheckCircle className="w-4 h-4" strokeWidth={2} />
                              Check-In
                            </button>

                            <button
                              onClick={() => openReviewPrompt(business)}
                              className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#10b981]/20 hover:bg-[#10b981]/30 font-semibold text-sm text-[#10b981]"
                            >
                              <Star className="w-4 h-4" strokeWidth={2} />
                              Review
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
                              <a href={`tel:${business.phone}`} className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 font-semibold text-sm">
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

                          {reviewsByBusiness[business.id]?.length ? (
                            <div className="p-3 rounded-[12px] bg-white/5 border border-white/10">
                              <p className="text-xs text-white/60 mb-1">Latest community review</p>
                              <p className="text-sm text-white/80 leading-relaxed">
                                {reviewsByBusiness[business.id][0]?.body}
                              </p>
                            </div>
                          ) : null}
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

      <AnimatePresence>
        {showReviewModal && reviewTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[210] flex items-end justify-center"
            onClick={() => setShowReviewModal(false)}
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
                <h3 className="text-xl font-bold mb-1">Review {reviewTarget.name}</h3>
                <p className="text-xs text-white/60 mb-4">Your review shapes rankings for other expats.</p>

                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button key={value} onClick={() => setReviewRating(value)}>
                      <Star
                        className={`w-6 h-6 ${value <= reviewRating ? 'text-amber-400' : 'text-white/30'}`}
                        strokeWidth={2}
                        fill={value <= reviewRating ? 'currentColor' : 'none'}
                      />
                    </button>
                  ))}
                </div>

                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="Optional title"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-[#3b9eff]/50"
                  />
                  <textarea
                    value={reviewBody}
                    onChange={(e) => setReviewBody(e.target.value)}
                    placeholder="Share your experience"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-[#3b9eff]/50 resize-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button onClick={() => void submitReview()} className="flex-1 py-3 rounded-lg bg-gradient-to-b from-[#10b981] to-[#059669] font-semibold">
                    Submit Review
                  </button>
                  <button onClick={() => setShowReviewModal(false)} className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/15 font-semibold">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                    placeholder="Category"
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
                  AI will verify the business and add it within 24 hours. You will earn +20 points.
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowSuggestModal(false);
                      toast.success('Suggestion submitted', {
                        description: 'AI verification started. Check back in 24h.',
                        duration: 3000,
                      });
                    }}
                    className="flex-1 py-3 rounded-lg bg-gradient-to-b from-[#3b9eff] to-[#2d7dd2] font-semibold"
                  >
                    Submit
                  </button>
                  <button onClick={() => setShowSuggestModal(false)} className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/15 font-semibold">
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