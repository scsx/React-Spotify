import React, { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { TSpotifyAlbum } from '@/types/SpotifyAlbum'

import AlbumLastFmInfo from '@/components/Album/AlbumLastFmInfo'
import AlbumOverview from '@/components/Album/AlbumOverview'
import AlbumTracklist from '@/components/Album/AlbumTracklist'
import ErrorDisplay from '@/components/ErrorDisplay'
import Hyperlink from '@/components/Hyperlink'
import Loading from '@/components/Loading'
import Text from '@/components/Text'
import { Progress } from '@/components/ui/progress'

import { getSpotifyAlbum } from '@/services/spotify/getSpotifyAlbum'

import { checkSpotifyContentAvailability } from '@/lib/check-spotify-content-availability'

const AlbumPage = () => {
  const { albumId } = useParams<{ albumId: string }>()
  const [album, setAlbum] = useState<TSpotifyAlbum | null>(null)
  const [availableInPT, setAvailableInPT] = useState<boolean>(false)
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
        setAlbum(albumData)

        const isAvailable = await checkSpotifyContentAvailability('album', albumId)
        setAvailableInPT(isAvailable)
      } catch (error) {
        console.error('Erro ao carregar detalhes do álbum:', error)
        setErrorPage('Album details not found')
      } finally {
        setLoadingPage(false)
      }
    }

    fetchAlbumDetails()
  }, [albumId])

  if (loadingPage) return <Loading />
  if (errorPage) return <ErrorDisplay message={errorPage} />

  if (!album) {
    return <ErrorDisplay message="Album not found" />
  }

  return (
    <div className="container py-8">
      <div className="flex gap-16 mb-16">
        <div className="w-2/3">
          {album.name.includes('(') ? (
            <>
              <Text variant="h1" className="block mb-1">
                {album.name.split('(')[0]}
              </Text>
              <Text variant="h3" className="mb-2">
                ({album.name.split('(')[1].slice(0, -1)})
              </Text>
            </>
          ) : (
            <Text variant="h1" className="mb-2">
              {album.name}
            </Text>
          )}
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
            <AlbumOverview album={album} availableInPT={availableInPT} />
          </div>

          <AlbumTracklist tracks={album.tracks.items} />
        </div>
        <div className="w-1/3">
          {album.images && album.images.length > 0 && (
            <img
              src={album.images[0].url}
              alt={`Album cover ${album.name}`}
              className="w-full aspect-square mb-2"
            />
          )}
          {album.label && <Text className="mb-2">{album.label}</Text>}

          <AlbumLastFmInfo artistName={album.artists[0]?.name || ''} albumName={album.name} />
        </div>
      </div>
    </div>
  )
}

export default AlbumPage
