import axios, { AxiosResponse } from 'axios'

import { SPOTIFY_AUTH_LOGIN_PATH } from '@/lib/constants'

// Ensure cookies are sent with cross-origin requests
axios.defaults.withCredentials = true

/**
 * Axios Response Interceptor for handling authentication errors.
 * Redirects to Spotify login path on 401 Unauthorized errors.
 */
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // If 401 Unauthorized error and not already retrying
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true // Mark request as retried

      // Redirect to Spotify authentication to re-initiate login flow
      window.location.href = SPOTIFY_AUTH_LOGIN_PATH

      // Return a Promise that never resolves to stop current request execution
      return new Promise(() => {})
    }

    // For other errors, propagate the error.
    return Promise.reject(error)
  }
)
