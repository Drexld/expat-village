// src/pages/Rewards.jsx
import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Icon from '../components/Icon'

const BADGES = [
  { id: 'first-login', name: 'First Steps', icon: 'user', description: 'Logged in for the first time', points: 10, category: 'starter', rarity: 'common' },
  { id: 'profile-complete', name: 'All About Me', icon: 'badge', description: 'Completed your profile', points: 20, category: 'starter', rarity: 'common' },
  { id: 'first-vote', name: 'Voice Heard', icon: 'star', description: 'Cast your first vote in Village Vibes', points: 10, category: 'starter', rarity: 'common' },
  { id: 'first-review', name: 'Critic', icon: 'document', description: 'Wrote your first review', points: 25, category: 'starter', rarity: 'common' },

  { id: 'checklist-25', name: 'Getting Started', icon: 'checklist', description: 'Completed 25% of checklist', points: 50, category: 'checklist', rarity: 'common' },
  { id: 'checklist-50', name: 'Halfway There', icon: 'checklist', description: 'Completed 50% of checklist', points: 100, category: 'checklist', rarity: 'uncommon' },
  { id: 'checklist-75', name: 'Almost Local', icon: 'checklist', description: 'Completed 75% of checklist', points: 150, category: 'checklist', rarity: 'rare' },
  { id: 'checklist-100', name: 'True Local', icon: 'checklist', description: 'Completed 100% of checklist', points: 300, category: 'checklist', rarity: 'legendary' },

  { id: 'reviews-5', name: 'Regular Reviewer', icon: 'star', description: 'Wrote 5 reviews', points: 75, category: 'community', rarity: 'uncommon' },
  { id: 'reviews-10', name: 'Trusted Voice', icon: 'star', description: 'Wrote 10 reviews', points: 150, category: 'community', rarity: 'rare' },
  { id: 'votes-10', name: 'Active Voter', icon: 'chart', description: 'Voted 10 times', points: 50, category: 'community', rarity: 'uncommon' },
  { id: 'helpful-5', name: 'Helpful', icon: 'heart', description: '5 people found your reviews helpful', points: 100, category: 'community', rarity: 'rare' },

  { id: 'sections-all', name: 'Explorer', icon: 'map', description: 'Visited all sections', points: 50, category: 'explorer', rarity: 'uncommon' },
  { id: 'town-hall', name: 'Community Member', icon: 'chat', description: 'Joined a Town Hall session', points: 30, category: 'explorer', rarity: 'common' },
  { id: 'student-hub', name: 'Student Life', icon: 'graduation', description: 'Explored Student Hub', points: 20, category: 'explorer', rarity: 'common' },

  { id: 'early-adopter', name: 'Early Adopter', icon: 'spark', description: 'Joined during beta', points: 100, category: 'special', rarity: 'rare' },
  { id: 'og-member', name: 'OG Member', icon: 'crown', description: 'One of the first 100 members', points: 200, category: 'special', rarity: 'legendary' },
  { id: 'bug-hunter', name: 'Bug Hunter', icon: 'tools', description: 'Reported a bug that was fixed', points: 150, category: 'special', rarity: 'rare' },
  { id: 'content-creator', name: 'Content Creator', icon: 'document', description: 'Submitted approved content', points: 100, category: 'special', rarity: 'rare' },
]

const LEVELS = [
  { name: 'Newcomer', minPoints: 0, icon: 'spark' },
  { name: 'Settler', minPoints: 100, icon: 'badge' },
  { name: 'Resident', minPoints: 300, icon: 'star' },
  { name: 'Local', minPoints: 600, icon: 'trophy' },
  { name: 'Trusted Local', minPoints: 1000, icon: 'crown' },
  { name: 'Village Elder', minPoints: 2000, icon: 'crown' },
]

