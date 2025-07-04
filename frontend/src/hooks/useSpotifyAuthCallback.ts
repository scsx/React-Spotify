// frontend/src/hooks/useSpotifyAuthCallback.ts
import { useEffect, useRef } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '@/contexts/AuthContext'

export const useSpotifyAuthCallback = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { checkAuthStatus } = useAuth()

  const hasProcessedThisLoad = useRef(false)

  useEffect(() => {
    let isSpotifyCallback = false
    let redirectError: string | null = null

    const searchParams = new URLSearchParams(location.search)
    const errorFromSearch = searchParams.get('error')

    if (errorFromSearch) {
      redirectError = errorFromSearch
      isSpotifyCallback = true
    }

    if (!isSpotifyCallback && location.hash) {
      const hashParams = new URLSearchParams(location.hash.substring(1))
      const errorFromHash = hashParams.get('error')

      if (errorFromHash) {
        redirectError = errorFromHash
        isSpotifyCallback = true
      }
    }

    // Assume successful login if redirected to root path without explicit error
    if (location.pathname === '/' && !redirectError) {
      isSpotifyCallback = true
      checkAuthStatus() // Update auth status via backend check
    }

    // Process callback only once per load
    if (isSpotifyCallback && !hasProcessedThisLoad.current) {
      if (redirectError) {
        // Handle specific error display for the user if needed
      }

      hasProcessedThisLoad.current = true
      // Clean URL and redirect to main page after processing
      navigate('/', { replace: true })
    }
  }, [location, checkAuthStatus, navigate])
}
