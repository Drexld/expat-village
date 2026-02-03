// src/components/SubscriptionBadge.jsx
// Badge showing current subscription status

import { useSubscription } from '../hooks/useSubscription'

function SubscriptionBadge({ size = 'sm' }) {
  const { plan, loading } = useSubscription()

  if (loading || plan === 'free') return null

  const badges = {
    basic: {
      label: 'Basic',
      bg: 'rgba(139,92,246,0.2)',
      border: 'rgba(139,92,246,0.4)',
      text: 'text-purple-300',
      icon: '⭐',
    },
    premium: {
      label: 'Premium',
      bg: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.2))',
      border: 'rgba(251,191,36,0.4)',
      text: 'text-amber-300',
      icon: '👑',
    },
  }

  const badge = badges[plan]
  if (!badge) return null

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${badge.text} ${sizeClasses[size]}`}
      style={{
        background: badge.bg,
        border: `1px solid ${badge.border}`,
      }}
    >
      <span>{badge.icon}</span>
      <span>{badge.label}</span>
    </span>
  )
}

export default SubscriptionBadge
