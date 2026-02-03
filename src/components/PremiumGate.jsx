// src/components/PremiumGate.jsx
// Component for gating premium features

import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useSubscription } from '../hooks/useSubscription'

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

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Check if user has required plan
  const planOrder = ['free', 'basic', 'premium']
  const hasAccess = planOrder.indexOf(plan) >= planOrder.indexOf(requiredPlan)

  // User has access - render children
  if (hasAccess) {
    return children
  }

  // Custom fallback provided
  if (fallback) {
    return fallback
  }

  // Default upgrade prompt
  return (
    <div className="relative overflow-hidden rounded-3xl p-6 text-center"
      style={{
        background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(30,27,75,0.8))',
        border: '1px solid rgba(139,92,246,0.3)',
      }}
    >
      {/* Decorative gradient */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.8), transparent)' }}
      />

      <div className="relative">
        <span className="text-5xl mb-4 block">
          {requiredPlan === 'premium' ? '👑' : '⭐'}
        </span>

        <h3 className="text-xl font-bold text-white mb-2">
          {requiredPlan === 'premium' ? 'Premium Feature' : 'Basic Feature'}
        </h3>

        <p className="text-slate-300 mb-4">
          {feature} requires a {requiredPlan === 'premium' ? 'Premium' : 'Basic'} subscription.
        </p>

        {isAuthenticated ? (
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
            }}
          >
            Upgrade to {requiredPlan === 'premium' ? 'Premium' : 'Basic'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <button
            onClick={() => openAuthModal('sign_up')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
            }}
          >
            Sign Up to Unlock
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        <p className="text-slate-500 text-xs mt-4">
          Starting at €9/month. Cancel anytime.
        </p>
      </div>
    </div>
  )
}

export default PremiumGate
