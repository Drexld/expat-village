import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Bot,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Clover,
  Dna,
  GraduationCap,
  Languages,
  Route,
  Scale,
  Sparkles,
  WandSparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  forecastJourney,
  getDecisionAdvice,
  getDNAMatches,
  getLuckScore,
  getPolishCoachScenarios,
  getShadowSuggestions,
  getStudentInsights,
} from '../services/ai/expatVillageAI';
import type { UserProfile } from '../services/ai/types';

type HubTab =
  | 'predictive'
  | 'dna'
  | 'advisor'
  | 'coach'
  | 'luck'
  | 'shadow'
  | 'student';

const userProfile: UserProfile = {
  name: 'Alex',
  level: 'Newcomer',
  points: 340,
  streak: 7,
  completedTasks: 8,
  totalTasks: 24,
  district: 'Mokotow',
  interests: ['coffee', 'fitness', 'city walks'],
  university: 'University of Warsaw',
};

export function AIIntelligenceHub() {
  const [activeTab, setActiveTab] = useState<HubTab>('predictive');
  const [scenarioInput, setScenarioInput] = useState(
    'Should I sign this apartment contract now or negotiate first?',
  );

  const forecast = useMemo(() => forecastJourney(userProfile), []);
  const matches = useMemo(() => getDNAMatches(userProfile), []);
  const advice = useMemo(() => getDecisionAdvice(scenarioInput), [scenarioInput]);
  const coachScenarios = useMemo(() => getPolishCoachScenarios(), []);
  const luck = useMemo(() => getLuckScore(userProfile), []);
  const shadow = useMemo(() => getShadowSuggestions(userProfile), []);
  const student = useMemo(() => getStudentInsights(userProfile), []);

  const tabs: Array<{ id: HubTab; label: string; icon: any }> = [
    { id: 'predictive', label: 'Journey', icon: Route },
    { id: 'dna', label: 'DNA', icon: Dna },
    { id: 'advisor', label: 'Advisor', icon: Scale },
    { id: 'coach', label: 'Coach', icon: Languages },
    { id: 'luck', label: 'Luck', icon: Clover },
    { id: 'shadow', label: 'Shadow', icon: Bot },
    { id: 'student', label: 'Student', icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#0a0e1a] to-[#000000] text-white">
      <div className="px-5 pt-6 pb-24">
        <div className="relative rounded-[24px] p-[1px] bg-gradient-to-b from-[#3b9eff]/30 to-[#8b5cf6]/10 mb-4">
          <div className="relative rounded-[24px] bg-gradient-to-br from-[#1a2642]/90 to-[#0f172a]/95 p-5">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[24px] pointer-events-none" />
            <div className="relative flex items-start gap-3">
              <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#3b9eff] to-[#8b5cf6] flex items-center justify-center shadow-[0_4px_16px_rgba(59,158,255,0.4)]">
                <BrainCircuit className="w-6 h-6 text-white" strokeWidth={2.2} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold mb-1">AI Intelligence Hub</h2>
                <p className="text-xs text-white/60">
                  Predictive Journey, DNA Matching, Decision Advisor, Coach, Luck Score, Shadow Assistant, and Student AI.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative rounded-full px-3 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-gradient-to-b from-[#3b9eff] to-[#2d7dd2] text-white shadow-[0_4px_14px_rgba(59,158,255,0.4)]'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" strokeWidth={2} />
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {activeTab === 'predictive' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-white/20 to-white/5">
              <div className="relative rounded-[20px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 p-4">
                <p className="text-xs text-white/50 mb-1">Forecast</p>
                <h3 className="text-base font-bold mb-2">
                  Reach <span className="text-[#3b9eff]">{forecast.level}</span> in about{' '}
                  <span className="text-green-400">{forecast.etaDays} days</span>
                </h3>
                <p className="text-xs text-white/60 mb-3">Confidence: {forecast.confidence}%</p>
                <div className="space-y-2">
                  {forecast.nextActions.map((action) => (
                    <div key={action.title} className="p-2 rounded-[12px] bg-white/5 border border-white/10 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#3b9eff]" strokeWidth={2} />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{action.title}</p>
                        <p className="text-[11px] text-white/50">+{action.points} points • ETA {action.etaDays}d</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'dna' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {matches.map((match) => (
              <button
                key={match.id}
                onClick={() =>
                  toast.success(`Connection suggested with ${match.name}`, {
                    description: `${match.compatibility}% compatibility`,
                  })
                }
                className="w-full relative rounded-[20px] p-[1px] bg-gradient-to-b from-white/20 to-white/5 text-left"
              >
                <div className="relative rounded-[20px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#3b9eff] to-[#8b5cf6] flex items-center justify-center font-bold">
                      {match.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-bold">{match.name}</p>
                        <span className="px-2 py-0.5 rounded-full bg-[#3b9eff]/20 text-[#3b9eff] text-[10px] font-bold">
                          {match.compatibility}% match
                        </span>
                      </div>
                      <p className="text-xs text-white/50 mb-2">{match.district}</p>
                      <p className="text-xs text-white/70 mb-2">{match.reason}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {match.interests.map((interest) => (
                          <span key={interest} className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-white/70">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        )}

        {activeTab === 'advisor' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-white/20 to-white/5">
              <div className="relative rounded-[20px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 p-4">
                <p className="text-xs text-white/50 mb-2">Scenario</p>
                <textarea
                  rows={3}
                  value={scenarioInput}
                  onChange={(e) => setScenarioInput(e.target.value)}
                  className="w-full rounded-[12px] bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:border-[#3b9eff]/50 resize-none"
                />
                <button
                  onClick={() =>
                    toast.success('Scenario re-analyzed', {
                      description: 'Decision scores updated.',
                    })
                  }
                  className="mt-3 w-full py-2.5 rounded-[12px] bg-gradient-to-b from-[#3b9eff] to-[#2d7dd2] text-sm font-semibold shadow-[0_4px_16px_rgba(59,158,255,0.4)]"
                >
                  Analyze Decision
                </button>
              </div>
            </div>

            <div className="p-3 rounded-[14px] bg-[#10b981]/10 border border-green-400/20">
              <p className="text-xs text-green-400 font-semibold mb-1">Recommendation</p>
              <p className="text-sm text-white/80">{advice.recommendation}</p>
            </div>

            {advice.options.map((option) => (
              <div key={option.id} className="relative rounded-[16px] p-[1px] bg-gradient-to-b from-white/15 to-white/5">
                <div className="relative rounded-[16px] bg-gradient-to-b from-[#1a2642]/85 to-[#0f172a]/95 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold">{option.label}</p>
                    <span className="text-xs font-bold text-[#3b9eff]">{option.score}/100</span>
                  </div>
                  <p className="text-[11px] text-white/50 mb-2">
                    + {option.benefits.join(' • ')}
                  </p>
                  <p className="text-[11px] text-red-300/80">Risk: {option.risks.join(' • ')}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'coach' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {coachScenarios.map((scenario) => (
              <div key={scenario.id} className="relative rounded-[18px] p-[1px] bg-gradient-to-b from-white/20 to-white/5">
                <div className="relative rounded-[18px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 p-4">
                  <p className="text-[11px] text-[#3b9eff] font-semibold mb-1">{scenario.title}</p>
                  <p className="text-xs text-white/50 mb-2">{scenario.context}</p>
                  <p className="text-sm font-bold mb-1">{scenario.phrase}</p>
                  <p className="text-xs text-white/50 mb-1">{scenario.transliteration}</p>
                  <p className="text-xs text-green-300/90 mb-2">{scenario.english}</p>
                  <button
                    onClick={() =>
                      toast.info('Pronunciation mode', {
                        description: 'Voice feedback simulated for this phrase.',
                      })
                    }
                    className="inline-flex items-center gap-1.5 text-xs text-[#3b9eff] font-semibold"
                  >
                    Practice Phrase
                    <ChevronRight className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'luck' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-[#10b981]/30 to-[#059669]/10">
              <div className="relative rounded-[20px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold">Dynamic Luck Score</p>
                  <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold">
                    {luck.tier}
                  </span>
                </div>
                <p className="text-3xl font-bold text-green-400 mb-1">{luck.score}</p>
                <p className="text-xs text-white/60 mb-3">{luck.summary}</p>
                <div className="space-y-2">
                  {luck.signals.map((signal) => (
                    <div key={signal.id}>
                      <div className="flex items-center justify-between text-[11px] text-white/60 mb-1">
                        <span>{signal.label}</span>
                        <span>{signal.value}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${signal.value}%` }}
                          className="h-full bg-gradient-to-r from-[#3b9eff] to-[#10b981]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'shadow' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {shadow.map((item) => (
              <div key={item.id} className="relative rounded-[16px] p-[1px] bg-gradient-to-b from-white/15 to-white/5">
                <div className="relative rounded-[16px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 p-3">
                  <div className="flex items-start gap-2">
                    <WandSparkles className="w-4 h-4 text-[#8b5cf6] mt-0.5" strokeWidth={2} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-xs text-white/60 mb-2">{item.detail}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3b9eff]/20 text-[#3b9eff] font-semibold">
                          +{item.points} points
                        </span>
                        <button
                          onClick={() =>
                            toast.success('Shadow action queued', {
                              description: item.automationReady ? 'Auto flow started.' : 'Added to next-step queue.',
                            })
                          }
                          className="text-xs text-white/70 hover:text-white"
                        >
                          {item.automationReady ? 'Run automation' : 'Add to plan'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'student' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {student.map((item) => (
              <div key={item.id} className="relative rounded-[16px] p-[1px] bg-gradient-to-b from-white/20 to-white/5">
                <div className="relative rounded-[16px] bg-gradient-to-b from-[#1a2642]/90 to-[#0f172a]/95 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold">{item.title}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8b5cf6]/20 text-[#8b5cf6] font-semibold">
                      {item.confidence}% conf
                    </span>
                  </div>
                  <p className="text-base font-bold text-[#3b9eff] mb-1">{item.value}</p>
                  <p className="text-xs text-white/60">{item.description}</p>
                </div>
              </div>
            ))}
            <button
              onClick={() =>
                toast.success('Student AI bundle ready', {
                  description: 'Academic, roommate, and budget plan updated.',
                })
              }
              className="w-full py-3 rounded-[14px] bg-gradient-to-b from-[#8b5cf6] to-[#7c3aed] text-sm font-semibold shadow-[0_4px_16px_rgba(139,92,246,0.4)]"
            >
              Activate Student AI Bundle
            </button>
          </motion.div>
        )}

        <div className="mt-4 p-3 rounded-[14px] bg-white/5 border border-white/10">
          <p className="text-[11px] text-white/50">
            <Sparkles className="w-3.5 h-3.5 inline mr-1 text-[#3b9eff]" />
            This module follows the complete AI build pattern with production-ready service boundaries for backend wiring.
          </p>
        </div>
      </div>
    </div>
  );
}

