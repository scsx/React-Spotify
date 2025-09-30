import { useEffect, useState } from 'react'

import { TSpotifyAlbum } from '@/types/SpotifyAlbum'

import AlbumCard from '@/components/AlbumCard'
import Text from '@/components/Text'

import getSpotifyNewReleases from '@/services/spotify/getSpotifyNewReleases'

const Albums = () => {
  const [albums, setAlbums] = useState<TSpotifyAlbum[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getSpotifyNewReleases()
        setAlbums(data)
      } catch (err: any) {
        console.error('Erro ao carregar novos lançamentos:', err)
        setError(err.message || 'Ocorreu um erro ao carregar os álbuns.')
      } finally {
        setLoading(false)
      }
    }

    fetchNewReleases()
  }, [])

  if (loading) {
    return (
      <div className="container py-8">
        <Text variant="h1">Loading albums...</Text>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <Text variant="h1">Error loading albums.</Text>
        <Text variant="paragraph">{error}</Text>
      </div>
    )
  }

  return (
    <div className="container py-8 mb-2">
      <Text variant="h1">Albums</Text>
      <Text variant="h4" className="mb-8">
        New Releases, it's mostly crap...
      </Text>

      {albums && albums.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} showArtist />
          ))}
        </div>
      ) : (
        <Text variant="paragraph" className="text-center text-gray-500">
          No releases found...
        </Text>
      )}
    </div>
  )
}

export default Albums
