// src/services/weather.js
// OpenWeatherMap API integration for Warsaw weather

const WARSAW_LAT = 52.2297
const WARSAW_LON = 21.0122
const CACHE_KEY = 'expat_village_weather'
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

/**
 * Fetches current weather data for Warsaw from OpenWeatherMap
 * Returns object with: { state, temp, condition, icon }
 */
export async function getWarsawWeather() {
  // Check cache first
  const cached = getFromCache()
  if (cached) {
    console.log('Using cached weather:', cached)
    return cached
  }

  // Fetch fresh data
  try {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY
    if (!apiKey) {
      console.warn('Weather API key not found, using fallback')
      return getFallbackWeatherData()
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${WARSAW_LAT}&lon=${WARSAW_LON}&appid=${apiKey}&units=metric`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }

    const data = await response.json()
    const weatherData = {
      state: mapToWeatherState(data),
      temp: Math.round(data.main.temp),
      condition: data.weather[0].description,
      icon: getWeatherIcon(data.weather[0].main)
    }

    // Cache the result
    saveToCache(weatherData)

    console.log('Fetched weather:', weatherData)

    return weatherData
  } catch (error) {
    console.error('Failed to fetch weather:', error)
    // Return fallback data
    return getFallbackWeatherData()
  }
}

/**
 * Maps OpenWeatherMap data to our weather states
 */
function mapToWeatherState(data) {
  const temp = data.main.temp
  const condition = data.weather[0].main.toLowerCase()
  const isNight = isNightTime(data.sys.sunrise, data.sys.sunset, data.dt)

  // Night time (clear or slightly cloudy)
  if (isNight) {
    return 'night'
  }

  // Cold weather (below 5°C)
  if (temp < 5) {
    return 'cold'
  }

  // Cloudy/rainy/overcast
  if (condition.includes('cloud') || condition.includes('rain') || condition.includes('drizzle')) {
    return 'cloudy'
  }

  // Sunny/clear
  if (condition.includes('clear') || condition.includes('sun')) {
    return 'sunny'
  }

  // Snow
  if (condition.includes('snow')) {
    return 'cold'
  }

  // Default to cloudy
  return 'cloudy'
}

/**
 * Checks if current time is night (between sunset and sunrise)
 */
function isNightTime(sunrise, sunset, current) {
  const now = current * 1000 // Convert to milliseconds
  const sunriseTime = sunrise * 1000
  const sunsetTime = sunset * 1000

  return now < sunriseTime || now > sunsetTime
}

/**
 * Returns fallback weather data based on current time
 */
function getFallbackWeatherData() {
  const hour = new Date().getHours()

  // Night: 10pm - 6am
  if (hour >= 22 || hour < 6) {
    return { state: 'night', temp: -5, condition: 'Clear night', icon: '🌙' }
  }

  // Default to cloudy during day
  return { state: 'cloudy', temp: 8, condition: 'Partly cloudy', icon: '🌤️' }
}

/**
 * Maps OpenWeatherMap condition to emoji icon
 */
function getWeatherIcon(condition) {
  const conditionLower = condition.toLowerCase()

  if (conditionLower.includes('clear')) return '☀️'
  if (conditionLower.includes('cloud')) return '🌤️'
  if (conditionLower.includes('rain')) return '🌧️'
  if (conditionLower.includes('drizzle')) return '🌦️'
  if (conditionLower.includes('snow')) return '❄️'
  if (conditionLower.includes('thunder')) return '⛈️'
  if (conditionLower.includes('mist') || conditionLower.includes('fog')) return '🌫️'

  return '🌤️' // Default
}

/**
 * Cache helpers
 */
function getFromCache() {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null

    const { state, timestamp } = JSON.parse(cached)
    const age = Date.now() - timestamp

    if (age < CACHE_DURATION) {
      return state
    }

    // Cache expired
    localStorage.removeItem(CACHE_KEY)
    return null
  } catch (error) {
    console.error('Cache read error:', error)
    return null
  }
}

function saveToCache(state) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      state,
      timestamp: Date.now()
    }))
  } catch (error) {
    console.error('Cache write error:', error)
  }
}

/**
 * Clear weather cache (useful for testing)
 */
export function clearWeatherCache() {
  localStorage.removeItem(CACHE_KEY)
  console.log('Weather cache cleared')
}
