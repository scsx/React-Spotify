import { useCallback, useEffect, useRef, useState } from 'react'

import { TSpotifyArtist } from '@/types/SpotifyArtist'
import { MdArrowForwardIos, MdOutlineFlightTakeoff } from 'react-icons/md'

import spotifySearch from '@/services/spotify/spotifySearch'

type TSearchFormProps = {
  searchKey: string
  setSearchKey: (value: string) => void
  setArtists: (artists: TSpotifyArtist[]) => void
  setTotalArtists: (total: number) => void
  searchPerformed: boolean
  setSearchPerformed: (performed: boolean) => void
  updatePastSearches: (term: string) => void
  onSearch: React.MutableRefObject<
    ((e?: React.FormEvent, keyToSearch?: string) => Promise<void>) | null
  >
}

const SearchForm = ({
  searchKey,
  setSearchKey,
  setArtists,
  setTotalArtists,
  searchPerformed,
  setSearchPerformed,
  updatePastSearches,
  onSearch,
}: TSearchFormProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const submitRef = useRef<HTMLButtonElement>(null)

  const handleSearch = useCallback(
    async (e?: React.FormEvent, keyToSearch?: string) => {
      if (e && typeof e.preventDefault === 'function') e.preventDefault()
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
      } catch (error) {
        console.error('Error searching Spotify API:', error)
        setError('Failed to search artists. Please try again later.')
        setArtists([])
        setTotalArtists(0)
      } finally {
        setIsLoading(false)
      }
    },
    [searchKey, setArtists, setTotalArtists, updatePastSearches, setSearchPerformed]
  )

  useEffect(() => {
    onSearch.current = handleSearch
  }, [handleSearch, onSearch])

  return (
    <div className="flex">
      <form id="searchArtistsForm" onSubmit={(e) => handleSearch(e)} className="flex-1 flex -mt-2">
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
      {!isLoading && searchKey && !error && !searchPerformed && (
        <div className="flex-1 mt-3 text-2xl flex items-center">
          <span>Press enter to search.</span>
        </div>
      )}
    </div>
  )
}

export default SearchForm
