import { useEffect, useRef, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { SpotifyArtist } from '@/types/SpotifyArtist'
import { GiDinosaurRex } from 'react-icons/gi'
import { MdArrowForwardIos } from 'react-icons/md'

import CardArtist from '@/components/CardArtist'
import HeadingOne from '@/components/HeadingOne'
import Welcome from '@/components/Welcome'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import searchSpotify from '@/services/SpotifySearch'

import { useToken } from '../contexts/TokenContext'

const HomepageSearchArtists = (): JSX.Element => {
  const initialArtistState: SpotifyArtist[] = []

  const [searchKey, setSearchKey] = useState('')
  const [pastSearches, setPastSearches] = useState<string[]>([])
  const [artists, setArtists] = useState(initialArtistState)
  const [totalArtists, setTotalArtists] = useState(0)
  const [searchPerformed, setSearchPerformed] = useState(false)

  const isAuthorized = useToken()?.isValid
  const inputRef = useRef<HTMLInputElement>(null)
  const submitRef = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()

  // Get pastSearches from local storage and update its state on component mount.
  let retrievedPastSearches = localStorage.getItem('pastArtistSearches')
  useEffect(() => {
    if (retrievedPastSearches) {
      const parsedPastSearches = JSON.parse(retrievedPastSearches)
      const uniqueSearches: string[] = Array.from(new Set(parsedPastSearches))
      setPastSearches(uniqueSearches)
    }
  }, [])

  // Update pastSearches state, everytime a search is done.
  const updatePastSearches = (term: string) => {
    if (term.trim() !== '') {
      // Retrieve past searches from localStorage.
      let retrievedPastSearches = localStorage.getItem('pastArtistSearches')
      let parsedPastSearches: string[] = []
      if (retrievedPastSearches) {
        parsedPastSearches = JSON.parse(retrievedPastSearches)
      }

      // Add the new search term if not duplicate.
      const updatedSearches = Array.from(new Set([...parsedPastSearches, term]))
      // Max stored = 6.
      const trimmedSearches = updatedSearches.slice(-6)
      localStorage.setItem('pastArtistSearches', JSON.stringify(trimmedSearches))
      setPastSearches(trimmedSearches)
    }
  }

  // Search.
  const handleSearch = async (e: React.FormEvent | undefined, searchKey?: string) => {
    if (e) {
      e.preventDefault()
    }
    try {
      if (!searchKey) return

      const results = await searchSpotify(searchKey, 'artist')
      const artists = results.items as SpotifyArtist[]

      setArtists(artists)
      setTotalArtists(results.total)
      updatePastSearches(searchKey)
      setSearchPerformed(true)

      navigate(`/?searchKey=${encodeURIComponent(searchKey)}`)
    } catch (error) {
      console.error('Error searching API:', error)
    }
  }

  // Search by clicking past search.
  // The form submit is done by simple HTML attributes in the button and id in form.
  const handlePastSearch = (artist: string) => {
    setSearchKey(artist)
  }

  // Clear search states.
  const clearSearch = (): void => {
    setArtists(initialArtistState)
    setTotalArtists(0)
    setSearchPerformed(false)
    setSearchKey('')
    navigate(`/`)
  }

  // Check if search params exist and perform search (/?searchKey=doors).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const searchKeyParam = params.get('searchKey')

    if (searchKeyParam && !searchPerformed) {
      setSearchKey(searchKeyParam)
      handleSearch(undefined, searchKeyParam)
    }
  }, [])

  // Render Artists.
  const renderArtists = (): JSX.Element[] | null => {
    if (artists.length > 0) {
      return artists.map((artist, index) => {
        return (
          <CardArtist
            key={artist.id}
            artist={artist}
            classes={`mb-1 col-span-1 md:col-span-${index === 0 || index === 1 ? '2' : '1'}`}
          />
        )
      })
    } else {
      return null
    }
  }

  return (
    <div className="home container flex flex-col flex-1 justify-center">
      {isAuthorized ? (
        <>
          <h1>
            <a href="http://www.last.fm/api/auth/?api_key=">LAST FM</a>
          </h1>
          <div
            className={`origin-top-left transition-transform ${
              artists.length > 0 && searchPerformed ? 'scale-75 ' : ''
            }`}
          >
            <HeadingOne text="Search Artists" />
          </div>

          <div className="flex">
            <form
              id="searchArtistsForm"
              onSubmit={(e) => handleSearch(e, searchKey)}
              className="flex-1 flex -mt-2"
            >
              <input
                className="bg-white dark:bg-transparent text-2xl md:text-4xl font-normal text-black dark:text-white border border-indigo-700 focus:outline-none dark:focus:dark:bg-slate-900 py-3 px-4"
                type="text"
                value={searchKey}
                ref={inputRef}
                onChange={(e) => setSearchKey(e.target.value)}
              />
              <button
                type="submit"
                ref={submitRef}
                className="bg-white dark:bg-slate-900 text-2xl md:text-4xl border border-l-0 border-indigo-700 px-4 text-black hover:text-white dark:text-white hover:bg-indigo-700 dark:hover:bg-indigo-700"
              >
                <MdArrowForwardIos />
              </button>
            </form>
            {artists.length === 0 && searchPerformed && (
              <div className="flex-1 mt-3 text-2xl flex">
                <GiDinosaurRex className="text-4xl mr-4 -mt-1" />
                <span>No artists found.</span>
              </div>
            )}
          </div>
        </>
      ) : (
        <Welcome />
      )}

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
                    className="px-2 py-1 text-gray-400 hover:text-white"
                    onClick={() => handlePastSearch(term)}
                    form="searchArtistsForm"
                    type="submit"
                    variant="link"
                  >
                    {term}
                  </Button>
                )
              })}
          </>
        )}
      </div>

      {artists.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">{renderArtists()}</div>
      )}
    </div>
  )
}

export default HomepageSearchArtists
