import axios, { AxiosResponse } from 'axios'

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('spotifyToken')
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

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('Response data:', response.data)

    /* if (response.status !== 200) {
      console.log('Refresh token')
      console.log('Error:', response.statusText)
    } */

    if (response.status === 401) {
      console.log('Error 401:', response.statusText)
      console.log('Refresh token')
    }

    return response
  },
  (error) => {
    // Handle request errors
    console.error('axios.interceptors.response.use error:', error)

    // Return a rejected Promise to propagate the error
    return Promise.reject(error)
  }
)
