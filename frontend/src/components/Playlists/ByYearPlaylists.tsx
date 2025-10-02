import { useEffect, useMemo, useState } from 'react'

import { TSpotifyPlaylist } from '@/types/SpotifyPlaylist'

import ErrorDisplay from '@/components/ErrorDisplay'
import Loading from '@/components/Loading'
import CardPlaylist from '@/components/Playlists/CardPlaylist'
import Text from '@/components/Text'

import { getSpotifyPlaylistsByNames } from '@/services/spotify/getSpotifyPlaylistsByNames'

const ByYearPlaylists = () => {
  const [playlistsByYear, setPlaylistsByYear] = useState<TSpotifyPlaylist[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Generate an array of years from the current year down to 2014
  const yearsToFetch = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const startYear = 2014
    const yearsArray: string[] = []

    for (let year = currentYear; year >= startYear; year--) {
      yearsArray.push(String(year))
    }
    return yearsArray
  }, [])

  useEffect(() => {
    const fetchAllPlaylists = async () => {
      setLoading(true)
      setError(null)
      const foundPlaylists = []

      try {
        for (const year of yearsToFetch) {
          const result = await getSpotifyPlaylistsByNames([year])

          if (result.found.length > 0) {
            foundPlaylists.push(result.found[0])
          }
        }

        setPlaylistsByYear(foundPlaylists)

        if (foundPlaylists.length === 0) {
          setError('No playlists found.')
        }
      } catch (err) {
        console.error('Error loading annual playlists:', err)
        setError('An unknown error occurred while loading annual playlists.')
      } finally {
        setLoading(false)
      }
    }

    fetchAllPlaylists()
  }, [yearsToFetch])

  if (loading) {
    return <Loading message='Loading (needs to bypass too many requests error)' />
  }

  if (error) {
    return <ErrorDisplay title="Error loading pleaylists" message={error} />
  }

  if (playlistsByYear.length === 0) {
    return (
      <div className="container py-8">
        <Text variant="h2">No playlists found.</Text>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {playlistsByYear.map((playlist) => (
        <CardPlaylist key={playlist.id} playlist={playlist} />
      ))}
    </div>
  )
}

export default ByYearPlaylists
