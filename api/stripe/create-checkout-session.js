// api/stripe/create-checkout-session.js
// Creates a Stripe Checkout Session for subscription purchases

/* global process */
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const PRICE_IDS = {
  basic: process.env.STRIPE_PRICE_BASIC_MONTHLY,
  premium: process.env.STRIPE_PRICE_PREMIUM_MONTHLY,
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { plan, userId, email, successUrl, cancelUrl } = req.body

    // Validate required fields
    if (!plan || !userId || !email) {
      return res.status(400).json({ error: 'Missing required fields: plan, userId, email' })
    }

    // Validate plan type
    if (!PRICE_IDS[plan]) {
      return res.status(400).json({ error: 'Invalid plan. Must be "basic" or "premium"' })
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Check if user already has a Stripe customer ID
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single()

    let customerId = existingSubscription?.stripe_customer_id

    // Create or retrieve Stripe customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: { supabase_user_id: userId }
      })
      customerId = customer.id
    }

    // Get the origin for redirect URLs
    const origin = req.headers.origin || 'https://expat-village.vercel.app'

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRICE_IDS[plan],
          quantity: 1,
        },
      ],
      success_url: successUrl || `${origin}/settings?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: cancelUrl || `${origin}/pricing?canceled=true`,
      subscription_data: {
        metadata: {
          supabase_user_id: userId,
          plan: plan,
        },
      },
      metadata: {
        supabase_user_id: userId,
        plan: plan,
      },
    })

    return res.status(200).json({
      data: {
        sessionId: session.id,
        url: session.url
      },
      error: null
    })
  } catch (error) {
    console.error('Checkout session error:', error)
    return res.status(500).json({
      data: null,
      error: error.message
    })
  }
}
