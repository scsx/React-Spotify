// import Button from './components/Button'
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const CLIENT_ID = '7fed2e2e70e947c0ae0c8872e7f1467a'
  const REDIRECT_URI = 'http://localhost:5173'
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
  const RESPONSE_TYPE = 'token'

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

      console.log(spotifyToken)
    }
  }, [])

  return (
    <>
      <div>
        <a
          href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>
          Login
        </a>
      </div>
    </>
  )
}

export default App
