import { TSpotifyTokenData } from '@/types/General'
import axios, { AxiosResponse } from 'axios'

import authLink from '@/services/spotify/spotifyAuthLink'

// --- Função auxiliar para obter o token do localStorage ---
// Como o interceptor não é um componente React, não pode usar 'useToken()'.
// Precisa de ler diretamente do localStorage.
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
      console.error('Interceptor: Erro ao analisar token do localStorage:', e)
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
      console.log('Interceptor: Token adicionado ao cabeçalho da requisição.')
    } else {
      // Se não há token válido, não adicione cabeçalho de autorização.
      // A lógica de redirecionamento para login ficará no response interceptor para 401.
      console.log('Interceptor: Nenhum token válido encontrado para a requisição.')
    }
    return config
  },
  (error) => {
    console.error('Interceptor: Falha na requisição de saída:', error)
    return Promise.reject(error)
  }
)

// --- RESPONSES Interceptor ---
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    // Se a resposta for 200, está tudo bem.
    return response
  },
  async (error) => {
    console.error('Interceptor: Erro na resposta da requisição:', error)
    const originalRequest = error.config

    // Se o erro é 401 Unauthorized e não é uma requisição que já estamos a tentar renovar
    // (A flag '_retry' é para evitar loops de retentativa para a mesma requisição)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true // Marca a requisição como retentada

      console.log('Interceptor: Recebido 401. Token provavelmente inválido/expirado.')

      // Remove o token do localStorage para forçar um novo login
      localStorage.removeItem('spotifyTokenInfo')
      console.log('Interceptor: Token removido do localStorage.')

      // Redireciona para a página de autenticação do Spotify
      // Usamos window.location.href para garantir um redirecionamento completo do navegador
      // Isso irá acionar o fluxo de login novamente.
      window.location.href = authLink

      // Retorna uma Promise que nunca resolve para parar a execução da requisição atual.
      // Isso impede que qualquer código subsequente que chamou o axios execute com o erro 401.
      return new Promise(() => {}) // Essencial para parar o loop imediato
    }

    // Para outros erros (não 401, ou 401 que já foi tentado renovar), propaga o erro.
    return Promise.reject(error)
  }
)
