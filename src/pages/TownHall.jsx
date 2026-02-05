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
  const channelRef = useRef(null)

  const activityLabel = useMemo(() => ({
    very_active: { label: 'Very Active', color: 'text-emerald-200' },
    active: { label: 'Active', color: 'text-sky-200' },
    moderate: { label: 'Moderate', color: 'text-amber-200' },
    quiet: { label: 'Quiet', color: 'text-slate-400' },
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
      <header className="glass-panel rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="glass-panel flex h-12 w-12 items-center justify-center rounded-2xl">
            <Icon name="chat" size={22} className="text-slate-100" />
          </div>
          <h1 className="text-3xl font-semibold text-white">Town Hall</h1>
        </div>
        <p className="text-slate-400 text-lg">
          Real expats, real conversations, real-time. Your community hub.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Community Rooms</h2>

        {joinError && (
          <div className="glass-panel rounded-2xl p-4 border border-red-500/30 text-red-200 text-sm">
            {joinError}
          </div>
        )}
        {roomsLoading ? (
          <div className="glass-panel rounded-2xl p-6 text-slate-400 text-sm">Loading rooms...</div>
        ) : roomsError ? (
          <div className="glass-panel rounded-2xl p-6 border border-red-500/30 text-red-200 text-sm">
            {roomsError}
          </div>
        ) : rooms.length === 0 ? (
          <div className="glass-panel rounded-2xl p-6 text-slate-400 text-sm">No rooms available yet.</div>
        ) : (
          <div className="space-y-2">
            {rooms.map((room) => {
              const activity = activityLabel[room.activity_level] || activityLabel.active
              const iconName = roomIcons[room.slug] || 'chat'
              return (
                <button
                  key={room.id}
                  onClick={() => handleJoinRoom(room)}
                  className="w-full text-left glass-panel hover-tilt rounded-2xl p-4 transition-all border border-white/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="glass-panel flex h-12 w-12 items-center justify-center rounded-2xl">
                      <Icon name={iconName} size={20} className="text-slate-100" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-white">
                          {room.title}
                        </h3>
                        <span className={`text-xs ${activity.color}`}>{activity.label}</span>
                      </div>
                      <p className="text-slate-500 text-sm truncate">
                        {room.description || 'Join the conversation'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-500 text-xs">Live chat</p>
                      <p className="text-slate-600 text-xs">Tap to join</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </section>

      <section className="glass-3d rounded-3xl p-6 hover-tilt">
        <div className="flex items-start gap-4">
          <div className="glass-panel flex h-12 w-12 items-center justify-center rounded-2xl">
            <Icon name="mic" size={20} className="text-slate-100" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2">Host Your Own Session</h3>
            <p className="text-slate-300 mb-4">
              Got expertise to share? Host a live session and help fellow expats.
              Tax tips, apartment hunting stories, language exchange - anything goes.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20">
                Start Live Now
              </button>
              <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition-colors hover:bg-white/10">
                Schedule for Later
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Community Members', value: '8.2k+' },
          { label: 'Sessions This Month', value: '156', accent: true },
          { label: 'Active Community', value: '24/7' }
        ].map((stat) => (
          <div key={stat.label} className="glass-panel rounded-2xl p-4 text-center">
            <p className={`text-2xl font-semibold ${stat.accent ? 'text-emerald-200' : 'text-white'}`}>{stat.value}</p>
            <p className="text-slate-400 text-sm">{stat.label}</p>
          </div>
        ))}
      </section>
    </>
  )

  const renderRoom = () => {
    const iconName = roomIcons[activeRoom?.slug] || 'chat'
    return (
      <div className="flex flex-col h-[calc(100vh-200px)]">
        <div className="glass-panel rounded-t-3xl p-4">
          <button
            onClick={() => setActiveView('main')}
            className="text-slate-400 hover:text-white mb-3 text-sm flex items-center gap-2"
          >
            <Icon name="arrowLeft" size={14} />
            Back to Town Hall
          </button>

          <div className="flex items-center gap-3">
            <div className="glass-panel flex h-10 w-10 items-center justify-center rounded-xl">
              <Icon name={iconName} size={18} className="text-slate-100" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">{activeRoom?.title}</h1>
              <p className="text-slate-400 text-sm">{activeRoom?.description || 'Live room'}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 glass-panel border-x border-white/5 p-4 overflow-y-auto">
          {messagesLoading ? (
            <div className="text-center text-slate-400">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center">
              <div className="glass-panel inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-3">
                <Icon name="chat" size={22} className="text-slate-100" />
              </div>
              <p className="text-slate-400">No messages yet. Start the conversation.</p>
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
                      isOwn ? 'bg-emerald-500/80 text-white' : 'glass-chip text-slate-200'
                    }`}>
                      {!isOwn && (
                        <p className="text-xs text-slate-400 mb-1">{senderName}</p>
                      )}
                      <p className="whitespace-pre-line">{msg.content}</p>
                      <p className="text-[10px] text-slate-300/70 mt-1">
                        {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="glass-panel rounded-b-3xl p-4">
          {messageError && (
            <div className="mb-2 text-xs text-red-300">{messageError}</div>
          )}
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder={isAuthenticated ? 'Send a message...' : 'Sign up to send messages...'}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={!isAuthenticated || sending}
              className={`flex-1 bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 placeholder-slate-500 ${
                !isAuthenticated ? 'text-slate-400 cursor-not-allowed' : 'text-white'
              }`}
            />
            <button
              onClick={handleSendMessage}
              disabled={!isAuthenticated || sending || !messageInput.trim()}
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20 disabled:opacity-50"
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
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
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
