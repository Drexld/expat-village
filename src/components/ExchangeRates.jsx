// src/components/ExchangeRates.jsx
// Exchange rates card component

import { useState, useEffect } from 'react'
import { getExchangeRates, formatRate } from '../services/exchangeRates'
import Icon from './Icon'

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
      <div className="action-card texture-layer texture-paper flex items-center gap-2 rounded-2xl px-4 py-3">
        <Icon name="update" size={14} className="text-terra-taupe" />
        <span className="text-sm text-terra-taupe">Loading rates...</span>
      </div>
    )
  }

  if (!rates) return null

  const currencies = [
    { code: 'EUR', value: rates.eur },
    { code: 'USD', value: rates.usd },
    { code: 'GBP', value: rates.gbp }
  ]

  return (
    <div className="action-card texture-layer texture-paper flex flex-col gap-2 rounded-2xl px-4 py-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon name="globe" size={16} className="text-terra-ink-soft" />
        <span className="text-xs font-semibold text-terra-taupe uppercase tracking-wider">
          Exchange Rates
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {currencies.map((currency) => (
          <div key={currency.code} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-terra-ink">1 PLN</span>
              <span className="text-xs text-terra-taupe">to</span>
              <span className="text-xs font-semibold text-terra-ink-soft">{currency.code}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-terra-ink">
                {formatRate(currency.value)}
              </span>
              <span className="text-[10px] text-terra-taupe">{currency.code}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-[10px] text-terra-taupe text-right mt-1">
        Updated {getTimeAgo(rates.timestamp)}
      </div>
    </div>
  )
}

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
