// src/pages/VillageVibes.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Icon from '../components/Icon'

const SAMPLE_SONGS = [
  { id: 'sample-1', title: 'Nie patrz Ewie', artist: 'Meskie Granie', vote_count: 24 },
  { id: 'sample-2', title: 'Ostatni', artist: 'Sanah', vote_count: 18 },
  { id: 'sample-3', title: 'Gdzie jest bialy wegorz', artist: 'Cypis', vote_count: 31 },
  { id: 'sample-4', title: 'Melodia ulotna', artist: 'Daria Zawialow', vote_count: 15 },
]

function VillageVibes() {
  const { user, isAuthenticated, openAuthModal } = useAuth()
  const [songs, setSongs] = useState([])
  const [userVotes, setUserVotes] = useState({})
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(null)

  useEffect(() => {
    const savedVotes = localStorage.getItem('vibes-votes')
    if (savedVotes) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserVotes(JSON.parse(savedVotes))
    }

    const savedSongs = localStorage.getItem('vibes-songs')
    if (savedSongs) {
      setSongs(JSON.parse(savedSongs))
    } else {
      setSongs(SAMPLE_SONGS)
    }

    setLoading(false)
  }, [])

  const handleVote = async (songId) => {
    if (!isAuthenticated) {
      openAuthModal('sign_up')
      return
    }

    setVoting(songId)

    const hasVoted = userVotes[songId]

    const updatedSongs = songs.map(song => {
      if (song.id === songId) {
        return { ...song, vote_count: song.vote_count + (hasVoted ? -1 : 1) }
      }
      return song
    })
    setSongs(updatedSongs)
    localStorage.setItem('vibes-songs', JSON.stringify(updatedSongs))

    const updatedVotes = { ...userVotes }
    if (hasVoted) {
      delete updatedVotes[songId]
    } else {
      updatedVotes[songId] = true
    }
    setUserVotes(updatedVotes)
    localStorage.setItem('vibes-votes', JSON.stringify(updatedVotes))

    if (user) {
      try {
        if (hasVoted) {
          await supabase.from('vibes_votes').delete().eq('user_id', user.id).eq('item_id', songId)
        } else {
          await supabase.from('vibes_votes').insert({ user_id: user.id, item_id: songId })
        }
      } catch {
        // Silently fail - localStorage has the data
      }
    }

    setVoting(null)
  }

  const sortedSongs = [...songs].sort((a, b) => b.vote_count - a.vote_count)
  const totalVotes = songs.reduce((sum, s) => sum + s.vote_count, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-terra-ink-soft">Loading vibes...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen space-y-8">
      <Link to="/" className="inline-flex items-center gap-2 text-terra-ink-soft hover:text-terra-ink transition-colors">
        <Icon name="arrowLeft" size={16} />
        Back to Home
      </Link>

      <header className="glass-panel rounded-3xl p-6 text-center">
        <div className="glass-panel inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-4">
          <Icon name="music" size={22} className="text-terra-ink" />
        </div>
        <h1 className="text-3xl font-semibold text-terra-ink mb-2">Village Vibes</h1>
        <p className="text-terra-ink-soft">
          Vote for today anthem. What is the expat community vibing to?
        </p>
      </header>

      <div className="glass-3d rounded-3xl p-6 text-center hover-tilt">
        <p className="text-terra-ink-soft text-xs uppercase tracking-wide mb-2">Today Theme</p>
        <h2 className="text-2xl font-semibold text-terra-ink">Polish Bangers</h2>
        <p className="text-terra-ink-soft mt-2">Songs that made us fall in love with Poland</p>
      </div>

      {!isAuthenticated && (
        <div className="glass-panel rounded-2xl p-4 border border-amber-300/60">
          <div className="flex items-center gap-3">
            <div className="glass-panel flex h-10 w-10 items-center justify-center rounded-xl">
              <Icon name="warning" size={18} className="text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-amber-700 font-medium">Sign in to vote</p>
              <p className="text-terra-ink-soft text-sm">Join the community and make your voice heard.</p>
            </div>
            <button
              onClick={() => openAuthModal('sign_up')}
              className="rounded-full bg-terra-primary px-4 py-2 text-sm text-white shadow-glass hover:opacity-95"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-terra-ink-soft">
        <div>
          <span className="text-terra-ink font-semibold">{totalVotes}</span> votes today
        </div>
        <div>Resets daily at midnight</div>
      </div>

      <div className="space-y-3">
        {sortedSongs.map((song, index) => {
          const hasVoted = userVotes[song.id]
          const percentage = totalVotes > 0 ? Math.round((song.vote_count / totalVotes) * 100) : 0
          const isWinning = index === 0

          return (
            <div
              key={song.id}
              className={`relative glass-panel rounded-2xl overflow-hidden border ${
                hasVoted ? 'border-terra-sage/40' : 'border-terra-taupe/40'
              } ${isWinning ? 'ring-2 ring-terra-primary/30' : ''}`}
            >
              <div
                className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                  hasVoted ? 'bg-terra-sage/20' : 'bg-terra-cream/60'
                }`}
                style={{ width: `${percentage}%` }}
              />

              <div className="relative p-4 flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0 ? 'bg-terra-primary text-white' :
                  index === 1 ? 'bg-terra-cream text-terra-ink' :
                  index === 2 ? 'bg-amber-500 text-white' :
                  'bg-terra-cream/60 text-terra-ink'
                }`}>
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold truncate ${hasVoted ? 'text-terra-sage' : 'text-terra-ink'}`}>
                    {song.title}
                  </h3>
                  <p className="text-terra-ink-soft text-sm">{song.artist}</p>
                </div>

                <div className="text-right mr-2">
                  <div className="text-terra-ink font-semibold">{song.vote_count}</div>
                  <div className="text-terra-ink-soft text-xs">{percentage}%</div>
                </div>

                <button
                  onClick={() => handleVote(song.id)}
                  disabled={voting === song.id}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                    hasVoted
                      ? 'border-terra-sage/40 bg-terra-sage/15 text-terra-sage hover:bg-terra-sage/20'
                      : 'border-terra-taupe/40 bg-terra-cream/70 text-terra-ink hover:bg-terra-cream'
                  } ${voting === song.id ? 'opacity-50' : ''}`}
                >
                  {voting === song.id ? '...' : hasVoted ? 'Voted' : 'Vote'}
                </button>
              </div>

              {isWinning && (
                <div className="absolute top-2 right-2">
                  <span className="glass-chip text-xs px-2 py-0.5 rounded-full text-terra-primary">Leading</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {isAuthenticated && Object.keys(userVotes).length > 0 && (
        <div className="glass-panel rounded-2xl p-4 border border-terra-sage/40">
          <div className="flex items-center gap-3">
            <div className="glass-panel flex h-10 w-10 items-center justify-center rounded-xl">
              <Icon name="spark" size={18} className="text-terra-sage" />
            </div>
            <div>
              <p className="text-terra-sage font-medium">You voted</p>
              <p className="text-terra-ink-soft text-sm">Thanks for sharing your vibe with the community.</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-terra-ink">Hall of Fame</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Last Week', title: 'Gdzie jest bialy wegorz', detail: 'Cypis - 847 votes' },
            { label: 'Movie of the Month', title: 'Zimna Wojna', detail: 'Cold War - 623 votes' },
            { label: 'Album of the Month', title: 'Meskie Granie 2024', detail: 'Various - 512 votes' }
          ].map((item) => (
            <div key={item.label} className="glass-panel rounded-2xl p-4">
              <p className="text-terra-taupe text-xs uppercase tracking-wide">{item.label}</p>
              <p className="text-terra-ink font-semibold mt-1">{item.title}</p>
              <p className="text-terra-ink-soft text-sm">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <p className="text-terra-taupe text-sm">Got a song that defines your Poland experience?</p>
        <button className="mt-2 text-terra-sage hover:text-terra-ink text-sm transition-colors">
          Suggest a song for tomorrow
        </button>
      </div>
    </div>
  )
}

export default VillageVibes

