import { useEffect, useState } from 'react'

import { TSpotifyPlaylist } from '@/types/SpotifyPlaylist'

import ErrorDisplay from '@/components/ErrorDisplay'
import Loading from '@/components/Loading'
import CardPlaylist from '@/components/Playlists/CardPlaylist'
import Text from '@/components/Text'

import { getSpotifyPlaylistsById } from '@/services/spotify/getSpotifyPlaylistsById'

import { SPOTIFY_SPECIAL_PLAYLISTS } from '@/lib/constants'

const SpecialPlaylists = () => {
  const [specialPlaylists, setSpecialPlaylists] = useState<TSpotifyPlaylist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSpecialPlaylists = async () => {
      setLoading(true)
      setError(null)
      try {
        const playlistIds = SPOTIFY_SPECIAL_PLAYLISTS.map((p) => p.id)
        const fetchedSpotifyPlaylists = await getSpotifyPlaylistsById(playlistIds)

        setSpecialPlaylists(fetchedSpotifyPlaylists)
      } catch (err: any) {
        console.error('Failed to fetch special playlists:', err)
        setError('Falha ao carregar as playlists especiais. Por favor, tente novamente mais tarde.')
      } finally {
        setLoading(false)
      }
    }

    if (SPOTIFY_SPECIAL_PLAYLISTS.length > 0) {
      fetchSpecialPlaylists()
    } else {
      setLoading(false)
    }
  }, [])

  if (error) {
    return <ErrorDisplay message={error} />
  }

  if (loading) {
    return <Loading />
  }

  if (specialPlaylists.length === 0) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Text variant="h2">Nenhuma playlist especial encontrada.</Text>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {specialPlaylists.map((playlist) => (
        <CardPlaylist key={playlist.id} playlist={playlist} />
      ))}
    </div>
  )
}

export default SpecialPlaylists
