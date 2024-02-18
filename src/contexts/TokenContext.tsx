import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react'

interface TokenInfo {
  isValid: boolean
  authLink: string
}

const TokenContext = createContext<TokenInfo | null>(null)
export const useToken = () => useContext(TokenContext)

const VITE_SPOTIFY_CLIENT_ID = process.env.VITE_SPOTIFY_CLIENT_ID
const VITE_SPOTIFY_REDIRECT_URI = process.env.VITE_SPOTIFY_REDIRECT_URI
const VITE_SPOTIFY_AUTH_ENDPOINT = process.env.VITE_SPOTIFY_AUTH_ENDPOINT
const VITE_SPOTIFY_RESPONSE_TYPE = process.env.VITE_SPOTIFY_RESPONSE_TYPE

const authLink = `${VITE_SPOTIFY_AUTH_ENDPOINT}?client_id=${VITE_SPOTIFY_CLIENT_ID}&redirect_uri=${VITE_SPOTIFY_REDIRECT_URI}&response_type=${VITE_SPOTIFY_RESPONSE_TYPE}`

interface TokenProviderProps {
  children: ReactNode
}

export const TokenProvider: React.FC<TokenProviderProps> = ({ children }) => {
  const [token, setToken] = useState<TokenInfo | null>(null)

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

    setToken({
      isValid: true,
      authLink: authLink
    })
  }, [])

  const tokenFallback = token ?? { isValid: false, authLink: '' }

  return (
    <TokenContext.Provider value={tokenFallback}>
      {children}
    </TokenContext.Provider>
  )
}
