// src/components/ExchangeRates.jsx
// Exchange rates card component

import { useState, useEffect } from 'react'
import { getExchangeRates, formatRate } from '../services/exchangeRates'

function ExchangeRates() {
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRates() {
      try {
        const data = await getExchangeRates()
        setRates(data)
      } catch (error) {
        console.error('Error fetching exchange rates:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchRates()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl" style={{
        background: "rgba(30,27,75,0.5)",
        border: "1px solid rgba(139,92,246,0.2)",
      }}>
        <span className="text-sm text-slate-400">Loading rates...</span>
      </div>
    )
  }

  if (!rates) return null

  const currencies = [
    { code: 'EUR', symbol: '€', value: rates.eur, flag: '🇪🇺' },
    { code: 'USD', symbol: '$', value: rates.usd, flag: '🇺🇸' },
    { code: 'GBP', symbol: '£', value: rates.gbp, flag: '🇬🇧' }
  ]

  return (
    <div className="flex flex-col gap-2 px-4 py-3 rounded-2xl" style={{
      background: "rgba(30,27,75,0.5)",
      border: "1px solid rgba(139,92,246,0.2)",
      backdropFilter: "blur(8px)",
    }}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">💱</span>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Exchange Rates
        </span>
      </div>

      {/* Rates */}
      <div className="flex flex-col gap-1.5">
        {currencies.map((currency) => (
          <div key={currency.code} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">{currency.flag}</span>
              <span className="text-sm font-medium text-slate-300">
                1 PLN
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white">
                {formatRate(currency.value)}
              </span>
              <span className="text-xs text-slate-400">
                {currency.code}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Updated time */}
      <div className="text-[10px] text-slate-500 text-right mt-1">
        Updated {getTimeAgo(rates.timestamp)}
      </div>
    </div>
  )
}

/**
 * Helper to show time ago
 */
function getTimeAgo(timestamp) {
  const minutes = Math.floor((Date.now() - timestamp) / 60000)

  if (minutes < 1) return 'just now'
  if (minutes === 1) return '1 min ago'
  if (minutes < 60) return `${minutes} mins ago`

  const hours = Math.floor(minutes / 60)
  if (hours === 1) return '1 hour ago'
  return `${hours} hours ago`
}

export default ExchangeRates
