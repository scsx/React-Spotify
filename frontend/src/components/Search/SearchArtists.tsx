import { useEffect, useRef, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { TSpotifyArtist } from '@/types/SpotifyArtist'
import { GiDinosaurRex } from 'react-icons/gi'
import { MdArrowForwardIos, MdOutlineFlightTakeoff } from 'react-icons/md'

import CardArtist from '@/components/Artist/CardArtist'
import HeadingOne from '@/components/HeadingOne'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import spotifySearch from '@/services/spotify/spotifySearch'

const SearchArtists = (): JSX.Element => {
  const initialArtistState: TSpotifyArtist[] = []

  const [searchKey, setSearchKey] = useState('')
  const [pastSearches, setPastSearches] = useState<string[]>([])
  const [artists, setArtists] = useState(initialArtistState)
  const [totalArtists, setTotalArtists] = useState(0)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const submitRef = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()

  // Get pastSearches from local storage and update its state on component mount.
  useEffect(() => {
    let retrievedPastSearches = localStorage.getItem('pastArtistSearches')
    if (retrievedPastSearches) {
      try {
        const parsedPastSearches = JSON.parse(retrievedPastSearches)
        const uniqueSearches: string[] = Array.from(new Set(parsedPastSearches))
        setPastSearches(uniqueSearches)
      } catch (e) {
        console.error('Error parsing past searches from localStorage:', e)
        localStorage.removeItem('pastArtistSearches')
      }
    }
  }, [])

  // Update pastSearches state, everytime a search is done.
  const updatePastSearches = (term: string) => {
    if (term.trim() !== '') {
      let retrievedPastSearches = localStorage.getItem('pastArtistSearches')
      let parsedPastSearches: string[] = []
      if (retrievedPastSearches) {
        try {
          parsedPastSearches = JSON.parse(retrievedPastSearches)
        } catch (e) {
          console.error('Error parsing past searches from localStorage:', e)
          localStorage.removeItem('pastArtistSearches')
        }
      }

      const updatedSearches = Array.from(new Set([...parsedPastSearches, term]))
      const trimmedSearches = updatedSearches.slice(-6) // Max stored = 6.
      localStorage.setItem('pastArtistSearches', JSON.stringify(trimmedSearches))
      setPastSearches(trimmedSearches)
    }
  }

  // Search.
  const handleSearch = async (e: React.FormEvent | undefined, keyToSearch?: string) => {
    if (e) {
      e.preventDefault()
    }
    const finalSearchKey = keyToSearch || searchKey

    if (!finalSearchKey.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const results = await spotifySearch(finalSearchKey, 'artist')
      const artistsData = results.artists?.items as TSpotifyArtist[]

      setArtists(artistsData)
      setTotalArtists(results.artists?.total || 0)
      updatePastSearches(finalSearchKey)
      setSearchPerformed(true)
      navigate(`/?searchKey=${encodeURIComponent(finalSearchKey)}`)
    } catch (error) {
      console.error('Error searching Spotify API:', error)
      setError('Failed to search artists. Please try again later.')
      setArtists(initialArtistState)
      setTotalArtists(0)
    } finally {
      setIsLoading(false)
    }
  }

  // Search by clicking past search.
  const handlePastSearch = (artistName: string) => {
    setSearchKey(artistName)
    handleSearch(undefined, artistName)
  }

  // Clear search states.
  const clearSearch = (): void => {
    setArtists(initialArtistState)
    setTotalArtists(0)
    setSearchPerformed(false)
    setSearchKey('')
    setError(null)
    navigate(`/`)
  }

  // Check if search params exist and perform search (/?searchKey=doors).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const searchKeyParam = params.get('searchKey')

    if (searchKeyParam && !searchPerformed && !isLoading) {
      setSearchKey(searchKeyParam)
      handleSearch(undefined, searchKeyParam)
    }
  }, [searchPerformed, isLoading])

  // Render Artists.
  const renderArtists = (): JSX.Element[] | null => {
    if (artists.length > 0) {
      return artists.map((artist, index) => {
        return (
          <CardArtist
            key={artist.id}
            artist={artist}
            // Mantenha as classes de grid responsivas
            classes={`mb-1 col-span-1 md:col-span-${index === 0 || index === 1 ? '2' : '1'}`}
          />
        )
      })
    } else {
      return null
    }
  }

  return (
    <>
      <div
        className={`origin-top-left transition-transform ${
          artists.length > 0 && searchPerformed ? 'scale-75' : ''
        }`}
      >
        <HeadingOne text="Search Artists" />
      </div>

      <div className="flex">
        <form
          id="searchArtistsForm"
          onSubmit={(e) => handleSearch(e)}
          className="flex-1 flex -mt-2"
        >
          <input
            className="bg-white dark:bg-transparent text-2xl md:text-4xl font-normal text-black dark:text-white border border-indigo-700 focus:outline-none dark:focus:dark:bg-slate-900 py-3 px-4"
            type="text"
            value={searchKey}
            ref={inputRef}
            onChange={(e) => setSearchKey(e.target.value)}
            placeholder="e.g. doors"
          />
          <button
            type="submit"
            ref={submitRef}
            className="bg-white dark:bg-slate-900 text-2xl md:text-4xl border border-l-0 border-indigo-700 px-4 text-black hover:text-white dark:text-white hover:bg-indigo-700 dark:hover:bg-indigo-700"
            disabled={isLoading}
          >
            {isLoading ? <MdOutlineFlightTakeoff /> : <MdArrowForwardIos />}
          </button>
        </form>
        {error && (
          <div className="flex-1 mt-3 text-red-500 text-2xl flex items-center">
            <span>Error: {error}</span>
          </div>
        )}
        {!isLoading && artists.length === 0 && searchPerformed && !error && (
          <div className="flex-1 mt-3 text-2xl flex items-center">
            <GiDinosaurRex className="text-4xl mr-4 -mt-1" />
            <span>No artists found.</span>
          </div>
        )}
      </div>

      <div className={`flex items-center gap-4 ${artists.length > 0 ? 'my-6' : 'mt-12 mb-96'}`}>
        {artists.length > 0 && (
          <>
            <h3>
              Results: <span className="text-primary">{totalArtists}</span>
            </h3>
            <Separator orientation="vertical" />
            <button
              onClick={clearSearch}
              className="-ml-3 -mr-3 px-3 py-1 rounded-md bg-transparent hover:bg-primary"
            >
              Clear search
            </button>
            <Separator orientation="vertical" />
          </>
        )}
        {pastSearches.length > 0 && (
          <>
            <h3>Past searches</h3>
            {pastSearches
              .slice()
              .reverse()
              .map((term, index) => (
                <Button
                  key={index}
                  className="px-2 py-1 text-gray-400 hover:text-white"
                  onClick={() => handlePastSearch(term)}
                  form="searchArtistsForm"
                  type="submit"
                  variant="link"
                >
                  {term}
                </Button>
              ))}
          </>
        )}
      </div>

      {isLoading && <div className="text-center text-2xl mt-8">Loading artists...</div>}

      {artists.length > 0 && !isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">{renderArtists()}</div>
      )}
    </>
  )
}

export default SearchArtists
