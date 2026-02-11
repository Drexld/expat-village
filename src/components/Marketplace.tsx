import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Shield, MapPin, Star, Eye, MessageCircle, Heart, ChevronRight, AlertTriangle, CheckCircle, Package, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface Listing {
  id: string;
  title: string;
  price: number;
  category: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  seller: {
    name: string;
    trustScore: number;
    reviews: number;
    verified: boolean;
  };
  distance: string;
  postedAt: string;
  images: number;
  description: string;
  hasAR?: boolean;
  escrowAvailable: boolean;
  featured?: boolean;
  aiScamScore: number; // 0-100, lower is safer
}

export function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedListing, setExpandedListing] = useState<string | null>(null);
  const [showListModal, setShowListModal] = useState(false);

  const listings: Listing[] = [
    {
      id: '1',
      title: 'IKEA MALM Bed Frame (King)',
      price: 450,
      category: 'Furniture',
      condition: 'Like New',
      seller: {
        name: 'Sarah M.',
        trustScore: 4.9,
        reviews: 23,
        verified: true
      },
      distance: '1.2 km',
      postedAt: '2 hours ago',
      images: 4,
      description: 'Moving back to UK, bought 6 months ago. Perfect condition, non-smoking home.',
      hasAR: true,
      escrowAvailable: true,
      featured: true,
      aiScamScore: 5
    },
    {
      id: '2',
      title: 'MacBook Air M2 (2023)',
      price: 4200,
      category: 'Electronics',
      condition: 'Good',
      seller: {
        name: 'Luca R.',
        trustScore: 4.7,
        reviews: 15,
        verified: true
      },
      distance: '3.5 km',
      postedAt: '1 day ago',
      images: 6,
      description: 'Upgrading to Pro. 8GB RAM, 256GB SSD. Original box & charger included.',
      hasAR: false,
      escrowAvailable: true,
      aiScamScore: 8
    },
    {
      id: '3',
      title: 'Winter Coat - North Face',
      price: 280,
      category: 'Clothing',
      condition: 'Good',
      seller: {
        name: 'Maria K.',
        trustScore: 5.0,
        reviews: 8,
        verified: true
      },
      distance: '0.5 km',
      postedAt: '3 days ago',
      images: 3,
      description: 'Size M, warm for Warsaw winters. Worn one season.',
      hasAR: false,
      escrowAvailable: false,
      aiScamScore: 3
    },
    {
      id: '4',
      title: 'Dyson V11 Vacuum Cleaner',
      price: 890,
      category: 'Home',
      condition: 'Like New',
      seller: {
        name: 'Alex P.',
        trustScore: 4.8,
        reviews: 12,
        verified: true
      },
      distance: '2.1 km',
      postedAt: '5 hours ago',
      images: 5,
      description: 'Used 3 times, too powerful for small apartment. All attachments.',
      hasAR: true,
      escrowAvailable: true,
      featured: true,
      aiScamScore: 4
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: '🛍️', count: listings.length },
    { id: 'furniture', name: 'Furniture', icon: '🛋️', count: 45 },
    { id: 'electronics', name: 'Electronics', icon: '💻', count: 32 },
    { id: 'home', name: 'Home', icon: '🏠', count: 28 },
    { id: 'clothing', name: 'Clothing', icon: '👕', count: 19 },
  ];

  const handleARPreview = (listing: Listing) => {
    toast.info('🔮 AR Preview', {
      description: 'Opening camera to preview in your space...',
      duration: 2000,
    });
  };

  const handleInitiateTrade = (listing: Listing) => {
    if (listing.escrowAvailable) {
      toast.success('🔒 Secure Trade Initiated', {
        description: 'Payment held in escrow until you confirm receipt',
        duration: 3000,
      });
    } else {
      toast.info('💬 Message Seller', {
        description: 'Opening chat with ' + listing.seller.name,
        duration: 2000,
      });
    }

    if ('vibrate' in navigator) {
      navigator.vibrate([30, 50, 30]);
    }
  };

  const handleListItem = () => {
    setShowListModal(false);
    toast.success('✅ Item listed!', {
      description: '+10 points earned. Sell it for +50 more!',
      duration: 3000,
    });
  };

  const filteredListings = listings
    .filter(l => activeCategory === 'all' || l.category.toLowerCase() === activeCategory)
    .filter(l => l.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#0a0e1a] to-[#000000] text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 px-5 pt-8 pb-4 backdrop-blur-xl bg-gradient-to-b from-[#000000] to-transparent">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
              Warsaw Vault Market
              <Shield className="w-6 h-6 text-[#10b981]" strokeWidth={2} fill="currentColor" />
            </h1>
            <p className="text-sm text-white/50">Scam-proof expat marketplace</p>
          </div>
          <button
            onClick={() => setShowListModal(true)}
            className="p-2.5 rounded-full bg-gradient-to-b from-[#10b981] to-[#059669] shadow-[0_4px_16px_rgba(16,185,129,0.4)]"
          >
            <Plus className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <div className="relative rounded-[16px] p-[1px] bg-gradient-to-b from-white/25 to-white/10">
            <div className="relative rounded-[16px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl">
              <div className="flex items-center gap-3 px-4 py-3">
                <Search className="w-5 h-5 text-white/50" strokeWidth={2} />
                <input
                  type="text"
                  placeholder="Search furniture, electronics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-sm"
                />
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
                  ? 'bg-gradient-to-b from-[#10b981] to-[#059669] text-white shadow-[0_4px_16px_rgba(16,185,129,0.4)]'
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
        {/* Trust Banner */}
        <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-green-400/30 to-green-500/10">
          <div className="relative rounded-[20px] bg-gradient-to-br from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-green-400" strokeWidth={2} fill="currentColor" />
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1">AI Scam Shield Active</h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Every listing verified with escrow protection • 95% scam-free guarantee
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Listings */}
        {filteredListings.filter(l => l.featured).length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-amber-400" strokeWidth={2} />
              <h2 className="font-bold">Featured Deals</h2>
            </div>
          </div>
        )}

        {/* Listings */}
        <div className="space-y-3">
          {filteredListings.map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative overflow-hidden rounded-[24px] p-[1px] ${
                listing.featured
                  ? 'bg-gradient-to-b from-amber-400/40 to-amber-500/20'
                  : 'bg-gradient-to-b from-white/20 to-white/5'
              }`}
            >
              <div className="relative rounded-[24px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 backdrop-blur-xl p-4">
                {/* Glossy overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[24px] pointer-events-none" />
                
                {/* AI Scam Score Badge */}
                {listing.aiScamScore <= 10 && (
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-green-500/20 border border-green-400/30">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-green-400" strokeWidth={2} fill="currentColor" />
                      <span className="text-[9px] text-green-400 font-bold">VERIFIED SAFE</span>
                    </div>
                  </div>
                )}

                {listing.aiScamScore > 10 && listing.aiScamScore < 30 && (
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-amber-500/20 border border-amber-400/30">
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-400" strokeWidth={2} />
                      <span className="text-[9px] text-amber-400 font-bold">LOW RISK</span>
                    </div>
                  </div>
                )}

                <div className="relative">
                  {/* Image Placeholder & Title */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-20 h-20 rounded-[12px] bg-gradient-to-br from-[#3b9eff]/20 to-[#8b5cf6]/20 flex items-center justify-center">
                      <Package className="w-8 h-8 text-white/40" strokeWidth={1.5} />
                      <span className="absolute bottom-1 right-1 text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-white/80">
                        +{listing.images - 1}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-base mb-1">{listing.title}</h3>
                      
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="text-xl font-bold text-[#10b981]">{listing.price} PLN</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          listing.condition === 'New' || listing.condition === 'Like New'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {listing.condition}
                        </span>
                        
                        {listing.escrowAvailable && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold flex items-center gap-1">
                            <Shield className="w-2.5 h-2.5" strokeWidth={2} />
                            Escrow
                          </span>
                        )}
                      </div>

                      {/* Seller Info */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#3b9eff] to-[#8b5cf6] flex items-center justify-center text-xs font-bold">
                          {listing.seller.name[0]}
                        </div>
                        <span className="text-xs text-white/70">{listing.seller.name}</span>
                        {listing.seller.verified && (
                          <CheckCircle className="w-3 h-3 text-green-400" strokeWidth={2} fill="currentColor" />
                        )}
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 text-amber-400" strokeWidth={2} fill="currentColor" />
                          <span className="text-xs font-semibold text-amber-400">{listing.seller.trustScore}</span>
                          <span className="text-xs text-white/40">({listing.seller.reviews})</span>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-3 text-xs text-white/50">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" strokeWidth={2} />
                          <span>{listing.distance}</span>
                        </div>
                        <span>•</span>
                        <span>{listing.postedAt}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setExpandedListing(expandedListing === listing.id ? null : listing.id)}
                      className="p-1"
                    >
                      <motion.div
                        animate={{ rotate: expandedListing === listing.id ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="w-5 h-5 text-white/40" strokeWidth={2} />
                      </motion.div>
                    </button>
                  </div>

                  {/* Expanded View */}
                  <AnimatePresence>
                    {expandedListing === listing.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 mt-3 border-t border-white/10">
                          <p className="text-sm text-white/70 leading-relaxed mb-3">
                            {listing.description}
                          </p>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => handleInitiateTrade(listing)}
                              className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-b from-[#10b981] to-[#059669] font-semibold text-sm shadow-[0_4px_16px_rgba(16,185,129,0.4)]"
                            >
                              {listing.escrowAvailable ? (
                                <>
                                  <Shield className="w-4 h-4" strokeWidth={2} />
                                  Secure Buy
                                </>
                              ) : (
                                <>
                                  <MessageCircle className="w-4 h-4" strokeWidth={2} />
                                  Message
                                </>
                              )}
                            </button>

                            {listing.hasAR && (
                              <button
                                onClick={() => handleARPreview(listing)}
                                className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#8b5cf6]/20 hover:bg-[#8b5cf6]/30 font-semibold text-sm text-[#8b5cf6]"
                              >
                                <Eye className="w-4 h-4" strokeWidth={2} />
                                AR Preview
                              </button>
                            )}

                            <button className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 font-semibold text-sm">
                              <Heart className="w-4 h-4" strokeWidth={2} />
                              Save
                            </button>
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

        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/50 mb-2">No listings found</p>
            <p className="text-sm text-white/30">Try a different search</p>
          </div>
        )}
      </div>

      {/* List Item Modal */}
      <AnimatePresence>
        {showListModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-end justify-center"
            onClick={() => setShowListModal(false)}
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
                <h3 className="text-xl font-bold mb-4">List an Item</h3>
                
                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    placeholder="Item title"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-[#10b981]/50"
                  />
                  <input
                    type="number"
                    placeholder="Price (PLN)"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-[#10b981]/50"
                  />
                  <select className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-[#10b981]/50">
                    <option value="" className="bg-[#1a2642]">Select category</option>
                    <option value="furniture" className="bg-[#1a2642]">Furniture</option>
                    <option value="electronics" className="bg-[#1a2642]">Electronics</option>
                    <option value="home" className="bg-[#1a2642]">Home</option>
                    <option value="clothing" className="bg-[#1a2642]">Clothing</option>
                  </select>
                  <textarea
                    placeholder="Description"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-[#10b981]/50 resize-none"
                  />
                </div>

                <div className="p-3 rounded-lg bg-green-500/10 border border-green-400/20 mb-4">
                  <p className="text-xs text-green-400 leading-relaxed">
                    <span className="font-semibold">✓ AI auto-categorizes</span> • Escrow available • Earn +10 points for listing, +50 for sale
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleListItem}
                    className="flex-1 py-3 rounded-lg bg-gradient-to-b from-[#10b981] to-[#059669] font-semibold"
                  >
                    List Item
                  </button>
                  <button
                    onClick={() => setShowListModal(false)}
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
