import axios, { AxiosResponse } from 'axios'

// Ensure cookies are sent with cross-origin requests
axios.defaults.withCredentials = true

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error) => {
    // For other errors, propagate the error.
    return Promise.reject(error)
  }
)
