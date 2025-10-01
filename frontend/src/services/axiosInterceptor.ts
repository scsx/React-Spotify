import axios, { AxiosResponse } from 'axios'

// Variável para armazenar a função de logout do AuthProvider.
let onLogoutCallback: (() => void) | null = null

// Função exportada para o AuthProvider definir o callback.
export const setLogoutCallback = (callback: () => void) => {
  onLogoutCallback = callback
}

// Ensure cookies are sent with cross-origin requests
axios.defaults.withCredentials = true

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error) => {
    // Verifica se há uma resposta e se o status é 401
    if (error.response && error.response.status === 401) {
      console.error('Interceptor: Detetado erro 401 (Não Autorizado). Forçando Logout.')

      // Chama o logout injetado pelo AuthProvider
      if (onLogoutCallback) {
        onLogoutCallback()
      }
    }

    return Promise.reject(error)
  }
)
