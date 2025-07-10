import { useEffect, useState } from 'react'

import { TSpotifyPlaylist } from '@/types/SpotifyPlaylist'

import ErrorDisplay from '@/components/ErrorDisplay'
import Loading from '@/components/Loading'
import FullPlaylist from '@/components/Playlists/FullPlaylist/FullPlaylist'
import Text from '@/components/Text'

import { getSpotifyPlaylistsByNames } from '@/services/spotify/getSpotifyPlaylistsByNames'

const ShazamPlaylist = () => {
  const [playlist, setPlaylist] = useState<TSpotifyPlaylist | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const term: string = 'shazam'

  useEffect(() => {
    const fetchDiscoveryWeekly = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await getSpotifyPlaylistsByNames([term])

        if (result.found.length > 0) {
          setPlaylist(result.found[0])
        } else {
          setError(`Playlist "${term}" not found. ${result.message || ''}`)
        }
      } catch (err: any) {
        console.error('Error loading playlist:', err)
        setError(
          err.message || 'Ocorreu um erro desconhecido ao carregar a playlist Discovery Weekly.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchDiscoveryWeekly()
  }, [])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <ErrorDisplay
        title="Error loading playlist"
        message={error}
        details={`Confirm that "${term}" exists in you playlist collection.`}
      />
    )
  }

  if (!playlist) {
    return (
      <div className="container py-8">
        <Text variant="h2">Playlist {term} não encontrada.</Text>
        <Text variant="paragraph" className="mt-2 text-gray-500">
          Pode ser que a playlist não esteja disponível ou que não exista na sua conta Spotify.
        </Text>
      </div>
    )
  }

  return <FullPlaylist playlist={playlist} />
}

export default ShazamPlaylist
