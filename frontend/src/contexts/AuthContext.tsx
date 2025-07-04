import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import axios from 'axios'

import { SPOTIFY_AUTH_LOGIN_PATH } from '@/lib/constants'

type TUser = {
  id: string
  display_name: string
  email?: string
}

type TAuthContextValue = {
  isLoggedIn: boolean
  user: TUser | null
  checkAuthStatus: () => Promise<void>
  logout: () => void
  authLink: string
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
  const [user, setUser] = useState<TUser | null>(null)
  const authLink = SPOTIFY_AUTH_LOGIN_PATH

  const checkAuthStatus = useCallback(async () => {
    try {
      // Requests a protected endpoint; session cookie is sent automatically.
      const response = await axios.get('/api/spotify/me')
      if (response.status === 200) {
        setIsLoggedIn(true)
        setUser(response.data)
      } else {
        setIsLoggedIn(false)
        setUser(null)
      }
    } catch (error) {
      // Axios interceptor likely handles 401 errors. For others, assume not logged in.
      console.error('Frontend: Authentication status check failed:', error);
      setIsLoggedIn(false)
      setUser(null)
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
      console.error('Frontend: Backend logout failed:', error);
      // Even if backend logout fails, clear frontend state for consistency.
      setIsLoggedIn(false)
      setUser(null)
      window.location.href = SPOTIFY_AUTH_LOGIN_PATH
    }
  }, [])

  useEffect(() => {
    // Check auth status on component mount or if user/login state is incomplete
    if (!isLoggedIn || !user) {
      checkAuthStatus()
    }
  }, [isLoggedIn, user, checkAuthStatus])

  const contextValue = React.useMemo(
    () => ({
      isLoggedIn,
      user,
      checkAuthStatus,
      logout,
      authLink,
    }),
    [isLoggedIn, user, checkAuthStatus, logout, authLink]
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
