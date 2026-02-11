import { Building2, Heart, Home, Briefcase, ChevronRight } from 'lucide-react';

export function FeaturedGuides() {
  const guides = [
    {
      icon: Building2,
      title: 'Get Things Done',
      description: 'PESEL, NIP, Banking & More',
      color: 'from-[#3b82f6] to-[#2563eb]',
      tasks: 8
    },
    {
      icon: Heart,
      title: 'Insurance & Health',
      description: 'NFZ, Doctors, Dental Care',
      color: 'from-[#ec4899] to-[#db2777]',
      tasks: 5
    },
    {
      icon: Home,
      title: 'Housing',
      description: 'Find apartments, avoid scams',
      color: 'from-[#f59e0b] to-[#d97706]',
      tasks: 6
    },
    {
      icon: Briefcase,
      title: 'Jobs & Careers',
      description: 'Job search, CV tips, networking',
      color: 'from-[#10b981] to-[#059669]',
      tasks: 4
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[17px] font-semibold">Essential Guides</h2>
        <button className="text-[13px] text-[#3b9eff] hover:text-[#5fb3ff] font-semibold">See all</button>
      </div>
      
      <div className="space-y-3">
        {guides.map((guide, index) => {
          const Icon = guide.icon;
          return (
            <button
              key={index}
              className="w-full relative overflow-hidden rounded-[24px] bg-gradient-to-b from-[#1a2642] via-[#14203a] to-[#0f1829] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.3)] p-4 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_32px_rgba(59,158,255,0.15)] transition-all active:scale-[0.98] group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-[16px] bg-gradient-to-br ${guide.color} flex items-center justify-center flex-shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.3)]`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-[15px] mb-1">{guide.title}</h3>
                  <p className="text-[13px] text-white/50">{guide.description}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-[13px] text-white/40">{guide.tasks}</span>
                  <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-[#3b9eff] transition-colors" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
