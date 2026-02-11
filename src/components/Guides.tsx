import { useState } from 'react';
import { Building2, Heart, Home, Briefcase, MapPin, Utensils, ChevronRight, Search } from 'lucide-react';

const guideCategories = [
  {
    id: 'get-things-done',
    icon: Building2,
    title: 'Get Things Done',
    description: 'Banking, PESEL, Residency, Tax',
    color: 'from-[#3b82f6] to-[#2563eb]',
    topics: [
      { title: 'Banking Guide', subtitle: 'Requirements, which banks accept expats' },
      { title: 'PESEL Registration', subtitle: 'Process, timeline, documents' },
      { title: 'Residency Permits', subtitle: 'Application process & requirements' },
      { title: 'Address Registration', subtitle: 'Zameldowanie explained' },
      { title: 'Tax Number (NIP)', subtitle: 'How to get your NIP' }
    ]
  },
  {
    id: 'insurance-health',
    icon: Heart,
    title: 'Insurance & Health',
    description: 'NFZ, Doctors, Dental, Mental Health',
    color: 'from-[#ec4899] to-[#db2777]',
    topics: [
      { title: 'NFZ Explained', subtitle: 'Polish public healthcare in plain English' },
      { title: 'Private Insurance', subtitle: 'Options comparison' },
      { title: 'English-speaking Doctors', subtitle: 'Database of doctors' },
      { title: 'Dental Care', subtitle: 'Recommendations & tips' },
      { title: 'Mental Health Resources', subtitle: 'Support options' }
    ]
  },
  {
    id: 'housing',
    icon: Home,
    title: 'Housing',
    description: 'Apartments, Contracts, Neighborhoods',
    color: 'from-[#f59e0b] to-[#d97706]',
    topics: [
      { title: 'Apartment Search Guide', subtitle: 'Where and how to look' },
      { title: 'Red Flags in Contracts', subtitle: 'What to watch out for' },
      { title: 'English-speaking Agents', subtitle: 'Directory of agents' },
      { title: 'Neighborhood Guides', subtitle: 'Where to live in Warsaw' },
      { title: 'Scam Warnings', subtitle: 'Avoid deposit & listing scams' }
    ]
  },
  {
    id: 'jobs-careers',
    icon: Briefcase,
    title: 'Jobs & Careers',
    description: 'Job Search, CV, Networking',
    color: 'from-[#10b981] to-[#059669]',
    topics: [
      { title: 'Job Search Resources', subtitle: 'Where to find jobs' },
      { title: 'CV Guidance', subtitle: 'Polish market expectations' },
      { title: 'Salary Expectations', subtitle: 'By industry' },
      { title: 'Networking Tips', subtitle: 'Building connections' },
      { title: 'Work Permit Info', subtitle: 'Requirements & process' }
    ]
  },
  {
    id: 'live-your-life',
    icon: Utensils,
    title: 'Live Your Life',
    description: 'Food, Fitness, Entertainment',
    color: 'from-[#8b5cf6] to-[#7c3aed]',
    topics: [
      { title: 'Restaurants & Cafes', subtitle: 'English-friendly spots' },
      { title: 'Gyms & Fitness', subtitle: 'Best options' },
      { title: 'Salons & Beauty', subtitle: 'Recommended services' },
      { title: 'Entertainment Venues', subtitle: 'Things to do' },
      { title: 'Events Calendar', subtitle: 'Expat-friendly activities' }
    ]
  },
  {
    id: 'getting-around',
    icon: MapPin,
    title: 'Getting Around',
    description: 'Transport, Trains, Apps',
    color: 'from-[#06b6d4] to-[#0891b2]',
    topics: [
      { title: 'Public Transport Guide', subtitle: 'Warsaw transit explained' },
      { title: 'How to Buy Tickets', subtitle: 'Step by step' },
      { title: 'Train Travel', subtitle: 'Domestic & international' },
      { title: 'Driving in Poland', subtitle: 'Rules & requirements' },
      { title: 'Essential Apps', subtitle: 'Jakdojade, Bolt, etc.' }
    ]
  }
];

export function Guides() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedGuide = guideCategories.find(c => c.id === selectedCategory);

  if (selectedGuide) {
    return (
      <div className="min-h-screen">
        {/* Header */}
        <div className="relative px-5 pt-12 pb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className="mb-4 text-[#3b9eff] hover:text-[#5fb3ff] text-[13px] font-semibold"
          >
            ← Back to Guides
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-14 h-14 rounded-[20px] bg-gradient-to-br ${selectedGuide.color} flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.3)]`}>
              <selectedGuide.icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-[20px] font-bold">{selectedGuide.title}</h1>
              <p className="text-[13px] text-white/50">{selectedGuide.description}</p>
            </div>
          </div>
        </div>

        {/* Topics */}
        <div className="px-5 space-y-3 pb-8">
          {selectedGuide.topics.map((topic, index) => (
            <button
              key={index}
              className="w-full text-left p-5 rounded-[24px] bg-gradient-to-b from-[#1a2642] via-[#14203a] to-[#0f1829] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_32px_rgba(59,158,255,0.15)] transition-all active:scale-[0.98] group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-[15px] mb-1">{topic.title}</h3>
                  <p className="text-[13px] text-white/50">{topic.subtitle}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-[#3b9eff] transition-colors" />
              </div>
            </button>
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
          <h1 className="text-[20px] font-bold mb-2">Essential Guides</h1>
          <p className="text-[13px] text-white/50 mb-6">Everything you need to know</p>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-[20px] bg-gradient-to-b from-[#1a2642] to-[#0f1829] shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)] text-white placeholder:text-white/30 focus:outline-none focus:shadow-[inset_0_2px_8px_rgba(0,0,0,0.3),0_0_24px_rgba(59,158,255,0.2)] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-5 space-y-4 pb-8">
        {guideCategories.map((category) => {
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
                  <p className="text-[13px] text-white/50">{category.description}</p>
                  <p className="text-[12px] text-white/30 mt-1">{category.topics.length} topics</p>
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
