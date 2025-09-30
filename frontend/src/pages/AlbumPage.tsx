import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { TSpotifyAlbum } from '@/types/SpotifyAlbum'

import AlbumOverview from '@/components/Album/AlbumOverview'
import Tracklist from '@/components/Album/Tracklist'
import ErrorDisplay from '@/components/ErrorDisplay'
import Loading from '@/components/Loading'
import Text from '@/components/Text'

import { getSpotifyAlbum } from '@/services/spotify/getSpotifyAlbum'

const AlbumPage = () => {
  const { albumId } = useParams<{ albumId: string }>()
  const [album, setAlbum] = useState<TSpotifyAlbum | null>(null)
  const [loadingPage, setLoadingPage] = useState(true)
  const [errorPage, setErrorPage] = useState<string | null>(null)

  useEffect(() => {
    if (!albumId) {
      setErrorPage('Album ID is missing')
      setLoadingPage(false)
      return
    }

    setLoadingPage(true)
    setErrorPage(null)
    setAlbum(null)

    const fetchAlbumDetails = async () => {
      try {
        const albumData = await getSpotifyAlbum(albumId)
        console.log('Album data:', albumData)
        setAlbum(albumData)
      } catch (error) {
        console.error('Erro ao carregar detalhes do álbum:', error)
        setErrorPage('Album details not found')
      } finally {
        setLoadingPage(false)
      }
    }

    fetchAlbumDetails()
  }, [albumId])

  if (loadingPage) {
    return (
      <div className="container py-8">
        <Loading />
      </div>
    )
  }

  if (errorPage) {
    return <ErrorDisplay message={errorPage} />
  }

  if (!album) {
    return <ErrorDisplay message="Album not found" />
  }

  return (
    <div className="container py-8">
      <div className="flex gap-16 mb-16">
        <div className="w-2/3">
          <Text variant="h1" className="mb-4">
            {album.name}
          </Text>
          {/* TODO: link to artist */}
          <Text variant="h3">{album?.artists[0]?.name}</Text>

          <div className="my-8">
            <AlbumOverview album={album} />
          </div>

          <Tracklist tracks={album.tracks.items} />
        </div>
        <div className="w-1/3">
          {album.images && album.images.length > 0 && (
            <img
              src={album.images[0].url}
              alt={`Album cover ${album.name}`}
              className="w-full aspect-square"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default AlbumPage
