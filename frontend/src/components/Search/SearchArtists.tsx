import { useEffect, useRef, useState } from 'react'

import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import { TSpotifyArtist } from '@/types/SpotifyArtist'
import { GiDinosaurRex } from 'react-icons/gi'

import CardArtist from '@/components/Artist/CardArtist'
import FollowedArtists from '@/components/Search/FollowedArtists'
import SearchForm from '@/components/Search/SearchForm'
import Text from '@/components/shared/Text'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const SearchArtists = (): JSX.Element => {
  const initialArtistState: TSpotifyArtist[] = []
  const [searchKey, setSearchKey] = useState('')
  const [pastSearches, setPastSearches] = useState<string[]>([])
  const [artists, setArtists] = useState(initialArtistState)
  const [totalArtists, setTotalArtists] = useState(0)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const location = useLocation()
  const handleSearchFn = useRef<
    ((e?: React.FormEvent, keyToSearch?: string) => Promise<void>) | null
  >(null)
  const navigate = useNavigate()
  const lastSearchRef = useRef('')

  const handlePastSearch = (artistName: string) => {
    setSearchKey(artistName)
    navigate(`/artists/?searchKey=${encodeURIComponent(artistName)}`)
  }

  useEffect(() => {
    const retrievedPastSearches = localStorage.getItem('pastArtistSearches')
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

  const updatePastSearches = (term: string) => {
    if (term.trim() !== '') {
      const retrievedPastSearches = localStorage.getItem('pastArtistSearches')
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
      const trimmedSearches = updatedSearches.slice(-6)
      localStorage.setItem('pastArtistSearches', JSON.stringify(trimmedSearches))
      setPastSearches(trimmedSearches)
    }
  }

  const clearSearch = (): void => {
    setArtists(initialArtistState)
    setTotalArtists(0)
    setSearchPerformed(false)
    setSearchKey('')
    navigate('/artists')
  }

  useEffect(() => {
    if (!handleSearchFn.current) return
    const params = new URLSearchParams(location.search)
    const searchKeyParam = params.get('searchKey')
    if (searchKeyParam && searchKeyParam !== lastSearchRef.current) {
      lastSearchRef.current = searchKeyParam
      handleSearchFn.current(undefined, searchKeyParam)
    }
  }, [location.search, handleSearchFn])

  const renderArtists = (): JSX.Element[] | null => {
    if (artists.length > 0) {
      return artists.map((artist) => (
        <CardArtist key={artist.id} artist={artist} classes="mb-1 col-span-1" />
      ))
    }
    return null
  }

  return (
    <div className="flex gap-8">
      <div className="basis-3/4">
        <div
          className={`origin-top-left transition-transform ${
            artists.length > 0 && searchPerformed ? 'scale-75' : ''
          }`}
        >
          <Text variant="h1" className="mb-8">
            Search Artists
          </Text>
        </div>

        <SearchForm
          searchKey={searchKey}
          setSearchKey={setSearchKey}
          setArtists={setArtists}
          setTotalArtists={setTotalArtists}
          searchPerformed={searchPerformed}
          setSearchPerformed={setSearchPerformed}
          updatePastSearches={updatePastSearches}
          onSearch={handleSearchFn}
        />

        <div className={`flex items-center gap-4 ${artists.length > 0 ? 'my-6' : 'mt-12 mb-96'}`}>
          {artists.length > 0 && (
            <>
              <Text className="whitespace-nowrap">
                Results: <span className="text-primary">{totalArtists}</span>
              </Text>
              <Separator orientation="vertical" />
              <Button
                onClick={clearSearch}
                className="-ml-3 -mr-3 px-3 py-1 rounded-md bg-transparent hover:bg-primary whitespace-nowrap"
                variant="ghost"
              >
                Clear search
              </Button>
              <Separator orientation="vertical" />
            </>
          )}
          {pastSearches.length > 0 && (
            <>
              <Text className="whitespace-nowrap">Past searches</Text>
              <div className="flex items-center">
                {pastSearches
                  .slice()
                  .reverse()
                  .map((term, index) => (
                    <Button
                      key={index}
                      className="block px-2"
                      onClick={() => handlePastSearch(term)}
                      variant="link"
                    >
                      <Text
                        as="span"
                        className="max-w-[150px] block truncate whitespace-nowrap opacity-50 hover:opacity-100"
                      >
                        {term}
                      </Text>
                    </Button>
                  ))}
              </div>
            </>
          )}
        </div>

        {artists.length === 0 && searchPerformed && (
          <div className="flex-1 mt-3 text-2xl flex items-center">
            <GiDinosaurRex className="text-4xl mr-4 -mt-1" />
            <Text>No artists found.</Text>
          </div>
        )}

        {artists.length > 0 && <div className="grid grid-cols-3 gap-4">{renderArtists()}</div>}
      </div>
      <div className="basis-1/4 pt-20">
        <Text as="h4" variant="h3" className="mb-8 text-right">
          Following
        </Text>
        <FollowedArtists />
      </div>
    </div>
  )
}

export default SearchArtists
