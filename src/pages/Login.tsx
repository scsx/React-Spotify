import { useEffect, useState } from 'react'

const VITE_SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const VITE_SPOTIFY_REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI
const VITE_SPOTIFY_AUTH_ENDPOINT = import.meta.env.VITE_SPOTIFY_AUTH_ENDPOINT
const VITE_SPOTIFY_RESPONSE_TYPE = import.meta.env.VITE_SPOTIFY_RESPONSE_TYPE

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
