import { useState } from 'react'
import { useToken } from '../contexts/TokenContext'
import { SpotifyArtist } from '../types/SpotifyArtist'
import searchSpotify from '@/services/SpotifySearch'
import Welcome from '@/components/Welcome'
import HeadingOne from '@/components/HeadingOne'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { MdArrowForwardIos } from 'react-icons/md'

const HomepageSearchArtists = (): JSX.Element => {
  const initialState: SpotifyArtist[] = []
  const [searchKey, setSearchKey] = useState('')
  const [artists, setArtists] = useState(initialState)
  const token = useToken()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const results = (await searchSpotify(
        token,
        searchKey,
        'artist'
      )) as SpotifyArtist[] // In this case we know its going to be of type artist so we use type assertion
      setArtists(results)
    } catch (error) {
      console.error('Error searching artists:', error)
    }
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
          <HeadingOne text='Search Artists' />
          <form onSubmit={handleSearch}>
            <input
              className='bg-transparent text-3xl text-black dark:text-white border-b-4 border-indigo-500 focus:outline-none'
              type='text'
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <button type='submit' className='text-3xl text-black dark:text-white'>Search</button>
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

export default HomepageSearchArtists
