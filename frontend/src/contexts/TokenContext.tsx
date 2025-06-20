import { ReactNode, createContext, useContext, useEffect, useState } from 'react'

import authLink from '../services/spotifyAuthLink'

// Token to be provided.
interface TokenInfo {
  isValid: boolean
  authLink: string
  logout: () => void
}

interface TokenProviderProps {
  children: ReactNode
}

// Create context.
const TokenContext = createContext<TokenInfo | null>(null)
export const useToken = () => useContext(TokenContext)

// Provider.
export const TokenProvider: React.FC<TokenProviderProps> = ({ children }) => {
  const [token, setToken] = useState<TokenInfo | null>(null)
  const [tokenIsValid, setTokenIsValid] = useState(false)

  // Token expiration time (1h)
  const calculateExpirationTime = () => {
    const now = new Date()
    //const expirationTime = new Date(now.getTime() + 5000)
    const expirationTime = new Date(now.getTime() + 60 * 60 * 1000)
    localStorage.setItem('tokenExpirationTime', expirationTime.toISOString())
    return expirationTime
  }

  // Logout
  const logoutCtx = () => {
    localStorage.removeItem('spotifyToken')
    localStorage.removeItem('tokenExpirationTime')
    setToken(null)
  }

  // Set token validity
  useEffect(() => {
    const hash = window.location.hash
    let spotifyToken = window.localStorage.getItem('spotifyToken')
    let storedExpirationTime = window.localStorage.getItem('tokenExpirationTime')

    // For Spotify.
    if (!spotifyToken && hash) {
      spotifyToken =
        hash
          .substring(1)
          .split('&')
          .find((el) => el.startsWith('access_token'))
          ?.split('=')[1] ?? null

      window.location.hash = ''
      localStorage.setItem('spotifyToken', spotifyToken ?? '')
      storedExpirationTime = calculateExpirationTime().toISOString() // Also sets exp time localStorage
    }

    if (storedExpirationTime) {
      let calcExpirationTime = new Date(storedExpirationTime)
      if (calcExpirationTime > new Date()) {
        setTokenIsValid(true)
      } else {
        logoutCtx()
      }
    } else {
      logoutCtx()
    }
  }, [])

  // Update token validity
  useEffect(() => {
    if (token) {
      setToken((prevToken) => ({
        ...(prevToken as TokenInfo),
        isValid: tokenIsValid,
      }))
    }
  }, [tokenIsValid])

  const tokenOrFallback = token ?? {
    isValid: tokenIsValid,
    authLink: authLink,
    logout: logoutCtx,
  }

  return <TokenContext.Provider value={tokenOrFallback}>{children}</TokenContext.Provider>
}
