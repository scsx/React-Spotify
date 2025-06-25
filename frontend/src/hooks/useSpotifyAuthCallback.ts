import { useEffect, useRef } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'

import { useToken } from '@/contexts/TokenContext'

export const useSpotifyAuthCallback = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setToken } = useToken()

  const hasProcessedThisLoad = useRef(false)

  useEffect(() => {
    if (hasProcessedThisLoad.current) {
      return
    }

    let tokenData = null
    let isSpotifyCallback = false

    // --- Check for token in URL Hash (Spotify's recommended way) ---
    if (location.hash && location.hash.includes('access_token=')) {
      const params = new URLSearchParams(location.hash.substring(1))
      const accessToken = params.get('access_token')
      const expiresIn = params.get('expires_in')
      const tokenType = params.get('token_type')

      if (accessToken && expiresIn && tokenType) {
        tokenData = {
          accessToken,
          expiresIn: parseInt(expiresIn, 10),
          tokenType,
          obtainedAt: Date.now(),
        }
        isSpotifyCallback = true
      }
    }

    // --- Process and redirect if a Spotify callback was detected ---
    if (isSpotifyCallback && tokenData) {
      setToken(tokenData)
      hasProcessedThisLoad.current = true
      window.location.hash = ''
      navigate('/', { replace: true })
    } else if (location.pathname === '/' && !location.hash && !tokenData) {
      hasProcessedThisLoad.current = false
    }
  }, [location, setToken, navigate])
}
