import { ReactNode, createContext, useContext, useEffect, useState } from 'react'

import authLink from '../services/spotify/spotifyAuthLink'

// Token to be provided.
export interface TTokenInfo {
  isValid: boolean
  authLink: string
  logout: () => void
  accessToken: string | null
}

interface TTokenProviderProps {
  children: ReactNode
}

// Create context.
const TokenContext = createContext<TTokenInfo | null>(null)
export const useToken = () => useContext(TokenContext)

// Provider.
export const TokenProvider: React.FC<TTokenProviderProps> = ({ children }) => {
  const [tokenInfo, setTokenInfo] = useState<TTokenInfo | null>(null)

  // Token expiration time (1h)
  const calculateExpirationTime = () => {
    const now = new Date()
    const expirationTime = new Date(now.getTime() + 60 * 60 * 1000)
    localStorage.setItem('tokenExpirationTime', expirationTime.toISOString())
    return expirationTime
  }

  // Logout
  const logoutCtx = () => {
    localStorage.removeItem('spotifyToken')
    localStorage.removeItem('tokenExpirationTime')
    setTokenInfo(null)
  }

  // Set token validity
  useEffect(() => {
    const hash = window.location.hash
    let accessTokenFromStorage = localStorage.getItem('spotifyToken')
    let tokenFromHash: string | null = null

    // 1. Lógica para extrair o token do URL hash (novo login)
    if (hash) {
      tokenFromHash =
        hash
          .substring(1) // Remove o '#'
          .split('&')
          .find((el) => el.startsWith('access_token'))
          ?.split('=')[1] ?? null

      // Limpa o hash do URL para não ficar visível e para que não tente reprocessar a cada refresh
      window.location.hash = ''

      if (tokenFromHash) {
        localStorage.setItem('spotifyToken', tokenFromHash) // Armazena o novo token
        calculateExpirationTime() // Calcula e armazena o novo tempo de expiração
        accessTokenFromStorage = tokenFromHash // Usa o token recém-obtido para o estado atual
      }
    }

    // 2. Lógica para verificar a validade do token (existente ou recém-obtido)
    let currentAccessToken = accessTokenFromStorage
    let isCurrentlyValid = false
    let storedExpirationTime = localStorage.getItem('tokenExpirationTime')

    if (currentAccessToken && storedExpirationTime) {
      const expirationDate = new Date(storedExpirationTime)
      if (expirationDate > new Date()) {
        isCurrentlyValid = true // Token é válido
      } else {
        // Token expirado
        console.log('Spotify token expired. Logging out.')
        logoutCtx() // Realiza o logout (limpa localStorage, define setTokenInfo(null))
        currentAccessToken = null // Garante que o token no estado seja null
      }
    } else if (currentAccessToken) {
      // Token existe mas sem tempo de expiração (erro ou inconsistência)
      console.log('Spotify token found but no expiration time. Logging out.')
      logoutCtx()
      currentAccessToken = null
    } else {
      // Não há token
      isCurrentlyValid = false
      currentAccessToken = null
    }

    // 3. Define o estado do contexto
    setTokenInfo({
      isValid: isCurrentlyValid,
      authLink: authLink,
      logout: logoutCtx,
      accessToken: currentAccessToken,
    })
  }, [])

  return <TokenContext.Provider value={tokenInfo}>{children}</TokenContext.Provider>
}
