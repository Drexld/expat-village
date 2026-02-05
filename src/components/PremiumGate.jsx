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
        <div className="w-6 h-6 border-2 border-slate-500/40 border-t-slate-200 rounded-full animate-spin" />
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
            ? 'radial-gradient(circle, rgba(194,177,217,0.7), transparent 70%)'
            : 'radial-gradient(circle, rgba(154,163,255,0.6), transparent 70%)',
        }}
      />

      <div className="relative flex flex-col items-center gap-3">
        <div className="glass-panel flex h-14 w-14 items-center justify-center rounded-2xl">
          <Icon name={isPremium ? 'crown' : 'star'} size={26} className="text-slate-100" />
        </div>

        <h3 className="text-xl font-semibold text-white">
          {isPremium ? 'Premium Feature' : 'Basic Feature'}
        </h3>

        <p className="text-sm text-slate-300">
          {feature} requires a {isPremium ? 'Premium' : 'Basic'} subscription.
        </p>

        {isAuthenticated ? (
          <Link
            to="/pricing"
            className="glass-chip inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition hover:text-white"
          >
            Upgrade to {isPremium ? 'Premium' : 'Basic'}
            <Icon name="arrowRight" size={16} className="text-slate-200" />
          </Link>
        ) : (
          <button
            onClick={() => openAuthModal('sign_up')}
            className="glass-chip inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition hover:text-white"
          >
            Sign up to unlock
            <Icon name="arrowRight" size={16} className="text-slate-200" />
          </button>
        )}

        <p className="text-xs text-slate-400">
          Starting at EUR 9/month. Cancel anytime.
        </p>
      </div>
    </div>
  )
}

export default PremiumGate
