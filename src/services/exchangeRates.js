// src/services/exchangeRates.js
// Exchange rate API integration using Frankfurter (ECB data)

const CACHE_KEY = 'expat_village_exchange_rates'
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour (rates don't change often)

/**
 * Fetches exchange rates for 1 PLN to major currencies
 * Returns: { eur, usd, gbp, timestamp }
 */
export async function getExchangeRates() {
  // Check cache first
  const cached = getFromCache()
  if (cached) {
    console.log('Using cached exchange rates:', cached)
    return cached
  }

  // Fetch fresh data
  try {
    // Frankfurter API: Get rates with PLN as base currency
    const url = 'https://api.frankfurter.app/latest?from=PLN&to=EUR,USD,GBP'

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Exchange rate API error: ${response.status}`)
    }

    const data = await response.json()

    const rates = {
      eur: data.rates.EUR,
      usd: data.rates.USD,
      gbp: data.rates.GBP,
      timestamp: Date.now()
    }

    // Cache the result
    saveToCache(rates)

    console.log('Fetched exchange rates:', rates)

    return rates
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error)
    // Return fallback rates (approximate)
    return getFallbackRates()
  }
}

/**
 * Returns fallback exchange rates
 */
function getFallbackRates() {
  return {
    eur: 0.23,
    usd: 0.25,
    gbp: 0.20,
    timestamp: Date.now()
  }
}

/**
 * Cache helpers
 */
function getFromCache() {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null

    const data = JSON.parse(cached)
    const age = Date.now() - data.timestamp

    if (age < CACHE_DURATION) {
      return data
    }

    // Cache expired
    localStorage.removeItem(CACHE_KEY)
    return null
  } catch (error) {
    console.error('Cache read error:', error)
    return null
  }
}

function saveToCache(rates) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(rates))
  } catch (error) {
    console.error('Cache write error:', error)
  }
}

/**
 * Clear exchange rate cache (useful for testing)
 */
export function clearExchangeRatesCache() {
  localStorage.removeItem(CACHE_KEY)
  console.log('Exchange rates cache cleared')
}

/**
 * Format rate for display (2 decimal places)
 */
export function formatRate(rate) {
  return rate.toFixed(2)
}
