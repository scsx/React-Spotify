import { useState, useEffect, useRef } from 'react'
import { useToken } from '../contexts/TokenContext'
import { SpotifyArtist } from '@/types/SpotifyArtist'
import searchSpotify from '@/services/SpotifySearch'

import Welcome from '@/components/Welcome'
import HeadingOne from '@/components/HeadingOne'

import CardArtist from '@/components/CardArtist'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { MdArrowForwardIos } from 'react-icons/md'

const HomepageSearchArtists = (): JSX.Element => {
  const initialArtistState: SpotifyArtist[] = []
  const [searchKey, setSearchKey] = useState('')
  const [pastSearches, setPastSearches] = useState<string[]>([])
  const [artists, setArtists] = useState(initialArtistState)
  const [totalArtists, setTotalArtists] = useState(0)
  const isAuthorized = useToken()?.isValid
  const inputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // Get pastSearches from local storage and fill its state.
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
      if (pastSearches.length > 6) {
        updatedSearches = updatedSearches.slice(1)
      }
      localStorage.setItem('pastArtistSearches', JSON.stringify(updatedSearches))
    }
  }, [pastSearches])

  // Update pastSearches state, everytime a search is done.
  const updatePastSearches = (term: string) => {
    if (!pastSearches.includes(term)) {
      const updatedSearches: string[] = [...pastSearches, term]
      setPastSearches(updatedSearches)
    }
  }

  // Manipulate search field.
  const editSearchField = (query = ''): void => {
    if (inputRef.current) {
      inputRef.current.value = query
    }
  }

  // Search.
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

  // Search by clicking past search.
  // The form submit is done by simple HTML attributes in the button and id in form.
  const handlePastSearch = (artist: string) => {
    setSearchKey(artist)
    editSearchField(artist)
  }

  // Clear search states.
  const clearSearch = (): void => {
    setArtists(initialArtistState)
    setTotalArtists(0)
    editSearchField()
  }

  // Render Artists.
  const renderArtists = (): JSX.Element[] => {
    if (artists.length > 0) {
      return artists.map((artist, index) => {
        // MAKE Least Popular results blurry and blurrier
        return (
          <CardArtist
            key={artist.id}
            artist={artist}
            classes={`col-span-3 lg:col-span-${index === 0 || index === 1 ? '2' : '1'} mb-1`}
            //classes={`col-span-3 lg:col-span-1 mb-1`}
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
              id='searchArtistsForm'
              ref={formRef}
              onSubmit={handleSearch}
              className='flex-1 flex -mt-2'>
              <input
                className='bg-white dark:bg-transparent text-2xl md:text-4xl font-normal text-black dark:text-white border border-indigo-700 focus:outline-none dark:focus:dark:bg-slate-900 py-3 px-4'
                type='text'
                ref={inputRef}
                onChange={(e) => setSearchKey(e.target.value)}
              />
              <button
                type='submit'
                className='bg-white dark:bg-slate-900 text-2xl md:text-4xl border border-l-0 border-indigo-700 px-4 text-black hover:text-white dark:text-white hover:bg-indigo-700 dark:hover:bg-indigo-700'>
                <MdArrowForwardIos />
              </button>
            </form>
          </div>
        </>
      ) : (
        <Welcome />
      )}

      <div className={`flex items-center gap-4 ${artists.length > 0 ? 'my-6' : 'mt-12 mb-96'}`}>
        {artists.length > 0 && (
          <>
            <h3>
              Results: <span className='text-primary'>{totalArtists}</span>
            </h3>
            <Separator orientation='vertical' />
            <button onClick={clearSearch}>Clear search</button>
            <Separator orientation='vertical' />
          </>
        )}
        {isAuthorized && pastSearches.length > 0 && (
          <>
            <h3>Past searches</h3>
            {pastSearches
              .slice()
              .reverse()
              .map((term, index) => {
                return (
                  <Button
                    key={index}
                    className='px-2 py-1 text-gray-400 hover:text-white'
                    onClick={() => handlePastSearch(term)}
                    form='searchArtistsForm'
                    type='submit'
                    variant='link'>
                    {term}
                  </Button>
                )
              })}
          </>
        )}
      </div>

      {artists.length > 0 && (
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-4'>{renderArtists()}</div>
      )}
    </div>
  )
}

export default HomepageSearchArtists
