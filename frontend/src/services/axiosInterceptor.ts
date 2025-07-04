import axios, { AxiosResponse } from 'axios'

import { SPOTIFY_AUTH_LOGIN_PATH } from '@/lib/constants'

axios.defaults.withCredentials = true

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

      // TODO: Remove later, localStorage is not going to be used.
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
