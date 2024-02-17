import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react'

const TokenContext = createContext('')
export const useToken = () => useContext(TokenContext)

interface TokenProviderProps {
  children: ReactNode
}

export const TokenProvider: React.FC<TokenProviderProps> = ({ children }) => {
  const [token, setToken] = useState('')

  // Set token.
  useEffect(() => {
    const hash = window.location.hash
    let spotifyToken = window.localStorage.getItem('spotifyToken')

    if (!spotifyToken && hash) {
      spotifyToken =
        hash
          .substring(1)
          .split('&')
          .find((el) => el.startsWith('access_token'))
          ?.split('=')[1] ?? null
      window.location.hash = ''
      window.localStorage.setItem('spotifyToken', spotifyToken ?? '')
    }

    setToken(spotifyToken ?? '')
  }, [])

  // Refresh token.
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('spotifyRefreshToken')
      if (!refreshToken) {
        throw new Error('No refresh token found')
      }

      // Call the Spotify token refresh endpoint.
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        })
      })

      if (!response.ok) {
        throw new Error('Failed to refresh access token')
      }

      const data = await response.json()
      const newAccessToken = data.access_token
      const tokenExpirationTime = new Date().getTime() + data.expires_in * 1000

      // Update the access token in state and storage
      setToken(newAccessToken)
      localStorage.setItem('spotifyToken', newAccessToken)
      localStorage.setItem('spotifyRefreshToken', newAccessToken)
      localStorage.setItem(
        'spotifyTokenExpiration',
        tokenExpirationTime.toString()
      )
    } catch (error) {
      console.error('Error refreshing access token:', error)
    }
  }

  // Call refreshAccessToken() when needed.
  useEffect(() => {
    const tokenExpirationTime = localStorage.getItem('spotifyTokenExpiration')
    if (
      tokenExpirationTime &&
      new Date(parseInt(tokenExpirationTime)) < new Date()
    ) {
      refreshAccessToken()
    }
  }, [])

  return <TokenContext.Provider value={token}>{children}</TokenContext.Provider>
}
