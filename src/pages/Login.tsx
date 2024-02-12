import { useEffect, useState } from 'react'
import {
  VITE_SPOTIFY_CLIENT_ID,
  VITE_SPOTIFY_REDIRECT_URI,
  VITE_SPOTIFY_AUTH_ENDPOINT,
  VITE_SPOTIFY_RESPONSE_TYPE
} from '../../envConfig.ts'

const Login = (): JSX.Element => {
  const [token, setToken] = useState('')

  useEffect(() => {
    const hash = window.location.hash
    let spotifyToken: string | null =
      window.localStorage.getItem('spotifyToken')

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

  const logout = (): void => {
    setToken('')
    window.localStorage.removeItem('spotifyToken')
  }

  return (
    <div>
      {!token ? (
        <a
          href={`${VITE_SPOTIFY_AUTH_ENDPOINT}?client_id=${VITE_SPOTIFY_CLIENT_ID}&redirect_uri=${VITE_SPOTIFY_REDIRECT_URI}&response_type=${VITE_SPOTIFY_RESPONSE_TYPE}`}>
          Authenticate
        </a>
      ) : (
        <button onClick={logout}>Logout</button>
      )}
    </div>
  )
}

export default Login
