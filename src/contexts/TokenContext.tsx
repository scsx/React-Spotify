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

  return <TokenContext.Provider value={token}>{children}</TokenContext.Provider>
}
