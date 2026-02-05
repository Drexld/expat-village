// src/pages/PersonalityOnboarding.jsx
// FULLY AI-DRIVEN - User types their interest, AI generates banter & quiz
// Connected to signup flow - user arrives here after creating account

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { generateInitialBanter, generateQuiz, generateFinalBanter } from '../lib/groq'
import Icon from '../components/Icon'

function PersonalityOnboarding() {
  const navigate = useNavigate()
  const { user, profile, isAuthenticated } = useAuth()
  const [step, setStep] = useState('welcome')
  const [selectedTribe, setSelectedTribe] = useState(null)
  const [userInput, setUserInput] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [score, setScore] = useState(0)
  const [username, setUsername] = useState('')

  useEffect(() => {
    const existingTribe = localStorage.getItem('expat-village-tribe')
    if (existingTribe) {
      navigate('/')
      return
    }

    const pendingName = localStorage.getItem('expat-village-pending-name')
    const displayName = pendingName
      || profile?.display_name
      || user?.user_metadata?.display_name
      || user?.email?.split('@')[0]
      || ''

    if (displayName) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUsername(displayName)
      localStorage.removeItem('expat-village-pending-name')
    }
  }, [profile, user, navigate])

  const [initialBanter, setInitialBanter] = useState(null)
  const [quizQuestions, setQuizQuestions] = useState([])
  const [finalBanter, setFinalBanter] = useState(null)

  const tribes = [
    { id: 'football', icon: 'trophy', name: 'Football', desc: 'The beautiful game', placeholder: 'e.g. Manchester United, Barcelona, AC Milan...' },
    { id: 'nba', icon: 'trophy', name: 'NBA', desc: 'Ball is life', placeholder: 'e.g. Lakers, Warriors, Celtics...' },
    { id: 'music', icon: 'music', name: 'Music', desc: 'What is your sound?', placeholder: 'e.g. Taylor Swift, BTS, Metallica, Drake...' },
    { id: 'movies', icon: 'document', name: 'Movies and TV', desc: 'Screen time', placeholder: 'e.g. Marvel, Star Wars, Breaking Bad, The Office...' },
    { id: 'anime', icon: 'spark', name: 'Anime', desc: 'Weeb and proud', placeholder: 'e.g. One Piece, Naruto, Attack on Titan...' },
    { id: 'gaming', icon: 'bolt', name: 'Gaming', desc: 'Touch grass? Never.', placeholder: 'e.g. PlayStation, Call of Duty, Zelda, FIFA...' },
    { id: 'f1', icon: 'car', name: 'Formula 1', desc: 'Lights out and away we go', placeholder: 'e.g. Ferrari, Red Bull, Mercedes, McLaren...' },
  ]

  const handleTribeSelect = (tribe) => {
    setSelectedTribe(tribe)
    setUserInput('')
    setStep('input')
  }

  const handleInterestSubmit = async () => {
    if (!userInput.trim()) return

    setStep('loading-banter')

    try {
      const banter = await generateInitialBanter(selectedTribe.name, userInput.trim())
      setInitialBanter(banter)
      setStep('banter1')
    } catch (error) {
      console.error('Failed to generate banter:', error)
      setInitialBanter({
        banter: `A ${userInput} fan? Interesting choice... Let's see if you are a real one or just here for the vibes.`,
        emoji: ''
      })
      setStep('banter1')
    }
  }

  const handleStartQuiz = async () => {
    setStep('loading-quiz')

    try {
      const quiz = await generateQuiz(selectedTribe.name, userInput.trim())
      setQuizQuestions(quiz.questions || [])
      setStep('quiz')
    } catch (error) {
      console.error('Failed to generate quiz:', error)
      setQuizQuestions([
        { q: `How long have you been a ${userInput} fan?`, options: ['Just started', 'A few years', 'Since the beginning', 'Before they were cool'], correct: 3 },
        { q: 'How would your friends describe your fandom?', options: ['Casual', 'Enthusiast', 'Obsessed', 'It is my whole personality'], correct: 2 },
        { q: 'Do you own any merchandise?', options: ['No', 'A few items', 'A collection', 'My room is a shrine'], correct: 3 },
        { q: 'How do you react when someone criticizes your favorite?', options: ['Agree to disagree', 'Mild defense', 'Heated debate', 'Take it personally'], correct: 2 },
        { q: 'Would you travel far to see them/watch them?', options: ['Maybe local', 'Same country', 'Anywhere in Europe', 'Anywhere in the world'], correct: 3 },
      ])
      setStep('quiz')
    }
  }

  const handleAnswer = async (answerIndex) => {
    const isCorrect = answerIndex === quizQuestions[currentQuestion].correct
    const newAnswers = [...answers, { question: currentQuestion, answer: answerIndex, correct: isCorrect }]
    setAnswers(newAnswers)

    const newScore = isCorrect ? score + 1 : score
    if (isCorrect) setScore(newScore)

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setStep('loading-results')

      try {
        const finalScore = newScore
        const result = await generateFinalBanter(
          selectedTribe.name,
          userInput.trim(),
          finalScore,
          quizQuestions.length
        )
        setFinalBanter(result)
        setStep('results')
      } catch (error) {
        console.error('Failed to generate final banter:', error)
        setFinalBanter({
          banter: `You scored ${newScore}/${quizQuestions.length}. ${newScore >= 4 ? 'Impressive.' : newScore >= 2 ? 'Not bad.' : 'Room for improvement.'} Welcome to Expat Village.`,
          badge: newScore >= 4 ? 'True Fan' : newScore >= 2 ? 'Casual Fan' : 'Newbie',
          townHallSuggestion: `Find your fellow ${userInput} fans in Town Hall.`
        })
        setStep('results')
      }
    }
  }

  const handleFinish = () => {
    const userData = {
      username,
      tribe: selectedTribe,
      interest: userInput,
      score,
      totalQuestions: quizQuestions.length,
      badge: finalBanter?.badge || 'Fan',
      completedAt: new Date().toISOString()
    }
    localStorage.setItem('expat-village-tribe', JSON.stringify(userData))
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xl glass-panel rounded-3xl p-6 sm:p-8">
        {step === 'welcome' && (
          <div className="text-center space-y-6">
            <div className="glass-panel inline-flex h-14 w-14 items-center justify-center rounded-2xl">
              <Icon name="community" size={22} className="text-slate-100" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-white mb-2">
                {username ? `Hey ${username}` : 'Welcome to Expat Village'}
              </h1>
              <p className="text-slate-400">
                {username
                  ? 'One more thing before you dive in - let us find your tribe. This is going to be fun.'
                  : 'Before you enter, let us find your tribe. This is not your boring sign-up form.'
                }
              </p>
            </div>
            {!username && (
              <input
                type="text"
                placeholder="First, what should we call you?"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400"
              />
            )}
            <button
              onClick={() => username && setStep('tribe')}
              disabled={!username}
              className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20 disabled:opacity-50"
            >
              {username ? 'Let us find my tribe' : 'Let us go'}
            </button>
            {isAuthenticated && (
              <button
                onClick={() => navigate('/')}
                className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
              >
                Skip for now
              </button>
            )}
          </div>
        )}

        {step === 'tribe' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white mb-2">Hey {username}</h2>
              <p className="text-slate-400">What is your thing? Pick your tribe.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {tribes.map((tribe) => (
                <button
                  key={tribe.id}
                  onClick={() => handleTribeSelect(tribe)}
                  className="glass-panel hover-tilt rounded-2xl p-4 text-left transition-all border border-white/10"
                >
                  <Icon name={tribe.icon} size={24} className="text-slate-100 mb-2" />
                  <h3 className="font-semibold text-white">{tribe.name}</h3>
                  <p className="text-slate-500 text-sm">{tribe.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'input' && selectedTribe && (
          <div className="space-y-6">
            <button
              onClick={() => setStep('tribe')}
              className="text-slate-400 hover:text-white text-sm"
            >
              Back
            </button>
            <div className="text-center">
              <div className="glass-panel inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-4">
                <Icon name={selectedTribe.icon} size={22} className="text-slate-100" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">{selectedTribe.name}</h2>
              <p className="text-slate-400">Now tell us specifically - who or what do you support or follow?</p>
            </div>
            <input
              type="text"
              placeholder={selectedTribe.placeholder}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleInterestSubmit()}
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-emerald-400"
              autoFocus
            />
            <button
              onClick={handleInterestSubmit}
              disabled={!userInput.trim()}
              className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20 disabled:opacity-50"
            >
              Let us see what you got
            </button>
          </div>
        )}

        {step === 'loading-banter' && (
          <div className="text-center py-10">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-semibold text-white mb-2">Hmm, {userInput}...</h2>
            <p className="text-slate-400">Let me think of something to say about that.</p>
          </div>
        )}

        {step === 'banter1' && initialBanter && (
          <div className="text-center space-y-6">
            <div className="glass-panel inline-flex h-14 w-14 items-center justify-center rounded-2xl">
              <Icon name="spark" size={22} className="text-slate-100" />
            </div>
            <h2 className="text-2xl font-semibold text-white">{userInput}? Really?</h2>
            <div className="glass-chip rounded-2xl p-5">
              <p className="text-slate-300 leading-relaxed">{initialBanter.banter}</p>
            </div>
            <button
              onClick={handleStartQuiz}
              className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              Prove Me Wrong
            </button>
          </div>
        )}

        {step === 'loading-quiz' && (
          <div className="text-center py-10">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-semibold text-white mb-2">Preparing your quiz...</h2>
            <p className="text-slate-400">Let us see if you really know your stuff.</p>
          </div>
        )}

        {step === 'quiz' && quizQuestions.length > 0 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center text-sm text-slate-400">
              <span>Question {currentQuestion + 1}/{quizQuestions.length}</span>
              <span className="text-emerald-200">Score: {score}</span>
            </div>
            <div className="w-full bg-slate-900/60 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>
            <h2 className="text-xl font-semibold text-white">{quizQuestions[currentQuestion].q}</h2>
            <div className="space-y-3">
              {quizQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full glass-panel hover-tilt rounded-2xl p-4 text-left text-white transition-all border border-white/10"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'loading-results' && (
          <div className="text-center py-10">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-semibold text-white mb-2">Analyzing your answers...</h2>
            <p className="text-slate-400">The AI is judging you. Please wait.</p>
          </div>
        )}

        {step === 'results' && finalBanter && (
          <div className="text-center space-y-6">
            <div className="glass-panel inline-flex h-14 w-14 items-center justify-center rounded-2xl">
              <Icon name={score >= 4 ? 'trophy' : score >= 2 ? 'star' : 'spark'} size={22} className="text-slate-100" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                {score}/{quizQuestions.length} - {finalBanter.badge}
              </h2>
              <div className="glass-chip rounded-2xl p-5">
                <p className="text-slate-300 leading-relaxed italic">"{finalBanter.banter}"</p>
              </div>
            </div>
            <p className="text-emerald-200 text-sm">{finalBanter.townHallSuggestion}</p>
            <button
              onClick={() => setStep('badge')}
              className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              Claim My Badge
            </button>
          </div>
        )}

        {step === 'badge' && (
          <div className="text-center space-y-6">
            <div className="glass-3d rounded-3xl p-6 hover-tilt">
              <div className="glass-panel inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-4">
                <Icon name={selectedTribe?.icon} size={22} className="text-slate-100" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">{userInput}</h2>
              <p className="text-emerald-200 font-medium mb-4">{finalBanter?.badge || 'Fan'}</p>
              <div className="glass-panel rounded-2xl p-4">
                <p className="text-slate-400 text-sm">Badge Holder</p>
                <p className="text-white font-semibold text-lg">@{username}</p>
              </div>
            </div>
            <p className="text-slate-400">
              Your badge is now visible on your profile. Find your people in Town Hall.
            </p>
            <button
              onClick={handleFinish}
              className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              Enter the Village
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PersonalityOnboarding
