import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useToken } from '../contexts/TokenContext'
import { SpotifyArtist } from '../types/SpotifyArtist'
import Welcome from '@/components/Welcome'

interface SpotifySearchResponse {
  artists: {
    items: SpotifyArtist[]
  }
}

const Homepage = (): JSX.Element => {
  const initialState: SpotifyArtist[] = []
  const [searchKey, setSearchKey] = useState('')
  const [artists, setArtists] = useState(initialState)
  const token = useToken()

  // Search Artists.
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

  // Render Artists.
  const renderArtists = (): JSX.Element[] => {
    if (artists.length > 0) {
      return artists.map((artist) => {
        return (
          <div key={artist.id}>
            <p>Image here</p>
            {artist.name}
          </div>
        )
      })
    } else {
      return [<h2>No artists to display.</h2>]
    }
  }

  return (
    <div className='home container flex flex-col flex-1 justify-center'>
      {token ? (
        <form onSubmit={searchArtists}>
          <input type='text' onChange={(e) => setSearchKey(e.target.value)} />
          <button type='submit'>Search</button>
        </form>
      ) : (
        <Welcome />
      )}

      <div>{renderArtists()}</div>
    </div>
  )
}

export default Homepage
