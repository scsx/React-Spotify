import React, { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { TSpotifyAlbum } from '@/types/SpotifyAlbum'

import AlbumOverview from '@/components/Album/AlbumOverview'
import Tracklist from '@/components/Album/Tracklist'
import ErrorDisplay from '@/components/ErrorDisplay'
import Hyperlink from '@/components/Hyperlink'
import Loading from '@/components/Loading'
import Text from '@/components/Text'
import { Progress } from '@/components/ui/progress'

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
        console.log(albumData)
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
          <Text variant="h1" className="mb-2">
            {album.name}
          </Text>
          <Text variant="h3" className="font-bold">
            {album?.artists?.map((artist, index, array) => (
              <React.Fragment key={artist.id}>
                <Hyperlink href={`/artists/${artist.id}`} variant="icon">
                  {artist.name}
                </Hyperlink>
                {index < array.length - 1 && <span className="opacity-50">, </span>}
              </React.Fragment>
            ))}
          </Text>
          <Progress value={album.popularity} className="h-1 mt-5 mx-auto" />
          <div className="mt-4 mb-12">
            <AlbumOverview album={album} />
          </div>

          <Tracklist tracks={album.tracks.items} />
        </div>
        <div className="w-1/3">
          {album.images && album.images.length > 0 && (
            <img
              src={album.images[0].url}
              alt={`Album cover ${album.name}`}
              className="w-full aspect-square mb-2"
            />
          )}
          {album.label && (
            <Text variant="h5" className="mb-2">
              {album.label}
            </Text>
          )}
        </div>
      </div>
    </div>
  )
}

export default AlbumPage
