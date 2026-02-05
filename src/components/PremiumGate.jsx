// src/components/PremiumGate.jsx
// Component for gating premium features

import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useSubscription } from '../hooks/useSubscription'
import Icon from './Icon'

/**
 * PremiumGate - Wraps content that requires a specific plan
 *
 * @param {string} requiredPlan - 'basic' or 'premium'
 * @param {string} feature - Feature name for display (e.g., "Unlimited Document Analysis")
 * @param {ReactNode} children - Content to show if user has access
 * @param {ReactNode} fallback - Optional custom fallback UI
 */
function PremiumGate({
  requiredPlan = 'premium',
  feature = 'this feature',
  children,
  fallback
}) {
  const { isAuthenticated, openAuthModal } = useAuth()
  const { plan, loading } = useSubscription()

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-6 h-6 border-2 border-terra-taupe/60 border-t-terra-primary rounded-full animate-spin" />
      </div>
    )
  }

  const planOrder = ['free', 'basic', 'premium']
  const hasAccess = planOrder.indexOf(plan) >= planOrder.indexOf(requiredPlan)

  if (hasAccess) {
    return children
  }

  if (fallback) {
    return fallback
  }

  const isPremium = requiredPlan === 'premium'

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 text-center glass-3d">
      <div
        className="absolute -top-16 -right-10 h-40 w-40 rounded-full opacity-25"
        style={{
          background: isPremium
            ? 'radial-gradient(circle, rgba(199,107,85,0.7), transparent 70%)'
            : 'radial-gradient(circle, rgba(210,160,115,0.6), transparent 70%)',
        }}
      />

      <div className="relative flex flex-col items-center gap-3">
        <div className="glass-panel flex h-14 w-14 items-center justify-center rounded-2xl">
          <Icon name={isPremium ? 'crown' : 'star'} size={26} className="text-terra-primary" />
        </div>

        <h3 className="text-xl font-semibold text-terra-ink">
          {isPremium ? 'Premium Feature' : 'Basic Feature'}
        </h3>

        <p className="text-sm text-terra-ink-soft">
          {feature} requires a {isPremium ? 'Premium' : 'Basic'} subscription.
        </p>

        {isAuthenticated ? (
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-terra-bg transition hover-tilt"
            style={{ background: 'linear-gradient(135deg, #C76B55, #D07C63)' }}
          >
            Upgrade to {isPremium ? 'Premium' : 'Basic'}
            <Icon name="arrowRight" size={16} className="text-terra-bg" />
          </Link>
        ) : (
          <button
            onClick={() => openAuthModal('sign_up')}
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-terra-bg transition hover-tilt"
            style={{ background: 'linear-gradient(135deg, #C76B55, #D07C63)' }}
          >
            Sign up to unlock
            <Icon name="arrowRight" size={16} className="text-terra-bg" />
          </button>
        )}

        <p className="text-xs text-terra-taupe">
          Starting at EUR 9/month. Cancel anytime.
        </p>
      </div>
    </div>
  )
}

export default PremiumGate
