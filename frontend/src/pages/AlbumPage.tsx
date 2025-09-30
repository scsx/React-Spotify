import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { TSpotifyAlbum } from '@/types/SpotifyAlbum'

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
      setErrorPage('ID do álbum em falta na URL.')
      setLoadingPage(false)
      return
    }

    setLoadingPage(true)
    setErrorPage(null)
    setAlbum(null)

    const fetchAlbumDetails = async () => {
      try {
        const albumData = await getSpotifyAlbum(albumId)
        setAlbum(albumData)
      } catch (error) {
        console.error('Erro ao carregar detalhes do álbum:', error)
        setErrorPage('Não foi possível carregar os detalhes do álbum. Tente novamente.')
      } finally {
        setLoadingPage(false)
      }
    }

    fetchAlbumDetails()
  }, [albumId])

  if (loadingPage) {
    return <Loading />
  }

  if (errorPage) {
    return <ErrorDisplay message={errorPage} />
  }

  if (!album) {
    return <ErrorDisplay message="Não foi encontrado o álbum. Por favor, verifique a URL." />
  }

  return (
    <div className="p-8">
      <Text variant="h1" className="mb-8">
        {album.name}
      </Text>
      <Text variant="h3">
        {album?.artists[0]?.name}
      </Text>

      {album.images && album.images.length > 0 && (
        <img
          src={album.images[0].url}
          alt={`Capa do álbum ${album.name}`}
          className="w-64 h-64 rounded-lg"
        />
      )}

    </div>
  )
}

export default AlbumPage
