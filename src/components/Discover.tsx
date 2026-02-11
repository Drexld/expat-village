import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Brain,
  ShoppingBag,
  Building2,
  BookOpen,
  GraduationCap,
  Music,
  BrainCircuit,
  UtensilsCrossed,
} from 'lucide-react';
import { AITools } from './AITools';
import { Marketplace } from './Marketplace';
import { PremiumDirectory } from './PremiumDirectory';
import { EnhancedGuides } from './EnhancedGuides';
import { StudentHubs } from './StudentHubs';
import { VillageVibes } from './VillageVibes';
import { AIIntelligenceHub } from './AIIntelligenceHub';
import { FlavorDays } from './FlavorDays';

export function Discover() {
  const [activeSection, setActiveSection] = useState<
    | 'aihub'
    | 'flavordays'
    | 'aitools'
    | 'guides'
    | 'students'
    | 'vibes'
    | 'directory'
    | 'marketplace'
  >('aihub');

  const sections = [
    { id: 'aihub' as const, icon: BrainCircuit, label: 'AI Hub', color: 'from-[#3b9eff] to-[#8b5cf6]', badge: 'Core' },
    {
      id: 'flavordays' as const,
      icon: UtensilsCrossed,
      label: 'Flavor Days',
      color: 'from-[#10b981] to-[#059669]',
      badge: 'Daily',
    },
    { id: 'aitools' as const, icon: Brain, label: 'AI Tools', color: 'from-[#8b5cf6] to-[#7c3aed]', badge: 'New' },
    { id: 'marketplace' as const, icon: ShoppingBag, label: 'Market', color: 'from-[#10b981] to-[#059669]', badge: 'Safe' },
    { id: 'directory' as const, icon: Building2, label: 'Directory', color: 'from-[#f59e0b] to-[#d97706]', badge: '156' },
    { id: 'guides' as const, icon: BookOpen, label: 'Guides', color: 'from-[#3b9eff] to-[#2d7dd2]', badge: '24' },
    { id: 'students' as const, icon: GraduationCap, label: 'Students', color: 'from-[#06b6d4] to-[#0891b2]', badge: '847' },
    { id: 'vibes' as const, icon: Music, label: 'Vibes', color: 'from-[#ec4899] to-[#db2777]', badge: 'Live' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'aihub':
        return <AIIntelligenceHub />;
      case 'flavordays':
        return <FlavorDays />;
      case 'aitools':
        return <AITools />;
      case 'marketplace':
        return <Marketplace />;
      case 'directory':
        return <PremiumDirectory />;
      case 'guides':
        return <EnhancedGuides />;
      case 'students':
        return <StudentHubs />;
      case 'vibes':
        return <VillageVibes />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#0a0e1a] to-[#000000] text-white">
      {/* Sticky Header with Tabs */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-gradient-to-b from-[#000000] to-transparent px-5 pt-8 pb-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-1">Discover</h1>
          <p className="text-sm text-white/50">Explore Warsaw & connect</p>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className="relative flex-shrink-0"
              >
                <div className={`relative rounded-[16px] p-[1px] transition-all ${
                  isActive
                    ? 'bg-gradient-to-b ' + section.color
                    : 'bg-gradient-to-b from-white/10 to-white/5'
                }`}>
                  <div className={`relative rounded-[16px] px-4 py-3 transition-all ${
                    isActive
                      ? `bg-gradient-to-b ${section.color} shadow-[0_4px_20px_rgba(0,0,0,0.3)]`
                      : 'bg-gradient-to-b from-[#1a2642]/70 to-[#0f172a]/90 hover:from-[#1a2642]/90 hover:to-[#0f172a]/95'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white/50'}`} strokeWidth={2} />
                      <p className={`text-xs font-semibold whitespace-nowrap ${isActive ? 'text-white' : 'text-white/50'}`}>
                        {section.label}
                      </p>
                    </div>
                    
                    {section.badge && (
                      <div className={`absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                        section.badge === 'Live'
                          ? 'bg-red-500 text-white animate-pulse'
                          : section.badge === 'New'
                          ? 'bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white'
                          : 'bg-white/20 text-white/90'
                      }`}>
                        {section.badge}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        {renderContent()}
      </motion.div>
    </div>
  );
}
