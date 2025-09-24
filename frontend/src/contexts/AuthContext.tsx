import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { useLocation, useNavigate } from 'react-router-dom'

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

  const navigate = useNavigate()
  const location = useLocation()

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await axios.get('/api/spotify/me') // A bit flimsy.
      if (response.status === 200) {
        setIsLoggedIn(true)
        setUser(response.data.user)
      } else {
        setIsLoggedIn(false)
        setUser(null)
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.info('Auth check: User not logged in (401 expected).')
        setIsLoggedIn(false)
        setUser(null)

        // Redirect to login path only if not already there, to prevent loop
        if (location.pathname !== SPOTIFY_AUTH_LOGIN_PATH) {
          console.log(`Redirecting from ${location.pathname} to ${SPOTIFY_AUTH_LOGIN_PATH}`)
          navigate(SPOTIFY_AUTH_LOGIN_PATH)
        }
      } else {
        console.error('Auth check failed:', error)
        setIsLoggedIn(false)
        setUser(null)
      }
    } finally {
      setIsAuthCheckComplete(true)
    }
  }, [navigate, location.pathname]) 

  const logout = useCallback(async () => {
    try {
      await axios.post('/auth/logout')
      setIsLoggedIn(false)
      setUser(null)
      // Force full page reload for complete session clear after logout
      window.location.href = SPOTIFY_AUTH_LOGIN_PATH
    } catch (error) {
      console.error('Backend logout failed:', error)
      setIsLoggedIn(false)
      setUser(null)
      window.location.href = SPOTIFY_AUTH_LOGIN_PATH
    }
  }, [])

  useEffect(() => {
    // Perform initial auth status check once on component mount
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
    // Dependencies include values that change and are part of the context
    [isLoggedIn, user, checkAuthStatus, logout, authLink, isAuthCheckComplete]
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
