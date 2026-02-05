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
        <div className="text-slate-400">Loading vibes...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen space-y-8">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
        <Icon name="arrowLeft" size={16} />
        Back to Home
      </Link>

      <header className="glass-panel rounded-3xl p-6 text-center">
        <div className="glass-panel inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-4">
          <Icon name="music" size={22} className="text-slate-100" />
        </div>
        <h1 className="text-3xl font-semibold text-white mb-2">Village Vibes</h1>
        <p className="text-slate-400">
          Vote for today anthem. What is the expat community vibing to?
        </p>
      </header>

      <div className="glass-3d rounded-3xl p-6 text-center hover-tilt">
        <p className="text-slate-400 text-xs uppercase tracking-wide mb-2">Today Theme</p>
        <h2 className="text-2xl font-semibold text-white">Polish Bangers</h2>
        <p className="text-slate-400 mt-2">Songs that made us fall in love with Poland</p>
      </div>

      {!isAuthenticated && (
        <div className="glass-panel rounded-2xl p-4 border border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="glass-panel flex h-10 w-10 items-center justify-center rounded-xl">
              <Icon name="warning" size={18} className="text-amber-200" />
            </div>
            <div className="flex-1">
              <p className="text-amber-200 font-medium">Sign in to vote</p>
              <p className="text-slate-400 text-sm">Join the community and make your voice heard.</p>
            </div>
            <button
              onClick={() => openAuthModal('sign_up')}
              className="rounded-full border border-amber-400/40 bg-amber-500/20 px-4 py-2 text-sm text-amber-100 hover:bg-amber-500/30"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-slate-400">
        <div>
          <span className="text-white font-semibold">{totalVotes}</span> votes today
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
                hasVoted ? 'border-emerald-500/40' : 'border-white/10'
              } ${isWinning ? 'ring-2 ring-amber-400/40' : ''}`}
            >
              <div
                className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                  hasVoted ? 'bg-emerald-900/30' : 'bg-slate-700/20'
                }`}
                style={{ width: `${percentage}%` }}
              />

              <div className="relative p-4 flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0 ? 'bg-amber-500 text-amber-900' :
                  index === 1 ? 'bg-slate-300 text-slate-900' :
                  index === 2 ? 'bg-amber-700 text-amber-100' :
                  'bg-slate-700 text-slate-300'
                }`}>
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold truncate ${hasVoted ? 'text-emerald-200' : 'text-white'}`}>
                    {song.title}
                  </h3>
                  <p className="text-slate-400 text-sm">{song.artist}</p>
                </div>

                <div className="text-right mr-2">
                  <div className="text-white font-semibold">{song.vote_count}</div>
                  <div className="text-slate-400 text-xs">{percentage}%</div>
                </div>

                <button
                  onClick={() => handleVote(song.id)}
                  disabled={voting === song.id}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                    hasVoted
                      ? 'border-emerald-400/50 bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/30'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                  } ${voting === song.id ? 'opacity-50' : ''}`}
                >
                  {voting === song.id ? '...' : hasVoted ? 'Voted' : 'Vote'}
                </button>
              </div>

              {isWinning && (
                <div className="absolute top-2 right-2">
                  <span className="glass-chip text-xs px-2 py-0.5 rounded-full text-amber-100">Leading</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {isAuthenticated && Object.keys(userVotes).length > 0 && (
        <div className="glass-panel rounded-2xl p-4 border border-emerald-500/30">
          <div className="flex items-center gap-3">
            <div className="glass-panel flex h-10 w-10 items-center justify-center rounded-xl">
              <Icon name="spark" size={18} className="text-emerald-200" />
            </div>
            <div>
              <p className="text-emerald-200 font-medium">You voted</p>
              <p className="text-slate-400 text-sm">Thanks for sharing your vibe with the community.</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Hall of Fame</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Last Week', title: 'Gdzie jest bialy wegorz', detail: 'Cypis - 847 votes' },
            { label: 'Movie of the Month', title: 'Zimna Wojna', detail: 'Cold War - 623 votes' },
            { label: 'Album of the Month', title: 'Meskie Granie 2024', detail: 'Various - 512 votes' }
          ].map((item) => (
            <div key={item.label} className="glass-panel rounded-2xl p-4">
              <p className="text-slate-500 text-xs uppercase tracking-wide">{item.label}</p>
              <p className="text-white font-semibold mt-1">{item.title}</p>
              <p className="text-slate-400 text-sm">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <p className="text-slate-500 text-sm">Got a song that defines your Poland experience?</p>
        <button className="mt-2 text-emerald-200 hover:text-emerald-100 text-sm transition-colors">
          Suggest a song for tomorrow
        </button>
      </div>
    </div>
  )
}

export default VillageVibes
