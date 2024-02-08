// import Button from './components/Button'
import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const CLIENT_ID = '7fed2e2e70e947c0ae0c8872e7f1467a'
  const REDIRECT_URI = 'http://localhost:5173'
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
  const RESPONSE_TYPE = 'token'

  const [token, setToken] = useState('')
  const [searchKey, setSearchKey] = useState('')

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

  const searchArtists = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    const { data } = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: searchKey,
        type: 'artist'
      }
    })

    console.log(data)
  }

  return (
    <>
      <div>
        {!token ? (
          <a
            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>
            Login
          </a>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
      </div>

      <div>
        {token ? (
          <form onSubmit={searchArtists}>
            <input type='text' onChange={(e) => setSearchKey(e.target.value)} />
            <button type='submit'>Search</button>
          </form>
        ) : (
          <h2>Please login</h2>
        )}
      </div>
    </>
  )
}

export default App
