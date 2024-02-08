import { useEffect, useState } from 'react'

/* const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI
const SPOTIFY_AUTH_ENDPOINT = process.env.SPOTIFY_AUTH_ENDPOINT
const SPOTIFY_RESPONSE_TYPE = process.env.SPOTIFY_RESPONSE_TYPE */

const Login = (): JSX.Element => {

  console.log(import.meta.env.SPOTIFY_CLIENT_ID)

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
        <p>Hey</p>
       /*  <a
          href={`${SPOTIFY_AUTH_ENDPOINT}?client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${SPOTIFY_REDIRECT_URI}&response_type=${SPOTIFY_RESPONSE_TYPE}`}>
          Login
        </a> */
      ) : (
        <button onClick={logout}>Logout</button>
      )}
    </div>
  )
}

export default Login