function Rewards() {
  const { isAuthenticated, openAuthModal } = useAuth()
  const [points, setPoints] = useState(0)
  const [pointsHistory, setPointsHistory] = useState([])
  const [earnedBadges, setEarnedBadges] = useState([])

  const loadPointsData = useCallback(() => {
    const savedPoints = localStorage.getItem('user-points')
    const savedHistory = localStorage.getItem('points-history')
    const savedBadges = localStorage.getItem('earned-badges')

    const parsedPoints = savedPoints ? parseInt(savedPoints, 10) : 0
    const parsedHistory = savedHistory ? JSON.parse(savedHistory) : []
    const parsedBadges = savedBadges ? JSON.parse(savedBadges) : []

    setPoints(parsedPoints)
    setPointsHistory(parsedHistory)
    setEarnedBadges(parsedBadges)

    if (isAuthenticated) {
      const toAward = []
      if (!parsedBadges.includes('first-login')) toAward.push('first-login')
      if (!parsedBadges.includes('early-adopter')) toAward.push('early-adopter')

      if (toAward.length > 0) {
        const updatedBadges = [...parsedBadges, ...toAward]
        setEarnedBadges(updatedBadges)
        localStorage.setItem('earned-badges', JSON.stringify(updatedBadges))

        const awardedBadges = BADGES.filter((badge) => toAward.includes(badge.id))
        const pointsToAdd = awardedBadges.reduce((sum, badge) => sum + badge.points, 0)
        const updatedPoints = parsedPoints + pointsToAdd
        setPoints(updatedPoints)
        localStorage.setItem('user-points', updatedPoints.toString())

        const timestamp = new Date().toISOString()
        const historyEntries = awardedBadges.map((badge, index) => ({
          id: Date.now() + index,
          type: 'badge',
          description: `Earned "${badge.name}" badge`,
          points: badge.points,
          timestamp,
        }))
        const updatedHistory = [...historyEntries, ...parsedHistory]
        setPointsHistory(updatedHistory)
        localStorage.setItem('points-history', JSON.stringify(updatedHistory))
      }
    }
  }, [isAuthenticated])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPointsData()
  }, [loadPointsData])

  const getCurrentLevel = () => {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (points >= LEVELS[i].minPoints) {
        return { ...LEVELS[i], index: i }
      }
    }
    return { ...LEVELS[0], index: 0 }
  }

  const getNextLevel = () => {
    const currentIndex = getCurrentLevel().index
    if (currentIndex < LEVELS.length - 1) {
      return LEVELS[currentIndex + 1]
    }
    return null
  }

  const currentLevel = getCurrentLevel()
  const nextLevel = getNextLevel()
  const progressToNext = nextLevel
    ? ((points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'from-slate-700 to-slate-800 border-slate-600'
      case 'uncommon': return 'from-emerald-800 to-emerald-900 border-emerald-500'
      case 'rare': return 'from-sky-800 to-indigo-900 border-sky-500'
      case 'legendary': return 'from-amber-700 to-orange-900 border-amber-500'
      default: return 'from-slate-700 to-slate-800 border-slate-600'
    }
  }

  const getRarityLabel = (rarity) => {
    switch (rarity) {
      case 'common': return { text: 'Common', color: 'text-slate-300' }
      case 'uncommon': return { text: 'Uncommon', color: 'text-emerald-200' }
      case 'rare': return { text: 'Rare', color: 'text-sky-200' }
      case 'legendary': return { text: 'Legendary', color: 'text-amber-200' }
      default: return { text: 'Common', color: 'text-slate-300' }
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="space-y-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <Icon name="arrowLeft" size={16} />
          Back to Home
        </Link>

        <div className="glass-panel rounded-3xl p-10 text-center">
          <div className="glass-panel inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-4">
            <Icon name="trophy" size={22} className="text-slate-100" />
          </div>
          <h1 className="text-3xl font-semibold text-white mb-3">My Rewards</h1>
          <p className="text-slate-400 mb-6">Sign in to track your points and earn badges.</p>
          <button
            onClick={() => openAuthModal('sign_up')}
            className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
          >
            Sign Up to Start Earning
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
        <Icon name="arrowLeft" size={16} />
        Back to Home
      </Link>

      <header className="glass-panel rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="glass-panel flex h-12 w-12 items-center justify-center rounded-2xl">
            <Icon name="trophy" size={22} className="text-slate-100" />
          </div>
          <h1 className="text-3xl font-semibold text-white">My Rewards</h1>
        </div>
        <p className="text-slate-400 text-lg">
          Earn points by helping the community. Unlock badges and climb the ranks.
        </p>
      </header>

      <div className="glass-3d rounded-3xl p-6 hover-tilt">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-slate-400 text-sm uppercase tracking-wide">Your Level</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="glass-panel flex h-10 w-10 items-center justify-center rounded-xl">
                <Icon name={currentLevel.icon} size={18} className="text-slate-100" />
              </div>
              <span className="text-2xl font-semibold text-white">{currentLevel.name}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm uppercase tracking-wide">Total Points</p>
            <p className="text-4xl font-semibold text-white">{points}</p>
          </div>
        </div>

        {nextLevel ? (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Progress to {nextLevel.name}</span>
              <span className="text-emerald-200">{nextLevel.minPoints - points} points to go</span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                style={{ width: `${Math.min(progressToNext, 100)}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="text-center text-emerald-200 mt-2">You have reached the highest level.</div>
        )}
      </div>

      <div className="glass-panel rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">How to Earn Points</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Complete Checklist', value: 'Up to 300 pts', icon: 'checklist' },
            { label: 'Write Reviews', value: '25 pts each', icon: 'star' },
            { label: 'Vote Daily', value: '10 pts each', icon: 'chart' },
            { label: 'Join Town Hall', value: '30 pts', icon: 'chat' }
          ].map((item) => (
            <div key={item.label} className="glass-chip rounded-2xl p-4 text-center">
              <div className="glass-panel inline-flex h-10 w-10 items-center justify-center rounded-xl mb-2">
                <Icon name={item.icon} size={18} className="text-slate-100" />
              </div>
              <p className="text-white font-medium text-sm">{item.label}</p>
              <p className="text-emerald-200 text-xs">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white">
          Badges ({earnedBadges.length}/{BADGES.length})
        </h2>

        {earnedBadges.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm text-emerald-200 uppercase tracking-wide">Earned</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {BADGES.filter(b => earnedBadges.includes(b.id)).map(badge => {
                const rarityLabel = getRarityLabel(badge.rarity)
                return (
                  <div
                    key={badge.id}
                    className={`bg-gradient-to-br ${getRarityColor(badge.rarity)} border rounded-2xl p-4 text-center`}
                  >
                    <div className="glass-panel inline-flex h-10 w-10 items-center justify-center rounded-xl mb-2">
                      <Icon name={badge.icon} size={18} className="text-white" />
                    </div>
                    <h4 className="text-white font-medium text-sm">{badge.name}</h4>
                    <p className={`text-xs ${rarityLabel.color}`}>{rarityLabel.text}</p>
                    <p className="text-emerald-200 text-xs mt-1">+{badge.points} pts</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h3 className="text-sm text-slate-400 uppercase tracking-wide">Locked</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {BADGES.filter(b => !earnedBadges.includes(b.id)).map(badge => {
              const rarityLabel = getRarityLabel(badge.rarity)
              return (
                <div
                  key={badge.id}
                  className="glass-panel rounded-2xl p-4 text-center opacity-70 border border-white/5"
                >
                  <div className="glass-panel inline-flex h-10 w-10 items-center justify-center rounded-xl mb-2">
                    <Icon name={badge.icon} size={18} className="text-slate-200" />
                  </div>
                  <h4 className="text-slate-300 font-medium text-sm">{badge.name}</h4>
                  <p className={`text-xs ${rarityLabel.color} opacity-60`}>{rarityLabel.text}</p>
                  <p className="text-slate-500 text-xs mt-1">{badge.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Points History</h2>
        {pointsHistory.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 text-center text-slate-400">
            No points earned yet. Start exploring.
          </div>
        ) : (
          <div className="glass-panel rounded-2xl overflow-hidden">
            {pointsHistory.slice(0, 10).map(entry => (
              <div key={entry.id} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-white">{entry.description}</p>
                  <p className="text-slate-500 text-sm">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-emerald-200 font-semibold">+{entry.points}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass-panel rounded-2xl p-6 text-center">
        <h3 className="text-lg font-semibold text-white mb-2">Leaderboard Coming Soon</h3>
        <p className="text-slate-400 text-sm">Compete with other expats and see who is the ultimate Village Elder.</p>
      </div>
    </div>
  )
}

export default Rewards
