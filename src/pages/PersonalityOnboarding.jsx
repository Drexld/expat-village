import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function PersonalityOnboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState('welcome') // welcome, tribe, club, banter1, quiz, results, badge
  const [selectedTribe, setSelectedTribe] = useState(null)
  const [selectedClub, setSelectedClub] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [score, setScore] = useState(0)
  const [username, setUsername] = useState('')

  // Tribes (categories)
  const tribes = [
    { id: 'football', icon: '⚽', name: 'Football', desc: 'The beautiful game' },
    { id: 'nba', icon: '🏀', name: 'NBA', desc: 'Ball is life' },
    { id: 'marvel', icon: '🦸', name: 'Marvel', desc: 'Earth\'s mightiest heroes' },
    { id: 'dc', icon: '🦇', name: 'DC', desc: 'The dark side' },
    { id: 'anime', icon: '🍜', name: 'Anime', desc: 'Weeb and proud' },
    { id: 'gaming', icon: '🎮', name: 'Gaming', desc: 'Touch grass? Never.' },
    { id: 'f1', icon: '🏎️', name: 'Formula 1', desc: 'Lights out and away we go' },
    { id: 'kpop', icon: '🎵', name: 'K-Pop', desc: 'Stan culture' },
  ]

  // Clubs/Factions per tribe
  const clubs = {
    football: [
      { id: 'man-united', name: 'Manchester United', emoji: '🔴', color: 'red' },
      { id: 'liverpool', name: 'Liverpool', emoji: '🔴', color: 'red' },
      { id: 'chelsea', name: 'Chelsea', emoji: '🔵', color: 'blue' },
      { id: 'arsenal', name: 'Arsenal', emoji: '🔴', color: 'red' },
      { id: 'man-city', name: 'Manchester City', emoji: '🩵', color: 'sky' },
      { id: 'tottenham', name: 'Tottenham', emoji: '⚪', color: 'white' },
      { id: 'real-madrid', name: 'Real Madrid', emoji: '⚪', color: 'white' },
      { id: 'barcelona', name: 'Barcelona', emoji: '🔵🔴', color: 'blue' },
      { id: 'bayern', name: 'Bayern Munich', emoji: '🔴', color: 'red' },
      { id: 'psg', name: 'PSG', emoji: '🔵', color: 'blue' },
      { id: 'juventus', name: 'Juventus', emoji: '⚫⚪', color: 'white' },
      { id: 'other-football', name: 'Other Club', emoji: '⚽', color: 'green' },
    ],
    nba: [
      { id: 'lakers', name: 'LA Lakers', emoji: '💜💛', color: 'purple' },
      { id: 'warriors', name: 'Golden State Warriors', emoji: '💙💛', color: 'blue' },
      { id: 'bulls', name: 'Chicago Bulls', emoji: '🔴', color: 'red' },
      { id: 'celtics', name: 'Boston Celtics', emoji: '☘️', color: 'green' },
      { id: 'heat', name: 'Miami Heat', emoji: '🔥', color: 'red' },
      { id: 'nets', name: 'Brooklyn Nets', emoji: '⚫', color: 'gray' },
      { id: 'other-nba', name: 'Other Team', emoji: '🏀', color: 'orange' },
    ],
    marvel: [
      { id: 'avengers', name: 'Team Avengers', emoji: '🅰️', color: 'blue' },
      { id: 'xmen', name: 'X-Men', emoji: '🧬', color: 'yellow' },
      { id: 'spiderman', name: 'Spider-Man Stan', emoji: '🕷️', color: 'red' },
      { id: 'ironman', name: 'Iron Man Stan', emoji: '🤖', color: 'red' },
      { id: 'thor', name: 'Thor Stan', emoji: '⚡', color: 'blue' },
      { id: 'guardians', name: 'Guardians of the Galaxy', emoji: '🚀', color: 'purple' },
    ],
    dc: [
      { id: 'batman', name: 'Batman Stan', emoji: '🦇', color: 'gray' },
      { id: 'superman', name: 'Superman Stan', emoji: '🦸', color: 'blue' },
      { id: 'wonderwoman', name: 'Wonder Woman Stan', emoji: '👸', color: 'red' },
      { id: 'flash', name: 'The Flash Stan', emoji: '⚡', color: 'red' },
      { id: 'aquaman', name: 'Aquaman Stan', emoji: '🔱', color: 'teal' },
      { id: 'joker', name: 'Joker Enthusiast', emoji: '🃏', color: 'purple' },
    ],
    anime: [
      { id: 'onepiece', name: 'One Piece', emoji: '🏴‍☠️', color: 'red' },
      { id: 'naruto', name: 'Naruto', emoji: '🍥', color: 'orange' },
      { id: 'dbz', name: 'Dragon Ball', emoji: '🐉', color: 'orange' },
      { id: 'aot', name: 'Attack on Titan', emoji: '⚔️', color: 'green' },
      { id: 'demonslayer', name: 'Demon Slayer', emoji: '🗡️', color: 'red' },
      { id: 'jjk', name: 'Jujutsu Kaisen', emoji: '👁️', color: 'purple' },
      { id: 'other-anime', name: 'Other Anime', emoji: '🍜', color: 'pink' },
    ],
    gaming: [
      { id: 'playstation', name: 'PlayStation', emoji: '🎮', color: 'blue' },
      { id: 'xbox', name: 'Xbox', emoji: '🎮', color: 'green' },
      { id: 'nintendo', name: 'Nintendo', emoji: '🍄', color: 'red' },
      { id: 'pc', name: 'PC Master Race', emoji: '🖥️', color: 'gray' },
      { id: 'mobile', name: 'Mobile Gamer', emoji: '📱', color: 'white' },
    ],
    f1: [
      { id: 'redbull', name: 'Red Bull Racing', emoji: '🐂', color: 'blue' },
      { id: 'ferrari', name: 'Ferrari', emoji: '🐎', color: 'red' },
      { id: 'mercedes', name: 'Mercedes', emoji: '⭐', color: 'teal' },
      { id: 'mclaren', name: 'McLaren', emoji: '🧡', color: 'orange' },
      { id: 'alpine', name: 'Alpine', emoji: '🇫🇷', color: 'blue' },
      { id: 'other-f1', name: 'Other Team', emoji: '🏎️', color: 'white' },
    ],
    kpop: [
      { id: 'bts', name: 'BTS ARMY', emoji: '💜', color: 'purple' },
      { id: 'blackpink', name: 'BLACKPINK Blink', emoji: '🖤💗', color: 'pink' },
      { id: 'twice', name: 'TWICE Once', emoji: '🍭', color: 'pink' },
      { id: 'stray', name: 'Stray Kids Stay', emoji: '🖤', color: 'red' },
      { id: 'newjeans', name: 'NewJeans Bunny', emoji: '🐰', color: 'blue' },
      { id: 'other-kpop', name: 'Other Group', emoji: '🎵', color: 'purple' },
    ],
  }

  // Banter lines when selecting a club
  const clubBanter = {
    'man-united': "Ah, a Man United fan... brave of you to admit that publicly in 2026. 😏 Let's see if you're a real fan or just here for the Ronaldo memories.",
    'liverpool': "YNWA huh? Let me guess, you've never actually been to Anfield but you've seen the Netflix documentary 47 times. 😂",
    'chelsea': "A Chelsea fan! How's life been since the sugar daddy money dried up? 💸😅",
    'arsenal': "Arsenal fan! 'This is our year' - you, every year since 2004. Let's test that optimism! 🙃",
    'man-city': "Man City! Quick question - were you a fan before or after the oil money? 🛢️😂",
    'tottenham': "A Spurs fan?! Mate... I'm so sorry. Do you need a hug? 🤗 Trophy cabinet looking a bit dusty...",
    'real-madrid': "Hala Madrid! You probably think you can just buy success... wait, you can and you do. 😤",
    'barcelona': "A Barça fan! Still living off 2009-2015 memories? Més que un club, menys que un trophy recently. 😬",
    'bayern': "Bayern Munich! Must be nice winning the league before Christmas every year. Where's the challenge? 🥱",
    'psg': "PSG! All that money and still no Champions League. Mbappe left btw. 💀",
    'juventus': "Juventus! The old lady is looking VERY old lately. Serie A isn't what it used to be. 👵",
    'lakers': "Lakers fan! LeBron or Kobe era? Choose carefully, this defines you. 👀",
    'warriors': "Warriors! Bandwagon or been there since the We Believe days? Be honest. 🤔",
    'bulls': "Bulls fan! Still talking about the 90s like it was yesterday huh? MJ isn't walking through that door. 😂",
    'celtics': "Celtics! 18 banners, how many did you actually witness? 🍀",
    'avengers': "Team Avengers! Basic but respectable. At least you didn't say DC. 😏",
    'batman': "Batman stan! 'I'm not like other heroes, I'm dark and complex.' We get it. 🦇",
    'onepiece': "One Piece?! You've been watching for 20 years and they STILL haven't found the treasure. Respect the commitment. 🏴‍☠️",
    'naruto': "Naruto fan! Let me guess, you did the run in school. Don't lie. 🏃",
    'playstation': "PlayStation! Good choice. Xbox fans are punching the air right now. 🎮",
    'xbox': "Xbox! Bold. PlayStation fans already typing their essays about why you're wrong. 😂",
    'pc': "PC Master Race! How's that $3000 setup running Minecraft? 🖥️💸",
    'redbull': "Red Bull! A Max fan or just here for the wins? DTS brought you here didn't it? 😏",
    'ferrari': "Ferrari! Pain. Suffering. 'Slow button on.' Next Year™ is your motto. 🐎😭",
    'mercedes': "Mercedes! The 2021 copium finally wearing off? 'Masi, no Michael, no!' 😂",
    'bts': "ARMY! Your streaming dedication is honestly scary. Touch grass? Never heard of her. 💜",
    'blackpink': "Blink! 'BLACKPINK in your area!' ...like once every 2 years with 8 songs. 🖤💗",
  }

  // Quiz questions per club (5 questions each)
  const quizQuestions = {
    'man-united': [
      { q: "Who scored the winner in the 1999 Champions League final?", options: ["Sheringham", "Solskjaer", "Beckham", "Scholes"], correct: 1 },
      { q: "How many Premier League titles does United have?", options: ["13", "18", "20", "22"], correct: 2 },
      { q: "Who is the club's all-time top scorer?", options: ["Charlton", "Rooney", "Ronaldo", "Law"], correct: 1 },
      { q: "What year did Sir Alex Ferguson retire?", options: ["2011", "2012", "2013", "2014"], correct: 2 },
      { q: "Which player has the nickname 'The King'?", options: ["Rooney", "Cantona", "Best", "Robson"], correct: 1 },
    ],
    'liverpool': [
      { q: "How many Champions League titles does Liverpool have?", options: ["4", "5", "6", "7"], correct: 2 },
      { q: "Who is Liverpool's all-time top scorer?", options: ["Gerrard", "Rush", "Dalglish", "Salah"], correct: 1 },
      { q: "What year was the famous Istanbul comeback?", options: ["2004", "2005", "2006", "2007"], correct: 1 },
      { q: "What's the name of the famous stand at Anfield?", options: ["The Kop", "The North Bank", "The Stretford End", "The Shed"], correct: 0 },
      { q: "Who managed Liverpool before Klopp?", options: ["Benitez", "Hodgson", "Rodgers", "Dalglish"], correct: 2 },
    ],
    'arsenal': [
      { q: "In which year did Arsenal go 'Invincible'?", options: ["2002-03", "2003-04", "2004-05", "2005-06"], correct: 1 },
      { q: "Who is Arsenal's all-time top scorer?", options: ["Henry", "Wright", "Bergkamp", "Aubameyang"], correct: 0 },
      { q: "What's Arsenal's nickname?", options: ["The Reds", "The Blues", "The Gunners", "The Hammers"], correct: 2 },
      { q: "Which manager signed Thierry Henry?", options: ["Graham", "Wenger", "Rioch", "Emery"], correct: 1 },
      { q: "What was Arsenal's stadium before the Emirates?", options: ["White Hart Lane", "Highbury", "Upton Park", "Stamford Bridge"], correct: 1 },
    ],
    'chelsea': [
      { q: "Who bought Chelsea in 2003?", options: ["Boehly", "Abramovich", "Bates", "Sheikh Mansour"], correct: 1 },
      { q: "How many Premier League titles does Chelsea have?", options: ["3", "4", "5", "6"], correct: 3 },
      { q: "Who scored the winning penalty in the 2012 CL final?", options: ["Lampard", "Terry", "Drogba", "Mata"], correct: 2 },
      { q: "What year did Chelsea first win the Champions League?", options: ["2010", "2011", "2012", "2013"], correct: 2 },
      { q: "Who is Chelsea's all-time top scorer?", options: ["Lampard", "Drogba", "Terry", "Hazard"], correct: 0 },
    ],
    'man-city': [
      { q: "When did the Abu Dhabi takeover happen?", options: ["2006", "2007", "2008", "2009"], correct: 2 },
      { q: "Who scored the famous 93:20 goal?", options: ["Tevez", "Balotelli", "Aguero", "Silva"], correct: 2 },
      { q: "How many consecutive PL titles did City win (2021-2024)?", options: ["2", "3", "4", "5"], correct: 2 },
      { q: "Who was City's manager before Guardiola?", options: ["Mancini", "Pellegrini", "Hughes", "Moyes"], correct: 1 },
      { q: "What year did City win their first Champions League?", options: ["2021", "2022", "2023", "2024"], correct: 2 },
    ],
    'tottenham': [
      { q: "When did Spurs last win the league?", options: ["1951", "1961", "1971", "1981"], correct: 1 },
      { q: "Who is Tottenham's all-time top scorer?", options: ["Kane", "Greaves", "Lineker", "Defoe"], correct: 1 },
      { q: "What's the capacity of the new stadium?", options: ["52,000", "58,000", "62,000", "68,000"], correct: 2 },
      { q: "Which manager led Spurs to the 2019 CL final?", options: ["Conte", "Mourinho", "Pochettino", "Ange"], correct: 2 },
      { q: "What year did they move to the new stadium?", options: ["2017", "2018", "2019", "2020"], correct: 2 },
    ],
    'real-madrid': [
      { q: "How many Champions League titles does Real have?", options: ["12", "13", "14", "15"], correct: 3 },
      { q: "Who is Real Madrid's all-time top scorer?", options: ["Raul", "Ronaldo", "Di Stefano", "Benzema"], correct: 1 },
      { q: "What is Real's stadium called?", options: ["Camp Nou", "Bernabeu", "Wanda", "Mestalla"], correct: 1 },
      { q: "Which manager won 3 consecutive CLs?", options: ["Ancelotti", "Mourinho", "Zidane", "Del Bosque"], correct: 2 },
      { q: "What is Real Madrid's nickname?", options: ["The Galacticos", "Los Blancos", "Los Merengues", "All of these"], correct: 3 },
    ],
    'barcelona': [
      { q: "How many Ballon d'Ors did Messi win at Barça?", options: ["5", "6", "7", "8"], correct: 2 },
      { q: "What year did Barcelona win the sextuple?", options: ["2008", "2009", "2010", "2011"], correct: 1 },
      { q: "What is Barcelona's motto?", options: ["Hala Madrid", "Més que un club", "YNWA", "Glory Glory"], correct: 1 },
      { q: "Who is Barça's all-time top scorer?", options: ["Messi", "Suarez", "Kubala", "Cruyff"], correct: 0 },
      { q: "What is La Masia?", options: ["Stadium", "Youth Academy", "Training Ground", "Museum"], correct: 1 },
    ],
  }

  // Default quiz for clubs without specific questions
  const defaultQuiz = [
    { q: "How passionate are you about your team? (1-10)", options: ["10", "11", "100", "Over 9000"], correct: 3 },
    { q: "Do you watch every game?", options: ["Most", "All of them", "Even the friendlies", "I have a shrine"], correct: 2 },
    { q: "Have you ever cried over a game?", options: ["Never", "Once", "Multiple times", "I'm crying now"], correct: 2 },
    { q: "Would you name your child after a player?", options: ["No way", "Maybe", "Already planned", "They're already named"], correct: 2 },
    { q: "How do you feel about rival fans?", options: ["Respect them", "Tolerate them", "Banter only", "War"], correct: 2 },
  ]

  // Result banter based on score
  const getResultBanter = (score, club) => {
    if (score === 5) {
      return {
        title: "CERTIFIED FAN! 🏆",
        message: `5/5! Okay okay, you actually know your stuff. The ${selectedClub?.name} community has a real one. Welcome home! 🔥`,
        level: "legend"
      }
    } else if (score >= 3) {
      return {
        title: "Not Bad! 👏",
        message: `${score}/5 - You pass... barely. Some homework needed but we'll let you in. Don't embarrass us in Town Hall! 😏`,
        level: "fan"
      }
    } else {
      return {
        title: "Exposed! 😂",
        message: `${score}/5?! Are you sure you support ${selectedClub?.name}? Wikipedia is free, my friend. We're letting you in anyway... on probation. 🫵😂`,
        level: "newbie"
      }
    }
  }

  const handleTribeSelect = (tribe) => {
    setSelectedTribe(tribe)
    setStep('club')
  }

  const handleClubSelect = (club) => {
    setSelectedClub(club)
    setStep('banter1')
  }

  const handleStartQuiz = () => {
    setStep('quiz')
  }

  const handleAnswer = (answerIndex) => {
    const questions = quizQuestions[selectedClub.id] || defaultQuiz
    const isCorrect = answerIndex === questions[currentQuestion].correct
    
    setAnswers([...answers, { question: currentQuestion, answer: answerIndex, correct: isCorrect }])
    if (isCorrect) setScore(score + 1)

    if (currentQuestion < 4) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setStep('results')
    }
  }

  const handleFinish = () => {
    // In real app, this would save to database
    navigate('/')
  }

  const questions = selectedClub ? (quizQuestions[selectedClub.id] || defaultQuiz) : []

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        
        {/* Welcome Step */}
        {step === 'welcome' && (
          <div className="text-center">
            <span className="text-6xl mb-6 block">🏘️</span>
            <h1 className="text-3xl font-bold text-white mb-4">Welcome to Expat Village!</h1>
            <p className="text-slate-400 mb-8">
              Before you enter, let's find your tribe. This isn't your boring sign-up form... 
              we're about to have some fun. 😏
            </p>
            <input
              type="text"
              placeholder="First, what should we call you?"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white mb-4 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => username && setStep('tribe')}
              disabled={!username}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Let's Go! 🚀
            </button>
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

        {/* Club Selection */}
        {step === 'club' && selectedTribe && (
          <div>
            <button 
              onClick={() => setStep('tribe')}
              className="text-slate-400 hover:text-white mb-4 text-sm"
            >
              ← Back
            </button>
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              {selectedTribe.icon} {selectedTribe.name}
            </h2>
            <p className="text-slate-400 mb-6 text-center">
              Now pick your side. Choose wisely... 👀
            </p>
            <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {clubs[selectedTribe.id]?.map((club) => (
                <button
                  key={club.id}
                  onClick={() => handleClubSelect(club)}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500 rounded-xl p-4 text-center transition-all"
                >
                  <span className="text-2xl mb-1 block">{club.emoji}</span>
                  <h3 className="font-medium text-white text-sm">{club.name}</h3>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Initial Banter */}
        {step === 'banter1' && selectedClub && (
          <div className="text-center">
            <span className="text-6xl mb-6 block">{selectedClub.emoji}</span>
            <h2 className="text-2xl font-bold text-white mb-4">
              {selectedClub.name}? Really? 😏
            </h2>
            <p className="text-slate-300 mb-8 leading-relaxed">
              {clubBanter[selectedClub.id] || `A ${selectedClub.name} fan! Interesting choice... Let's see if you're legit or just here for the vibes.`}
            </p>
            <button
              onClick={handleStartQuiz}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Bring It On! ⚡
            </button>
          </div>
        )}

        {/* Quiz */}
        {step === 'quiz' && questions.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-400 text-sm">Question {currentQuestion + 1}/5</span>
              <span className="text-emerald-400 text-sm">Score: {score}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 mb-6">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / 5) * 100}%` }}
              ></div>
            </div>
            <h2 className="text-xl font-bold text-white mb-6">
              {questions[currentQuestion].q}
            </h2>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
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

        {/* Results */}
        {step === 'results' && (
          <div className="text-center">
            {(() => {
              const result = getResultBanter(score)
              return (
                <>
                  <span className="text-6xl mb-6 block">
                    {score === 5 ? '🏆' : score >= 3 ? '👏' : '😂'}
                  </span>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {result.title}
                  </h2>
                  <p className="text-slate-300 mb-8 leading-relaxed">
                    {result.message}
                  </p>
                  <button
                    onClick={() => setStep('badge')}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    Claim My Badge! 🎖️
                  </button>
                </>
              )
            })()}
          </div>
        )}

        {/* Badge Award */}
        {step === 'badge' && (
          <div className="text-center">
            <div className="bg-gradient-to-br from-emerald-900/50 to-slate-800 border border-emerald-700/50 rounded-2xl p-8 mb-6">
              <span className="text-6xl mb-4 block">{selectedClub?.emoji}</span>
              <h2 className="text-2xl font-bold text-white mb-2">
                {selectedClub?.name}
              </h2>
              <p className="text-emerald-400 font-medium mb-4">
                {score === 5 ? '⭐ Certified Superfan' : score >= 3 ? '✓ Verified Fan' : '🆕 New Recruit'}
              </p>
              <div className="bg-slate-900/50 rounded-xl p-4">
                <p className="text-slate-400 text-sm">Badge Holder</p>
                <p className="text-white font-bold text-lg">@{username}</p>
              </div>
            </div>
            <p className="text-slate-400 mb-6">
              Your badge is now visible on your profile. Find your people in Town Hall and show off your colors! 🔥
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
