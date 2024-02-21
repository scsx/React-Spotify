import axios, { AxiosResponse } from 'axios'
import authLink from '@/services/spotifyAuthLink'

// REQUESTS.
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('spotifyToken')
    const storedDateString = localStorage.getItem('tokenExpirationTime')
    let storedDate: Date | null = null

    if (storedDateString) {
      storedDate = new Date(storedDateString)
    }

    if (storedDate && !isNaN(storedDate.getTime())) {
      const currentDate = new Date()

      if (currentDate.getTime() > storedDate.getTime()) {
        console.log('Token expired, redirecting')
        // Redirect user to authenticate
        window.location.href = authLink
      }
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    // We have to return the config object
    return config
  },
  (error) => {
    console.log('Failed on the outgoing.')
    return Promise.reject(error)
  }
)

// RESPONSES.
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status == 200) {
      // Do something, its ok.
    }
    return response
  },
  (error) => {
    console.error('axios.interceptors.response.use error:', error)
    if (error.response.status === 401) {
      window.location.href = authLink
    }
    // Return a rejected Promise to propagate the error if not 401.
    return Promise.reject(error)
  }
)
