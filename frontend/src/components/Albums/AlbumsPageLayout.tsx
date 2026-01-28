import { useEffect, useState } from 'react'

import { TSpotifyAlbum } from '@/types/SpotifyAlbum'
import { TSpotifyTrack } from '@/types/SpotifyTrack'

import AlbumCard from '@/components/Album/AlbumCard'
import Loading from '@/components/Loading'
import Text from '@/components/Text'

import getSpotifyNewReleases from '@/services/spotify/getSpotifyNewReleases'
import { getSpotifyUserTopItems } from '@/services/spotify/getSpotifyUserTopItems'

const AlbumsPageLayout = () => {
  const [albums, setAlbums] = useState<TSpotifyAlbum[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true)
        setError(null)

        const newReleases = await getSpotifyNewReleases()
        setAlbums(newReleases)

        const topTracks = await getSpotifyUserTopItems<TSpotifyTrack>('tracks', 'short_term')
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Ocorreu um erro ao carregar os álbuns.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAlbums()
  }, [])

  if (loading) return <Loading />
  if (error) return <Text>{error}</Text>

  if (!albums || albums.length === 0) {
    return <Text>No releases found...</Text>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} showArtist />
      ))}
    </div>
  )
}

export default AlbumsPageLayout
