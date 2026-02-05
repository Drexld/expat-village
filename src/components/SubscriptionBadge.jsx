// src/components/SubscriptionBadge.jsx
// Badge showing current subscription status

import { useSubscription } from '../hooks/useSubscription'
import Icon from './Icon'

function SubscriptionBadge({ size = 'sm' }) {
  const { plan, loading } = useSubscription()

  if (loading || plan === 'free') return null

  const badges = {
    basic: {
      label: 'Basic',
      bg: 'linear-gradient(135deg, rgba(242,166,90,0.25), rgba(246,195,143,0.15))',
      border: 'rgba(242,166,90,0.45)',
      text: 'text-slate-100',
      icon: 'star',
    },
    premium: {
      label: 'Premium',
      bg: 'linear-gradient(135deg, rgba(242,143,123,0.3), rgba(242,166,90,0.18))',
      border: 'rgba(242,143,123,0.5)',
      text: 'text-slate-100',
      icon: 'crown',
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
      className={`glass-chip inline-flex items-center gap-1 rounded-full font-medium ${badge.text} ${sizeClasses[size]}`}
      style={{
        background: badge.bg,
        border: `1px solid ${badge.border}`,
      }}
    >
      <Icon name={badge.icon} size={14} className="text-slate-100" />
      <span>{badge.label}</span>
    </span>
  )
}

export default SubscriptionBadge
