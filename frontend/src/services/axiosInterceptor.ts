import { TSpotifyTokenData } from '@/types/General'
import axios, { AxiosResponse } from 'axios'

import { SPOTIFY_AUTH_LOGIN_PATH } from '@/lib/constants'

// --- Helper function to get token from localStorage ---
const getStoredToken = (): TSpotifyTokenData | null => {
  const storedTokenString = localStorage.getItem('spotifyTokenInfo')
  if (storedTokenString) {
    try {
      const parsedToken: TSpotifyTokenData = JSON.parse(storedTokenString)
      const now = Date.now()
      const expiresAt = parsedToken.obtainedAt + parsedToken.expiresIn * 1000
      if (now < expiresAt) {
        return parsedToken
      }
    } catch (e) {
      console.error('Interceptor: Error getting token from localStorage:', e)
    }
  }
  return null
}

// --- REQUESTS Interceptor ---
axios.interceptors.request.use(
  (config) => {
    const token = getStoredToken()
    if (token && token.accessToken) {
      config.headers['Authorization'] = `Bearer ${token.accessToken}`
    } else {
      // No valid token, do not add authorization header.
      console.log('Interceptor: No valid token found for the request.')
    }
    return config
  },
  (error) => {
    console.error('Interceptor: Outgoing request failed:', error)
    return Promise.reject(error)
  }
)

// --- RESPONSES Interceptor ---
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error) => {
    console.error('Interceptor: Error in request response:', error)
    const originalRequest = error.config

    // If 401 Unauthorized error and not already retrying
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true // Mark request as retried

      console.log('Interceptor: Received 401. Token likely invalid/expired.')

      // Remove token to force a new login
      localStorage.removeItem('spotifyTokenInfo')
      console.log('Interceptor: Token removed from localStorage.')

      // Redirect to Spotify authentication
      // Use window.location.href for full browser redirect to re-initiate login flow
      window.location.href = SPOTIFY_AUTH_LOGIN_PATH // Use the centralized constant

      // Return a Promise that never resolves to stop current request execution
      return new Promise(() => {})
    }

    // For other errors, propagate the error.
    return Promise.reject(error)
  }
)
