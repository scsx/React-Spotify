import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { TSpotifyUser } from '@/types/SpotifyUser'
import axios from 'axios'

import { SPOTIFY_AUTH_LOGIN_PATH } from '@/lib/constants'

type TAuthContextValue = {
  isLoggedIn: boolean
  user: TSpotifyUser | null
  checkAuthStatus: () => Promise<void>
  logout: () => void
  authLink: string
  isAuthCheckComplete: boolean
}

const AuthContext = createContext<TAuthContextValue | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [user, setUser] = useState<TSpotifyUser | null>(null)
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState<boolean>(false)
  const authLink = SPOTIFY_AUTH_LOGIN_PATH

  const checkAuthStatus = useCallback(async () => {
    try {
      // Requests a protected endpoint; session cookie is sent automatically.
      const response = await axios.get('/api/spotify/me')
      if (response.status === 200) {
        setIsLoggedIn(true)
        setUser(response.data.user)
      } else {
        setIsLoggedIn(false)
        setUser(null)
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.info('Frontend: Verificação de autenticação - Usuário não logado (401 esperado).')
      } else {
        // Para outros tipos de erro, continua a logar como erro
        console.error('Frontend: Falha na verificação de autenticação:', error)
      }
      setIsLoggedIn(false)
      setUser(null)
    } finally {
      // Garante que isAuthCheckComplete é definido para true após a tentativa,
      // independentemente do sucesso ou falha.
      setIsAuthCheckComplete(true)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      // Calls backend logout endpoint, which should destroy the session.
      await axios.post('/auth/logout')
      setIsLoggedIn(false)
      setUser(null)
      window.location.href = SPOTIFY_AUTH_LOGIN_PATH
    } catch (error) {
      console.error('Frontend: Backend logout failed:', error)
      // Even if backend logout fails, clear frontend state for consistency.
      setIsLoggedIn(false)
      setUser(null)
      window.location.href = SPOTIFY_AUTH_LOGIN_PATH
    }
  }, [])

  useEffect(() => {
    // Dispara a verificação de status de autenticação APENAS UMA VEZ no primeiro mount
    // Não precisa verificar '!isLoggedIn || !user' aqui, porque o objetivo é verificar o status inicial.
    if (!isAuthCheckComplete) {
      checkAuthStatus()
    }
  }, [checkAuthStatus, isAuthCheckComplete])

  const contextValue = React.useMemo(
    () => ({
      isLoggedIn,
      user,
      checkAuthStatus,
      logout,
      authLink,
      isAuthCheckComplete,
    }),
    [isLoggedIn, user, checkAuthStatus, logout, authLink]
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
