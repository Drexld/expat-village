// src/hooks/useDeviceDetection.js
// Hook to detect if user is on mobile or desktop

import { useState, useEffect } from 'react'

export function useDeviceDetection() {
  const [isMobile, setIsMobile] = useState(true) // Default to mobile
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkDevice = () => {
      // Check screen width
      const width = window.innerWidth
      const isMobileWidth = width < 768

      // Check user agent for mobile devices
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)

      // Consider it mobile if either condition is true
      const mobile = isMobileWidth || isMobileUA

      setIsMobile(mobile)
      setIsChecking(false)
    }

    checkDevice()

    // Re-check on window resize
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  return { isMobile, isDesktop: !isMobile, isChecking }
}
