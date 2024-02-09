import { useEffect, useState } from 'react'
import axios from 'axios'
import { useToken } from '../contexts/TokenContext'
import { SpotifyArtist } from '../types/SpotifyArtist'

interface SpotifySearchResponse {
  artists: {
    items: SpotifyArtist[]
  }
}

const Homepage = (): JSX.Element => {
  const initialState: SpotifyArtist[] = []

  const [searchKey, setSearchKey] = useState('')
  const [artists, setArtists] = useState(initialState)
  const searchArtists = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    const { data }: { data: SpotifySearchResponse } = await axios.get(
      'https://api.spotify.com/v1/search',
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          q: searchKey,
          type: 'artist'
        }
      }
    )

    const { items }: { items: SpotifyArtist[] } = data.artists
    setArtists(items)
  }

  const token = useToken()
  console.log('Token:', token)

  const renderArtists = (): JSX.Element[] => {
    return artists.map((artist) => {
      return (
        <div key={artist.id}>
          <p>Image here</p>
          {artist.name}
        </div>
      )
    })
  }

  return (
    <div>
      <h1>HP</h1>
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

      <div>{renderArtists()}</div>
    </div>
  )
}

export default Homepage
