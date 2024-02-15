import { useState } from 'react'
import axios from 'axios'
import { useToken } from '../contexts/TokenContext'
import { SpotifyArtist } from '../types/SpotifyArtist'
import Welcome from '@/components/Welcome'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

interface SpotifySearchArtistsResponse {
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
    const { data }: { data: SpotifySearchArtistsResponse } = await axios.get(
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
      return artists.map((artist, index) => {

        // MAKE Least Popular results blurry and blurryer

        return (
          <Card
            key={artist.id}
            className={`col-span-3 lg:col-span-1 mb-1 ${
              index === 0 ? 'lg:col-span-full' : ''
            }`}>
            <CardHeader>
              <CardTitle>{artist.name}</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Popularity: {artist.popularity}</p>
            </CardFooter>
          </Card>
        )
      })
    } else {
      return [<h2 key={'noresults'}>No artists to display.</h2>] // In array so it always returns JSX.Element[]. Forces key.
    }
  }

  return (
    <div className='home container flex flex-col flex-1 justify-center'>
      {token ? (
        <>
          <h1>Search Artists</h1>
          <form onSubmit={searchArtists}>
            <input type='text' onChange={(e) => setSearchKey(e.target.value)} />
            <button type='submit'>Search</button>
          </form>
        </>
      ) : (
        <Welcome />
      )}

      {artists.length > 0 && (
        <>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
            {renderArtists()}
          </div>
        </>
      )}
    </div>
  )
}

export default Homepage
