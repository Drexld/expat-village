// src/pages/Pricing.jsx
// Premium tiers pricing page with Stripe Checkout integration

import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useSubscription } from '../hooks/useSubscription'
import { createCheckoutSession, PLAN_FEATURES } from '../services/subscription'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Perfect for getting started',
    features: PLAN_FEATURES.free.features,
    highlighted: false,
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 9,
    description: 'For active expats',
    features: PLAN_FEATURES.basic.features,
    highlighted: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19,
    description: 'The complete experience',
    features: PLAN_FEATURES.premium.features,
    highlighted: true,
  },
]

function Pricing() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, isAuthenticated, openAuthModal } = useAuth()
  const { plan: currentPlan, loading: subLoading } = useSubscription()
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState(null)

  const canceled = searchParams.get('canceled')

  const handleSelectPlan = async (planId) => {
    console.log('Button clicked:', planId, { isAuthenticated, subLoading, currentPlan })

    if (planId === 'free') return

    if (!isAuthenticated) {
      openAuthModal('sign_up')
      return
    }

    setLoading(planId)
    setError(null)

    const { data, error: checkoutError } = await createCheckoutSession(
      planId,
      user.id,
      user.email
    )

    if (checkoutError) {
      setError(checkoutError)
      setLoading(null)
      return
    }

    // Redirect to Stripe Checkout
    if (data?.url) {
      window.location.href = data.url
    }
  }

  const isCurrentPlan = (planId) => currentPlan === planId
  const isUpgrade = (planId) => {
    const order = ['free', 'basic', 'premium']
    return order.indexOf(planId) > order.indexOf(currentPlan)
  }

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h1 className="text-3xl font-bold text-white">Choose Your Plan</h1>
        <p className="text-slate-400 text-lg mt-2">
          Unlock premium features to make the most of your expat journey
        </p>
      </div>

      {/* Canceled notice */}
      {canceled && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
          Checkout was canceled. Feel free to try again when you're ready.
        </div>
      )}

      {/* Error notice */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400">
          {error}
        </div>
      )}

      {/* Pricing Cards */}
      <div className="space-y-4 mb-8">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-3xl p-6 transition-all ${
              plan.highlighted
                ? 'bg-gradient-to-br from-purple-900/40 to-violet-900/30 border-2 border-purple-500/50'
                : 'bg-slate-800/50 border border-slate-700'
            }`}
          >
            {/* Popular badge */}
            {plan.highlighted && (
              <div className="absolute -top-3 left-6 px-4 py-1 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full text-xs font-semibold text-white">
                Most Popular
              </div>
            )}

            <div className="flex items-start justify-between gap-4">
              {/* Plan info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-white">{plan.name}</h2>
                  {isCurrentPlan(plan.id) && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-sm mb-3">{plan.description}</p>

                {/* Features (collapsed on mobile) */}
                <ul className="space-y-1.5">
                  {plan.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                      <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.features.length > 3 && (
                    <li className="text-xs text-slate-500 ml-6">
                      +{plan.features.length - 3} more features
                    </li>
                  )}
                </ul>
              </div>

              {/* Price & CTA */}
              <div className="text-right flex flex-col items-end">
                <div className="mb-3">
                  <span className="text-3xl font-bold text-white">
                    {plan.price === 0 ? 'Free' : `€${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-slate-400 text-sm">/mo</span>
                  )}
                </div>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={loading === plan.id || isCurrentPlan(plan.id) || subLoading}
                  className={`px-6 py-2.5 rounded-xl font-semibold transition-all text-sm whitespace-nowrap ${
                    isCurrentPlan(plan.id)
                      ? 'bg-slate-700 text-slate-400 cursor-default'
                      : plan.highlighted
                      ? 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white'
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }`}
                >
                  {loading === plan.id ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing
                    </span>
                  ) : isCurrentPlan(plan.id) ? (
                    'Current'
                  ) : isUpgrade(plan.id) ? (
                    'Upgrade'
                  ) : (
                    'Select'
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ / Guarantees */}
      <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-white font-medium">Can I cancel anytime?</p>
            <p className="text-slate-400">Yes! You can cancel your subscription at any time. You'll keep access until the end of your billing period.</p>
          </div>
          <div>
            <p className="text-white font-medium">What payment methods do you accept?</p>
            <p className="text-slate-400">We accept all major credit cards, debit cards, and many local payment methods through Stripe.</p>
          </div>
          <div>
            <p className="text-white font-medium">Is there a refund policy?</p>
            <p className="text-slate-400">We offer a 7-day money-back guarantee. If you're not satisfied, contact us for a full refund.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pricing
