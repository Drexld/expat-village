import { useState } from 'react';
import { Building2, Stethoscope, Briefcase, GraduationCap, Truck, Scale, Search, Star, MapPin, Phone, Globe, ChevronRight } from 'lucide-react';

const categories = [
  { id: 'banks', icon: Building2, title: 'Banks', count: 12, color: 'from-[#3b82f6] to-[#2563eb]' },
  { id: 'doctors', icon: Stethoscope, title: 'Doctors & Dentists', count: 28, color: 'from-[#ec4899] to-[#db2777]' },
  { id: 'accountants', icon: Briefcase, title: 'Accountants', count: 15, color: 'from-[#f59e0b] to-[#d97706]' },
  { id: 'lawyers', icon: Scale, title: 'Immigration Lawyers', count: 9, color: 'from-[#8b5cf6] to-[#7c3aed]' },
  { id: 'schools', icon: GraduationCap, title: 'Language Schools', count: 18, color: 'from-[#10b981] to-[#059669]' },
  { id: 'movers', icon: Truck, title: 'Moving Companies', count: 7, color: 'from-[#06b6d4] to-[#0891b2]' }
];

const sampleListings = [
  {
    id: 1,
    category: 'banks',
    name: 'PKO Bank Polski',
    type: 'Bank accepting expats',
    rating: 4.2,
    reviews: 156,
    verified: true,
    languages: ['English', 'Polish'],
    location: 'Multiple branches',
    phone: '+48 800 302 302',
    website: 'www.pkobp.pl'
  },
  {
    id: 2,
    category: 'doctors',
    name: 'Dr. Anna Kowalska',
    type: 'General Practitioner',
    rating: 4.8,
    reviews: 89,
    verified: true,
    languages: ['English', 'Polish', 'German'],
    location: 'Mokotów, Warsaw',
    phone: '+48 22 123 4567',
    website: 'www.example.com'
  },
  {
    id: 3,
    category: 'accountants',
    name: 'Expat Tax Solutions',
    type: 'Accounting & Tax Services',
    rating: 4.9,
    reviews: 124,
    verified: true,
    languages: ['English', 'Polish'],
    location: 'Śródmieście, Warsaw',
    phone: '+48 22 987 6543',
    website: 'www.example.com'
  }
];

export function Directory() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCat = categories.find(c => c.id === selectedCategory);

  if (selectedCategory) {
    return (
      <div className="min-h-screen">
        {/* Header */}
        <div className="relative px-5 pt-12 pb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className="mb-4 text-[#3b9eff] hover:text-[#5fb3ff] text-[13px] font-semibold"
          >
            ← Back to Directory
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            {selectedCat && (
              <>
                <div className={`w-14 h-14 rounded-[20px] bg-gradient-to-br ${selectedCat.color} flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.3)]`}>
                  <selectedCat.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-[20px] font-bold">{selectedCat.title}</h1>
                  <p className="text-[13px] text-white/50">{selectedCat.count} listings</p>
                </div>
              </>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-[20px] bg-gradient-to-b from-[#1a2642] to-[#0f1829] shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)] text-white placeholder:text-white/30 focus:outline-none focus:shadow-[inset_0_2px_8px_rgba(0,0,0,0.3),0_0_24px_rgba(59,158,255,0.2)] transition-all"
            />
          </div>
        </div>

        {/* Listings */}
        <div className="px-5 space-y-4 pb-8">
          {sampleListings
            .filter(l => l.category === selectedCategory)
            .map((listing) => (
              <div
                key={listing.id}
                className="rounded-[24px] bg-gradient-to-b from-[#1a2642] via-[#14203a] to-[#0f1829] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.3)] p-5"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[15px]">{listing.name}</h3>
                      {listing.verified && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-semibold shadow-[0_2px_8px_rgba(16,185,129,0.3)]">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] text-white/50 mb-2">{listing.type}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-[#fbbf24] fill-[#fbbf24]" />
                        <span className="text-[13px] font-semibold">{listing.rating}</span>
                      </div>
                      <span className="text-[12px] text-white/40">({listing.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-[13px] text-white/60">
                    <MapPin className="w-4 h-4 text-white/30" />
                    {listing.location}
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-white/60">
                    <Phone className="w-4 h-4 text-white/30" />
                    {listing.phone}
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-white/60">
                    <Globe className="w-4 h-4 text-white/30" />
                    {listing.website}
                  </div>
                </div>

                {/* Languages */}
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  {listing.languages.map((lang, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white/5 text-[12px] text-white/60"
                    >
                      {lang}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 py-2.5 rounded-[14px] bg-gradient-to-b from-[#3b9eff] to-[#0066cc] text-white font-semibold text-[13px] shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_12px_rgba(59,158,255,0.4)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_6px_20px_rgba(59,158,255,0.5)] transition-all active:scale-[0.98]">
                    View Details
                  </button>
                  <button className="py-2.5 px-4 rounded-[14px] bg-gradient-to-b from-[#1e293b] to-[#0f172a] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_8px_rgba(0,0,0,0.2)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_12px_rgba(0,0,0,0.3)] transition-all active:scale-[0.98]">
                    <Star className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative px-5 pt-12 pb-6">
        <div className="relative">
          <h1 className="text-[20px] font-bold mb-2">Directory</h1>
          <p className="text-[13px] text-white/50 mb-6">Expat-friendly services & businesses</p>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-[20px] bg-gradient-to-b from-[#1a2642] to-[#0f1829] shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)] text-white placeholder:text-white/30 focus:outline-none focus:shadow-[inset_0_2px_8px_rgba(0,0,0,0.3),0_0_24px_rgba(59,158,255,0.2)] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-5 space-y-3 pb-8">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className="w-full relative overflow-hidden rounded-[24px] bg-gradient-to-b from-[#1a2642] via-[#14203a] to-[#0f1829] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_32px_rgba(59,158,255,0.15)] transition-all active:scale-[0.98] group"
            >
              <div className="p-5 flex items-center gap-4">
                <div className={`w-14 h-14 rounded-[16px] bg-gradient-to-br ${category.color} flex items-center justify-center flex-shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.3)]`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-[17px] mb-1">{category.title}</h3>
                  <p className="text-[13px] text-white/50">{category.count} verified listings</p>
                </div>
                
                <ChevronRight className="w-6 h-6 text-white/30 group-hover:text-[#3b9eff] transition-colors flex-shrink-0" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
