import { Link } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Icon from '../components/Icon'
import {
  getTownHallRooms,
  joinRoomConversation,
  getConversationMessages,
  sendMessage,
  subscribeToMessages,
  unsubscribeFromChannel
} from '../services/townhall'

function TownHall() {
  const { user, isAuthenticated, openAuthModal } = useAuth()
  const [activeView, setActiveView] = useState('main')
  const [activeRoom, setActiveRoom] = useState(null)
  const [rooms, setRooms] = useState([])
  const [roomsLoading, setRoomsLoading] = useState(true)
  const [roomsError, setRoomsError] = useState(null)
  const [messages, setMessages] = useState([])
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [messageInput, setMessageInput] = useState('')
  const [sending, setSending] = useState(false)
  const [messageError, setMessageError] = useState(null)
  const [joinError, setJoinError] = useState(null)
  const [joinPulse, setJoinPulse] = useState(null)
  const channelRef = useRef(null)

  const activityLabel = useMemo(() => ({
    very_active: { label: 'Very Active', color: 'text-terra-primary' },
    active: { label: 'Active', color: 'text-terra-ink' },
    moderate: { label: 'Moderate', color: 'text-terra-sage' },
    quiet: { label: 'Quiet', color: 'text-terra-taupe' },
  }), [])

  const roomIcons = useMemo(() => ({
    newcomers: 'community',
    housing: 'home',
    jobs: 'briefcase',
    social: 'spark',
    'daily-life': 'cart',
    parents: 'heart',
    polish: 'book',
    'buy-sell': 'cart'
  }), [])

  useEffect(() => {
    let isMounted = true
    async function loadRooms() {
      setRoomsLoading(true)
      const { data, error } = await getTownHallRooms()
      if (!isMounted) return
      if (error) {
        setRoomsError('Could not load rooms')
      } else {
        setRooms(data)
      }
      setRoomsLoading(false)
    }
    loadRooms()
    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    if (!activeRoom?.conversation_id) return

    let isMounted = true
    async function loadMessages() {
      setMessagesLoading(true)
      const { data } = await getConversationMessages(activeRoom.conversation_id, 100)
      if (!isMounted) return
      setMessages(data)
      setMessagesLoading(false)
    }

    loadMessages()

    if (channelRef.current) {
      unsubscribeFromChannel(channelRef.current)
      channelRef.current = null
    }

    channelRef.current = subscribeToMessages(activeRoom.conversation_id, (msg) => {
      setMessages((prev) => {
        if (prev.find((m) => m.id === msg.id)) return prev
        return [...prev, msg]
      })
    })

    return () => {
      isMounted = false
      if (channelRef.current) {
        unsubscribeFromChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [activeRoom?.conversation_id])

  const handleJoinRoom = async (room) => {
    setJoinPulse(room?.id)
    setTimeout(() => setJoinPulse(null), 600)
    if (!isAuthenticated) {
      openAuthModal('sign_up')
      return
    }

    if (!room?.conversation_id) return
    const { error } = await joinRoomConversation(room.conversation_id, user.id)
    if (error) {
      setJoinError('Could not join room. Please try again.')
      return
    }
    setJoinError(null)
    setActiveRoom(room)
    setActiveView('room')
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeRoom?.conversation_id) return
    if (!isAuthenticated) {
      openAuthModal('sign_up')
      return
    }

    setSending(true)
    setMessageError(null)

    const { error: joinErr } = await joinRoomConversation(activeRoom.conversation_id, user.id)
    if (joinErr) {
      setMessageError('Unable to join this room right now.')
      setSending(false)
      return
    }

    const { data, error } = await sendMessage(activeRoom.conversation_id, user.id, messageInput)
    if (!error) {
      if (data) {
        setMessages((prev) => {
          if (prev.find((m) => m.id === data.id)) return prev
          return [...prev, data]
        })
      }
      setMessageInput('')
    } else {
      setMessageError('Message failed to send. Please try again.')
    }
    setSending(false)
  }

  const renderMainView = () => (
    <>
      <header className="hero-card texture-layer texture-paper texture-amber glass-sheen">
        <div className="flex items-center gap-3 mb-2">
          <div className="glass-3d flex h-12 w-12 items-center justify-center rounded-2xl">
            <Icon name="chat" size={22} className="text-terra-ink" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-terra-taupe">Town Hall</p>
            <h1 className="text-2xl font-semibold text-terra-ink">Real conversations, right now</h1>
          </div>
        </div>
        <p className="text-terra-ink-soft text-sm">
          A cozy community hub for real expats. Tap a room and jump in.
        </p>
      </header>

      <section className="hero-card texture-layer texture-paper texture-photo glass-sheen">
        <div className="flex items-start gap-4">
          <div className="glass-3d flex h-12 w-12 items-center justify-center rounded-2xl">
            <Icon name="mic" size={20} className="text-terra-ink" />
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-widest text-terra-taupe">Host Your Own Session</p>
            <h3 className="text-xl font-semibold text-terra-ink mb-2">Share what you know</h3>
            <p className="text-terra-ink-soft mb-4 text-sm">
              Tax tips, apartment hunting stories, language exchange - anything goes.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    openAuthModal('sign_up')
                    return
                  }
                  // Jump into the first active room
                  const activeRoom = rooms.find(r => r.activity_level === 'very_active' || r.activity_level === 'active') || rooms[0]
                  if (activeRoom) handleJoinRoom(activeRoom)
                }}
                className="rounded-full px-4 py-2 text-sm font-medium text-terra-bg hover-tilt"
                style={{ background: 'linear-gradient(135deg, #C76B55, #D07C63)' }}
              >
                Start Live Now
              </button>
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    openAuthModal('sign_up')
                    return
                  }
                  // Scroll to rooms list
                  document.getElementById('community-rooms')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="rounded-full border border-black/10 bg-terra-cream px-4 py-2 text-sm text-terra-ink-soft transition-colors hover:bg-terra-bg"
              >
                Browse Rooms
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="community-rooms" className="space-y-3">
        <h2 className="text-sm font-semibold text-terra-ink">Community Rooms</h2>

        {joinError && (
          <div className="action-card texture-layer texture-paper border border-red-400/30 text-red-700 text-sm">
            {joinError}
          </div>
        )}
        {roomsLoading ? (
          <div className="action-card texture-layer texture-paper text-terra-taupe text-sm">Loading rooms...</div>
        ) : roomsError ? (
          <div className="action-card texture-layer texture-paper border border-red-400/30 text-red-700 text-sm">
            {roomsError}
          </div>
        ) : rooms.length === 0 ? (
          <div className="action-card texture-layer texture-paper text-terra-taupe text-sm">No rooms available yet.</div>
        ) : (
          <div className="space-y-2">
            {rooms.map((room, index) => {
              const activity = activityLabel[room.activity_level] || activityLabel.active
              const iconName = roomIcons[room.slug] || 'chat'
              return (
                <button
                  key={room.id}
                  onClick={() => handleJoinRoom(room)}
                  className={`w-full text-left action-card texture-layer texture-paper hover-tilt transition-all ${
                    joinPulse === room.id ? 'bounce-soft' : ''
                  } motion-rise`}
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="glass-panel flex h-12 w-12 items-center justify-center rounded-2xl">
                      <Icon name={iconName} size={20} className="text-terra-ink" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-terra-ink">
                          {room.title}
                        </h3>
                        <span className="pill text-xs">{activity.label}</span>
                      </div>
                      <p className="text-terra-ink-soft text-sm truncate">
                        {room.description || 'Join the conversation'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-terra-taupe text-xs">Live chat</p>
                      <p className="text-terra-primary text-xs font-semibold">Tap to join</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </section>

      {rooms.length > 0 && (
        <section className="grid grid-cols-3 gap-3">
          <div className="action-card texture-layer texture-paper text-center">
            <p className="text-2xl font-semibold text-terra-ink">{rooms.length}</p>
            <p className="text-terra-taupe text-sm">Active Rooms</p>
          </div>
          <div className="action-card texture-layer texture-paper text-center">
            <p className="text-2xl font-semibold text-terra-primary">
              {rooms.filter(r => r.activity_level === 'very_active' || r.activity_level === 'active').length}
            </p>
            <p className="text-terra-taupe text-sm">Buzzing Now</p>
          </div>
          <div className="action-card texture-layer texture-paper text-center">
            <p className="text-2xl font-semibold text-terra-ink">Live</p>
            <p className="text-terra-taupe text-sm">Always Open</p>
          </div>
        </section>
      )}
    </>
  )

  const renderRoom = () => {
    const iconName = roomIcons[activeRoom?.slug] || 'chat'
    return (
      <div className="flex flex-col h-[calc(100vh-200px)]">
        <div className="glass-strong rounded-t-3xl p-4">
          <button
            onClick={() => setActiveView('main')}
            className="text-terra-ink-soft hover:text-terra-ink mb-3 text-sm flex items-center gap-2"
          >
            <Icon name="arrowLeft" size={14} />
            Back to Town Hall
          </button>

          <div className="flex items-center gap-3">
            <div className="glass-panel flex h-10 w-10 items-center justify-center rounded-xl">
              <Icon name={iconName} size={18} className="text-terra-ink" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-terra-ink">{activeRoom?.title}</h1>
              <p className="text-terra-ink-soft text-sm">{activeRoom?.description || 'Live room'}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 glass-panel border-x border-black/5 p-4 overflow-y-auto">
          {messagesLoading ? (
            <div className="text-center text-terra-taupe">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center">
              <div className="glass-panel inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-3">
                <Icon name="chat" size={22} className="text-terra-ink" />
              </div>
              <p className="text-terra-ink-soft">No messages yet. Start the conversation.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => {
                const senderName =
                  msg.profiles?.display_name ||
                  msg.profiles?.email?.split('@')[0] ||
                  'Member'
                const isOwn = msg.sender_id === user?.id
                return (
                  <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                      isOwn ? 'text-terra-bg' : 'glass-chip text-terra-ink'
                    }`}
                    style={isOwn ? { background: 'linear-gradient(135deg, #C76B55, #D07C63)' } : undefined}
                    >
                      {!isOwn && (
                        <p className="text-xs text-terra-taupe mb-1">{senderName}</p>
                      )}
                      <p className="whitespace-pre-line">{msg.content}</p>
                      <p className="text-[10px] text-terra-taupe mt-1">
                        {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="glass-strong rounded-b-3xl p-4">
          {messageError && (
            <div className="mb-2 text-xs text-red-700">{messageError}</div>
          )}
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder={isAuthenticated ? 'Send a message...' : 'Sign up to send messages...'}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={!isAuthenticated || sending}
              className={`flex-1 bg-terra-cream border border-black/10 rounded-xl px-4 py-2 placeholder-terra-taupe ${
                !isAuthenticated ? 'text-terra-taupe cursor-not-allowed' : 'text-terra-ink'
              }`}
            />
            <button
              onClick={handleSendMessage}
              disabled={!isAuthenticated || sending || !messageInput.trim()}
              className="rounded-full px-4 py-2 text-sm font-medium text-terra-bg transition-colors disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #C76B55, #D07C63)' }}
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen space-y-8">
      {activeView === 'main' && (
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-terra-ink-soft hover:text-terra-ink transition-colors"
        >
          <Icon name="arrowLeft" size={16} />
          Back to Home
        </Link>
      )}

      {activeView === 'main' && renderMainView()}
      {activeView === 'room' && renderRoom()}
    </div>
  )
}

export default TownHall
