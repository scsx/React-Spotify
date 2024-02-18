import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react'

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

// .env vars and link for the Implicit Grant Flow.
const VITE_SPOTIFY_CLIENT_ID = process.env.VITE_SPOTIFY_CLIENT_ID
const VITE_SPOTIFY_REDIRECT_URI = process.env.VITE_SPOTIFY_REDIRECT_URI
const VITE_SPOTIFY_AUTH_ENDPOINT = process.env.VITE_SPOTIFY_AUTH_ENDPOINT
const VITE_SPOTIFY_RESPONSE_TYPE = process.env.VITE_SPOTIFY_RESPONSE_TYPE

const authLink = `${VITE_SPOTIFY_AUTH_ENDPOINT}?client_id=${VITE_SPOTIFY_CLIENT_ID}&redirect_uri=${VITE_SPOTIFY_REDIRECT_URI}&response_type=${VITE_SPOTIFY_RESPONSE_TYPE}`

// Provider.
export const TokenProvider: React.FC<TokenProviderProps> = ({ children }) => {
  const [token, setToken] = useState<TokenInfo | null>(null)
  const [tokenIsValid, setTokenIsValid] = useState(false)

  // Logout.
  const logoutCtx = () => {
    window.localStorage.removeItem('spotifyToken')
    setTokenIsValid(false)
  }

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
      setTokenIsValid(true)
      window.localStorage.setItem('spotifyToken', spotifyToken ?? '')
    }

    setToken({
      isValid: tokenIsValid,
      authLink: authLink,
      logout: logoutCtx
    })
  }, [])

  // Update the token object whenever tokenIsValid changes otherwise it will refer to the initial value of tokenIsValid 
  useEffect(() => {
    setToken(prevToken => ({
      ...(prevToken as TokenInfo),
      isValid: tokenIsValid
    }))
  }, [tokenIsValid])

  const tokenOrFallback = token ?? {
    isValid: tokenIsValid,
    authLink: '',
    logout: logoutCtx
  }

  return (
    <TokenContext.Provider value={tokenOrFallback}>
      {children}
    </TokenContext.Provider>
  )
}
