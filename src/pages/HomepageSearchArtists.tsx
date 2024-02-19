import { useState, useEffect } from 'react'
import { useToken } from '../contexts/TokenContext'
import { SpotifyArtist } from '@/types/SpotifyArtist'
import searchSpotify from '@/services/SpotifySearch'
import Welcome from '@/components/Welcome'
import HeadingOne from '@/components/HeadingOne'
import CardArtist from '@/components/CardArtist'
import { MdArrowForwardIos } from 'react-icons/md'

const HomepageSearchArtists = (): JSX.Element => {
  const initialArtistState: SpotifyArtist[] = []
  const [searchKey, setSearchKey] = useState('')
  const [pastSearches, setPastSearches] = useState<string[]>([])
  const [artists, setArtists] = useState(initialArtistState)
  const [totalArtists, setTotalArtists] = useState(0)
  const isAuthorized = useToken()?.isValid

  // Get local storage and update its state.
  let storedPastSearches = localStorage.getItem('pastArtistSearches')
  useEffect(() => {
    if (storedPastSearches) {
      const obj = JSON.parse(storedPastSearches)
      setPastSearches(obj)
    }
  }, [storedPastSearches])

  // Set local storage based on state pastSearches.
  useEffect(() => {
    if (pastSearches.length > 0) {
      let updatedSearches = [...pastSearches]
      if (pastSearches.length > 4) {
        updatedSearches = updatedSearches.slice(1)
      }
      localStorage.setItem('pastArtistSearches', JSON.stringify(updatedSearches))
    }
  }, [pastSearches])

  const updatePastSearches = (term: string) => {
    const updatedSearches: string[] = [...pastSearches, term]
    setPastSearches(updatedSearches)
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    updatePastSearches(searchKey)

    try {
      const results = await searchSpotify(searchKey, 'artist')
      const artists = results.items as SpotifyArtist[]
      setArtists(artists)
      setTotalArtists(results.total)
    } catch (error) {
      console.error('Error searching API:', error)
    }
  }

  const clearSearch = (): void => {
    setArtists(initialArtistState)
    setTotalArtists(0)
  }

  // Render Artists.
  const renderArtists = (): JSX.Element[] => {
    if (artists.length > 0) {
      return artists.map((artist) => {
        // MAKE Least Popular results blurry and blurrier
        return (
          <CardArtist
            key={artist.id}
            artist={artist}
            /* classes={`col-span-3 lg:col-span-1 mb-1 ${
              index === 0 ? 'lg:col-span-full' : ''
            }`} */
            classes={`col-span-3 lg:col-span-1 mb-1`}
          />
        )
      })
    } else {
      return [<h2 key={'noresults'}>No artists to display.</h2>] // In array so it always returns JSX.Element[]. Forces key.
    }
  }

  return (
    <div className='home container flex flex-col flex-1 justify-center'>
      {isAuthorized ? (
        <>
          <HeadingOne text='Search Artists' />
          <div className='flex'>
            <form
              onSubmit={handleSearch}
              className={`flex -mt-2 ${artists.length > 0 ? 'mb-12' : 'mb-96'}`}>
              <input
                className='bg-white dark:bg-transparent text-2xl md:text-4xl font-normal text-black dark:text-white border border-indigo-700 focus:outline-none dark:focus:dark:bg-slate-900 py-3 px-4'
                type='text'
                onChange={(e) => setSearchKey(e.target.value)}
              />
              <button
                type='submit'
                className='bg-white dark:bg-slate-900 text-2xl md:text-4xl border border-l-0 border-indigo-700 px-4 text-black hover:text-white dark:text-white hover:bg-indigo-700 dark:hover:bg-indigo-700'>
                <MdArrowForwardIos />
              </button>
            </form>
            <div>
              <p>Past searches</p>
              {pastSearches.length > 0 &&
                pastSearches.map((term, index) => {
                  return <span key={index}>{term}</span>
                })}
            </div>
          </div>
        </>
      ) : (
        <Welcome />
      )}

      {artists.length > 0 && (
        <>
          <h3 className='text-lg mb-4'>
            Results <i className='text-primary'>{totalArtists}</i>
            <button className='ml-4' onClick={clearSearch}>
              Clear search
            </button>
          </h3>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>{renderArtists()}</div>
        </>
      )}
    </div>
  )
}

export default HomepageSearchArtists
