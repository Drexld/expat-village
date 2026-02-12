import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, CheckCircle2, Loader2, Sparkles, Trophy, UserRound, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  generateFinalBanter,
  generateOnboardingContent,
  type OnboardingContent,
  type QuizQuestion,
} from '../services/onboarding/groqOnboarding';

type Step =
  | 'welcome'
  | 'name'
  | 'tribe'
  | 'interest'
  | 'generating'
  | 'banter'
  | 'quiz'
  | 'result'
  | 'badge';

interface OnboardingPayload {
  name: string;
  tribe: string;
  interest: string;
  badge: string;
  score: number;
  total: number;
}

interface PersonalityOnboardingProps {
  onComplete: (payload: OnboardingPayload) => void;
}

const tribes = [
  { id: 'football', label: 'Football', emoji: '⚽' },
  { id: 'nba', label: 'NBA', emoji: '🏀' },
  { id: 'marvel', label: 'Marvel', emoji: '🦸' },
  { id: 'dc', label: 'DC', emoji: '🦇' },
  { id: 'anime', label: 'Anime', emoji: '🎌' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'f1', label: 'F1', emoji: '🏎️' },
  { id: 'music', label: 'Music', emoji: '🎵' },
];

export function PersonalityOnboarding({ onComplete }: PersonalityOnboardingProps) {
  const [step, setStep] = useState<Step>('welcome');
  const [userName, setUserName] = useState('');
  const [selectedTribe, setSelectedTribe] = useState<(typeof tribes)[number] | null>(null);
  const [interest, setInterest] = useState('');
  const [content, setContent] = useState<OnboardingContent | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [finalBanter, setFinalBanter] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const quiz: QuizQuestion[] = content?.quiz ?? [];
  const totalQuestions = quiz.length;
  const score = useMemo(
    () =>
      quiz.reduce((count, question, idx) => (answers[idx] === question.correctIndex ? count + 1 : count), 0),
    [answers, quiz],
  );
  const progress = totalQuestions ? ((questionIndex + (step === 'quiz' ? 1 : 0)) / totalQuestions) * 100 : 0;

  const goToQuiz = async () => {
    if (!userName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!selectedTribe) {
      toast.error('Please pick a tribe');
      return;
    }
    if (!interest.trim()) {
      toast.error('Please enter an interest');
      return;
    }

    setStep('generating');
    const generated = await generateOnboardingContent({
      userName: userName.trim(),
      tribe: selectedTribe.label,
      interest: interest.trim(),
    });
    setContent(generated);
    setStep('banter');
  };

  const chooseAnswer = async (optionIndex: number) => {
    if (step !== 'quiz' || showAnswerFeedback) return;

    const currentQuestion = quiz[questionIndex];
    if (!currentQuestion) return;

    setSelectedOption(optionIndex);
    setShowAnswerFeedback(true);

    const nextAnswers = [...answers];
    nextAnswers[questionIndex] = optionIndex;
    setAnswers(nextAnswers);

    if (questionIndex < totalQuestions - 1) {
      setTimeout(() => {
        setQuestionIndex((prev) => prev + 1);
        setSelectedOption(null);
        setShowAnswerFeedback(false);
      }, 700);
      return;
    }

    setTimeout(async () => {
      setStep('generating');
      const banter = await generateFinalBanter({
        userName: userName.trim(),
        tribe: selectedTribe?.label || 'Tribe',
        interest: interest.trim(),
        score: nextAnswers.reduce(
          (count, answer, idx) => (answer === quiz[idx]?.correctIndex ? count + 1 : count),
          0,
        ),
        total: totalQuestions,
      });
      setFinalBanter(banter);
      setSelectedOption(null);
      setShowAnswerFeedback(false);
      setStep('result');
    }, 700);
  };

  const finish = async () => {
    if (!content) return;
    setSubmitting(true);
    onComplete({
      name: userName.trim(),
      tribe: selectedTribe?.label || 'Tribe',
      interest: interest.trim(),
      badge: content.badgeName,
      score,
      total: totalQuestions,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#0a0e1a] to-[#000000] text-white px-5 py-6">
      <div className="max-w-md mx-auto">
        <div className="relative rounded-[24px] p-[1px] bg-gradient-to-b from-white/20 to-white/5">
          <div className="relative rounded-[24px] bg-gradient-to-b from-[#1a2642]/95 to-[#0f172a]/98 p-5 backdrop-blur-xl min-h-[72vh]">
            <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
            <div className="relative">
              <AnimatePresence mode="wait">
                {step === 'welcome' && (
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    className="text-center pt-12"
                  >
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#3b9eff] to-[#8b5cf6] flex items-center justify-center mb-5 shadow-[0_8px_24px_rgba(59,158,255,0.35)]">
                      <Sparkles className="w-10 h-10 text-white" strokeWidth={2} />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Welcome to Expat Village</h1>
                    <p className="text-sm text-white/65 mb-8">Let's build your tribe identity in under 3 minutes.</p>
                    <button
                      onClick={() => setStep('name')}
                      className="w-full py-3 rounded-[14px] bg-gradient-to-b from-[#3b9eff] to-[#2d7dd2] font-semibold shadow-[0_4px_16px_rgba(59,158,255,0.4)]"
                    >
                      Start Onboarding
                    </button>
                  </motion.div>
                )}

                {step === 'name' && (
                  <motion.div key="name" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
                    <h2 className="text-xl font-bold mb-2">What should we call you?</h2>
                    <p className="text-sm text-white/60 mb-5">This name appears in your badge reveal.</p>
                    <div className="relative mb-5">
                      <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" strokeWidth={2} />
                      <input
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="e.g. Alex"
                        className="w-full pl-11 pr-3 py-3 rounded-[12px] bg-white/5 border border-white/10 outline-none focus:border-[#3b9eff]/50"
                      />
                    </div>
                    <button
                      onClick={() => setStep('tribe')}
                      className="w-full py-3 rounded-[14px] bg-gradient-to-b from-[#3b9eff] to-[#2d7dd2] font-semibold"
                    >
                      Continue
                    </button>
                  </motion.div>
                )}

                {step === 'tribe' && (
                  <motion.div key="tribe" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
                    <h2 className="text-xl font-bold mb-2">Pick your tribe</h2>
                    <p className="text-sm text-white/60 mb-4">Choose what best represents your energy.</p>
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      {tribes.map((tribe) => (
                        <button
                          key={tribe.id}
                          onClick={() => setSelectedTribe(tribe)}
                          className={`p-3 rounded-[14px] text-left border transition-all ${
                            selectedTribe?.id === tribe.id
                              ? 'bg-[#3b9eff]/20 border-[#3b9eff]/40'
                              : 'bg-white/5 border-white/10'
                          }`}
                        >
                          <p className="text-xl mb-1">{tribe.emoji}</p>
                          <p className="text-sm font-semibold">{tribe.label}</p>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setStep('interest')}
                      className="w-full py-3 rounded-[14px] bg-gradient-to-b from-[#8b5cf6] to-[#7c3aed] font-semibold"
                    >
                      Continue
                    </button>
                  </motion.div>
                )}

                {step === 'interest' && (
                  <motion.div key="interest" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
                    <h2 className="text-xl font-bold mb-2">What exactly are you into?</h2>
                    <p className="text-sm text-white/60 mb-5">Type any interest. AI will make your quiz from it.</p>
                    <textarea
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      rows={4}
                      placeholder={`e.g. ${selectedTribe?.label === 'Football' ? 'Manchester United' : 'Taylor Swift'}`}
                      className="w-full px-3 py-3 rounded-[12px] bg-white/5 border border-white/10 outline-none focus:border-[#3b9eff]/50 resize-none mb-5"
                    />
                    <button
                      onClick={goToQuiz}
                      className="w-full py-3 rounded-[14px] bg-gradient-to-b from-[#3b9eff] to-[#2d7dd2] font-semibold"
                    >
                      Generate My AI Quiz
                    </button>
                  </motion.div>
                )}

                {step === 'generating' && (
                  <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-20">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                      className="w-16 h-16 mx-auto rounded-full bg-[#3b9eff]/20 flex items-center justify-center mb-4"
                    >
                      <Brain className="w-8 h-8 text-[#3b9eff]" strokeWidth={2} />
                    </motion.div>
                    <p className="text-base font-semibold mb-1">AI is preparing your moment...</p>
                    <p className="text-sm text-white/60">Generating banter, quiz and badge.</p>
                  </motion.div>
                )}

                {step === 'banter' && content && (
                  <motion.div key="banter" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
                    <h2 className="text-xl font-bold mb-3">First words from your tribe</h2>
                    <div className="p-4 rounded-[14px] bg-[#8b5cf6]/12 border border-[#8b5cf6]/25 mb-5">
                      <p className="text-sm leading-relaxed">{content.initialBanter}</p>
                    </div>
                    <button
                      onClick={() => {
                        setStep('quiz');
                        setQuestionIndex(0);
                        setAnswers([]);
                        setSelectedOption(null);
                        setShowAnswerFeedback(false);
                      }}
                      className="w-full py-3 rounded-[14px] bg-gradient-to-b from-[#8b5cf6] to-[#7c3aed] font-semibold"
                    >
                      Start Quiz (5 Questions)
                    </button>
                  </motion.div>
                )}

                {step === 'quiz' && quiz[questionIndex] && (
                  <motion.div key={`quiz-${questionIndex}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-white/60 mb-2">
                        <span>Question {questionIndex + 1} / {totalQuestions}</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className="h-full bg-gradient-to-r from-[#3b9eff] to-[#8b5cf6]"
                        />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-4">{quiz[questionIndex].question}</h3>
                    <div className="space-y-2.5">
                      {quiz[questionIndex].options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => chooseAnswer(idx)}
                          disabled={showAnswerFeedback}
                          className={`w-full p-3 rounded-[12px] text-left border transition-all ${
                            showAnswerFeedback && idx === quiz[questionIndex].correctIndex
                              ? 'bg-green-500/15 border-green-400/45'
                              : showAnswerFeedback && selectedOption === idx && idx !== quiz[questionIndex].correctIndex
                                ? 'bg-red-500/15 border-red-400/45'
                                : 'bg-white/5 border-white/10 hover:border-[#3b9eff]/40 hover:bg-[#3b9eff]/10'
                          }`}
                        >
                          <span className="text-sm inline-flex items-center gap-2">
                            {showAnswerFeedback && idx === quiz[questionIndex].correctIndex && (
                              <CheckCircle2 className="w-4 h-4 text-green-400" strokeWidth={2.3} />
                            )}
                            {showAnswerFeedback && selectedOption === idx && idx !== quiz[questionIndex].correctIndex && (
                              <XCircle className="w-4 h-4 text-red-400" strokeWidth={2.3} />
                            )}
                            {option}
                          </span>
                        </button>
                      ))}
                    </div>
                    {showAnswerFeedback && selectedOption !== null && (
                      <p className={`text-xs mt-3 ${selectedOption === quiz[questionIndex].correctIndex ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedOption === quiz[questionIndex].correctIndex
                          ? 'Correct. Moving to the next one...'
                          : 'Not quite. Correct answer is highlighted.'}
                      </p>
                    )}
                  </motion.div>
                )}

                {step === 'result' && (
                  <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
                    <h2 className="text-xl font-bold mb-2">Quiz Complete</h2>
                    <div className="mb-4 p-4 rounded-[14px] bg-[#10b981]/10 border border-green-400/20">
                      <p className="text-2xl font-bold text-green-400 mb-1">{score}/{totalQuestions}</p>
                      <p className="text-sm text-white/70">
                        {score === totalQuestions ? 'Perfect run.' : score >= 3 ? 'Strong performance.' : 'Good start, keep building.'}
                      </p>
                    </div>
                    <div className="p-4 rounded-[14px] bg-[#3b9eff]/10 border border-[#3b9eff]/20 mb-5">
                      <p className="text-sm leading-relaxed">{finalBanter}</p>
                    </div>
                    <button
                      onClick={() => setStep('badge')}
                      className="w-full py-3 rounded-[14px] bg-gradient-to-b from-[#3b9eff] to-[#2d7dd2] font-semibold"
                    >
                      Reveal Badge
                    </button>
                  </motion.div>
                )}

                {step === 'badge' && content && (
                  <motion.div key="badge" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0.5, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 240, damping: 16 }}
                      className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#f59e0b] to-[#8b5cf6] flex items-center justify-center mb-5 shadow-[0_10px_30px_rgba(245,158,11,0.4)]"
                    >
                      <Trophy className="w-12 h-12 text-white" strokeWidth={2.2} />
                    </motion.div>
                    <p className="text-sm text-white/60 mb-1">Your tribe badge</p>
                    <h2 className="text-2xl font-bold mb-2">{content.badgeName}</h2>
                    <p className="text-sm text-white/70 mb-6">
                      {selectedTribe?.emoji} {selectedTribe?.label} • {interest}
                    </p>
                    <button
                      disabled={submitting}
                      onClick={finish}
                      className="w-full py-3 rounded-[14px] bg-gradient-to-b from-[#10b981] to-[#059669] font-semibold shadow-[0_4px_16px_rgba(16,185,129,0.4)] disabled:opacity-70"
                    >
                      <span className="inline-flex items-center gap-2">
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} /> : <CheckCircle2 className="w-4 h-4" strokeWidth={2} />}
                        Enter Village
                      </span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
