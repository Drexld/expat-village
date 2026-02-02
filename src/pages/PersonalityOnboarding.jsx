// src/pages/PersonalityOnboarding.jsx
// FULLY AI-DRIVEN - User types their interest, AI generates banter & quiz
// Connected to signup flow - user arrives here after creating account

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { generateInitialBanter, generateQuiz, generateFinalBanter } from '../lib/groq'

function PersonalityOnboarding() {
  const navigate = useNavigate()
  const { user, profile, isAuthenticated } = useAuth()
  const [step, setStep] = useState('welcome')
  const [selectedTribe, setSelectedTribe] = useState(null)
  const [userInput, setUserInput] = useState('') // Free text for club/artist/show
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [score, setScore] = useState(0)
  const [username, setUsername] = useState('')
  
  // Check if user already completed onboarding
  useEffect(() => {
    const existingTribe = localStorage.getItem('expat-village-tribe')
    if (existingTribe) {
      // Already completed - redirect to home
      navigate('/')
      return
    }
    
    // Get name from signup flow or profile
    const pendingName = localStorage.getItem('expat-village-pending-name')
    const displayName = pendingName 
      || profile?.display_name 
      || user?.user_metadata?.display_name 
      || user?.email?.split('@')[0]
      || ''
    
    if (displayName) {
      setUsername(displayName)
      // Clear pending name
      localStorage.removeItem('expat-village-pending-name')
    }
  }, [profile, user, navigate])
  
  // AI-generated content
  const [isLoading, setIsLoading] = useState(false)
  const [initialBanter, setInitialBanter] = useState(null)
  const [quizQuestions, setQuizQuestions] = useState([])
  const [finalBanter, setFinalBanter] = useState(null)

  // Tribes (broad categories)
  const tribes = [
    { id: 'football', icon: '⚽', name: 'Football', desc: 'The beautiful game', placeholder: 'e.g. Manchester United, Barcelona, AC Milan...' },
    { id: 'nba', icon: '🏀', name: 'NBA', desc: 'Ball is life', placeholder: 'e.g. Lakers, Warriors, Celtics...' },
    { id: 'music', icon: '🎵', name: 'Music', desc: 'What\'s your sound?', placeholder: 'e.g. Taylor Swift, BTS, Metallica, Drake...' },
    { id: 'movies', icon: '🎬', name: 'Movies & TV', desc: 'Screen time', placeholder: 'e.g. Marvel, Star Wars, Breaking Bad, The Office...' },
    { id: 'anime', icon: '🍜', name: 'Anime', desc: 'Weeb and proud', placeholder: 'e.g. One Piece, Naruto, Attack on Titan...' },
    { id: 'gaming', icon: '🎮', name: 'Gaming', desc: 'Touch grass? Never.', placeholder: 'e.g. PlayStation, Call of Duty, Zelda, FIFA...' },
    { id: 'f1', icon: '🏎️', name: 'Formula 1', desc: 'Lights out and away we go', placeholder: 'e.g. Ferrari, Red Bull, Mercedes, McLaren...' },
  ]

  // Handle tribe selection
  const handleTribeSelect = (tribe) => {
    setSelectedTribe(tribe)
    setUserInput('')
    setStep('input')
  }

  // Generate initial banter when user submits their interest
  const handleInterestSubmit = async () => {
    if (!userInput.trim()) return
    
    setIsLoading(true)
    setStep('loading-banter')
    
    try {
      const banter = await generateInitialBanter(selectedTribe.name, userInput.trim())
      setInitialBanter(banter)
      setStep('banter1')
    } catch (error) {
      console.error('Failed to generate banter:', error)
      setInitialBanter({
        banter: `A ${userInput} fan? Interesting choice... Let's see if you're a real one or just here for the vibes. 😏`,
        emoji: '🤔'
      })
      setStep('banter1')
    } finally {
      setIsLoading(false)
    }
  }

  // Generate quiz questions
  const handleStartQuiz = async () => {
    setIsLoading(true)
    setStep('loading-quiz')
    
    try {
      const quiz = await generateQuiz(selectedTribe.name, userInput.trim())
      setQuizQuestions(quiz.questions || [])
      setStep('quiz')
    } catch (error) {
      console.error('Failed to generate quiz:', error)
      // Fallback generic questions
      setQuizQuestions([
        { q: `How long have you been a ${userInput} fan?`, options: ["Just started", "A few years", "Since the beginning", "Before they were cool"], correct: 3 },
        { q: "How would your friends describe your fandom?", options: ["Casual", "Enthusiast", "Obsessed", "It's my whole personality"], correct: 2 },
        { q: "Do you own any merchandise?", options: ["No", "A few items", "A collection", "My room is a shrine"], correct: 3 },
        { q: "How do you react when someone criticizes your favorite?", options: ["Agree to disagree", "Mild defense", "Heated debate", "Take it personally"], correct: 2 },
        { q: "Would you travel far to see them/watch them?", options: ["Maybe local", "Same country", "Anywhere in Europe", "Anywhere in the world"], correct: 3 },
      ])
      setStep('quiz')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle quiz answer
  const handleAnswer = async (answerIndex) => {
    const isCorrect = answerIndex === quizQuestions[currentQuestion].correct
    const newAnswers = [...answers, { question: currentQuestion, answer: answerIndex, correct: isCorrect }]
    setAnswers(newAnswers)
    
    const newScore = isCorrect ? score + 1 : score
    if (isCorrect) setScore(newScore)

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Quiz complete - generate final banter
      setIsLoading(true)
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
          banter: `You scored ${newScore}/${quizQuestions.length}! ${newScore >= 4 ? 'Impressive!' : newScore >= 2 ? 'Not bad!' : 'Room for improvement! 😅'} Welcome to Expat Village!`,
          badge: newScore >= 4 ? 'True Fan' : newScore >= 2 ? 'Casual Fan' : 'Newbie',
          townHallSuggestion: `Find your fellow ${userInput} fans in Town Hall!`
        })
        setStep('results')
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Finish onboarding
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
      <div className="w-full max-w-lg">
        
        {/* Welcome Step */}
        {step === 'welcome' && (
          <div className="text-center">
            <span className="text-6xl mb-6 block">🏘️</span>
            <h1 className="text-3xl font-bold text-white mb-4">
              {username ? `Hey ${username}! 👋` : 'Welcome to Expat Village!'}
            </h1>
            <p className="text-slate-400 mb-8">
              {username 
                ? "One more thing before you dive in - let's find your tribe! This is gonna be fun. 😏"
                : "Before you enter, let's find your tribe. This isn't your boring sign-up form... we're about to have some fun. 😏"
              }
            </p>
            {!username && (
              <input
                type="text"
                placeholder="First, what should we call you?"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white mb-4 focus:outline-none focus:border-emerald-500"
              />
            )}
            <button
              onClick={() => username && setStep('tribe')}
              disabled={!username}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {username ? "Let's Find My Tribe! 🚀" : "Let's Go! 🚀"}
            </button>
            {isAuthenticated && (
              <button
                onClick={() => navigate('/')}
                className="mt-4 text-slate-500 hover:text-slate-300 text-sm transition-colors"
              >
                Skip for now →
              </button>
            )}
          </div>
        )}

        {/* Tribe Selection */}
        {step === 'tribe' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              Hey {username}! 👋
            </h2>
            <p className="text-slate-400 mb-6 text-center">
              What's your thing? Pick your tribe.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {tribes.map((tribe) => (
                <button
                  key={tribe.id}
                  onClick={() => handleTribeSelect(tribe)}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500 rounded-xl p-4 text-left transition-all"
                >
                  <span className="text-3xl mb-2 block">{tribe.icon}</span>
                  <h3 className="font-semibold text-white">{tribe.name}</h3>
                  <p className="text-slate-500 text-sm">{tribe.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Free Text Input for specific interest */}
        {step === 'input' && selectedTribe && (
          <div>
            <button 
              onClick={() => setStep('tribe')}
              className="text-slate-400 hover:text-white mb-4 text-sm"
            >
              ← Back
            </button>
            <div className="text-center mb-6">
              <span className="text-5xl mb-4 block">{selectedTribe.icon}</span>
              <h2 className="text-2xl font-bold text-white mb-2">
                {selectedTribe.name}
              </h2>
              <p className="text-slate-400">
                Now tell us specifically - who or what do you support/follow?
              </p>
            </div>
            <input
              type="text"
              placeholder={selectedTribe.placeholder}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleInterestSubmit()}
              className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-4 text-white text-lg mb-4 focus:outline-none focus:border-emerald-500"
              autoFocus
            />
            <button
              onClick={handleInterestSubmit}
              disabled={!userInput.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Let's See What You Got 😏
            </button>
          </div>
        )}

        {/* Loading - Generating Banter */}
        {step === 'loading-banter' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-bold text-white mb-2">Hmm, {userInput}... 🤔</h2>
            <p className="text-slate-400">Let me think of something to say about that...</p>
          </div>
        )}

        {/* Initial Banter from AI */}
        {step === 'banter1' && initialBanter && (
          <div className="text-center">
            <span className="text-6xl mb-6 block">{initialBanter.emoji || '😏'}</span>
            <h2 className="text-2xl font-bold text-white mb-4">
              {userInput}? Really?
            </h2>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 mb-6">
              <p className="text-slate-300 leading-relaxed">
                {initialBanter.banter}
              </p>
            </div>
            <button
              onClick={handleStartQuiz}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Prove Me Wrong! ⚡
            </button>
          </div>
        )}

        {/* Loading - Generating Quiz */}
        {step === 'loading-quiz' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-bold text-white mb-2">Preparing your quiz... 📝</h2>
            <p className="text-slate-400">Let's see if you really know your stuff.</p>
          </div>
        )}

        {/* Quiz */}
        {step === 'quiz' && quizQuestions.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-400 text-sm">Question {currentQuestion + 1}/{quizQuestions.length}</span>
              <span className="text-emerald-400 text-sm">Score: {score}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 mb-6">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>
            <h2 className="text-xl font-bold text-white mb-6">
              {quizQuestions[currentQuestion].q}
            </h2>
            <div className="space-y-3">
              {quizQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500 rounded-xl p-4 text-left text-white transition-all"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading - Generating Results */}
        {step === 'loading-results' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-bold text-white mb-2">Analyzing your answers... 🧐</h2>
            <p className="text-slate-400">The AI is judging you. Please wait.</p>
          </div>
        )}

        {/* Results with AI Banter */}
        {step === 'results' && finalBanter && (
          <div className="text-center">
            <span className="text-6xl mb-6 block">
              {score >= 4 ? '🏆' : score >= 2 ? '👏' : '😂'}
            </span>
            <h2 className="text-2xl font-bold text-white mb-2">
              {score}/{quizQuestions.length} - {finalBanter.badge}
            </h2>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 mb-6">
              <p className="text-slate-300 leading-relaxed italic">
                "{finalBanter.banter}"
              </p>
            </div>
            <p className="text-emerald-400 text-sm mb-8">
              💡 {finalBanter.townHallSuggestion}
            </p>
            <button
              onClick={() => setStep('badge')}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Claim My Badge! 🎖️
            </button>
          </div>
        )}

        {/* Badge Award */}
        {step === 'badge' && (
          <div className="text-center">
            <div className="bg-gradient-to-br from-emerald-900/50 to-slate-800 border border-emerald-700/50 rounded-2xl p-8 mb-6">
              <span className="text-6xl mb-4 block">{selectedTribe?.icon}</span>
              <h2 className="text-2xl font-bold text-white mb-2">
                {userInput}
              </h2>
              <p className="text-emerald-400 font-medium mb-4">
                {finalBanter?.badge || 'Fan'}
              </p>
              <div className="bg-slate-900/50 rounded-xl p-4">
                <p className="text-slate-400 text-sm">Badge Holder</p>
                <p className="text-white font-bold text-lg">@{username}</p>
              </div>
            </div>
            <p className="text-slate-400 mb-6">
              Your badge is now visible on your profile. Find your people in Town Hall! 🔥
            </p>
            <button
              onClick={handleFinish}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Enter the Village! 🏘️
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default PersonalityOnboarding
