import { useEffect, useState } from 'react'

import { useLocation, useParams } from 'react-router-dom'

import { LastFmArtist } from '@/types/LastFmArtist'
import { TLastFmTag } from '@/types/LastFmTag'
import { TSpotifyArtist } from '@/types/SpotifyArtist'

import Albums from '@/components/Artist/AlbumsAndBio'
import ArtistHero from '@/components/Artist/ArtistHero'
import ArtistsGenres from '@/components/Artist/ArtistsGenres'
import SimilarArtists from '@/components/Artist/SimilarArtists'
import TopTracks from '@/components/Artist/TopTracks'
import Text from '@/components/Text'
import { AspectRatio } from '@/components/ui/aspect-ratio'

import { getLastFMArtistInfo } from '@/services/lastfm/getLastFMArtistInfo'
import { getSpotifyArtist } from '@/services/spotify/getSpotifyArtist'

const Artist = (): JSX.Element => {
  const { artistId } = useParams<string>()
  const [artist, setArtist] = useState<TSpotifyArtist | null>(null)
  const [lastFmArtist, setLastFmArtist] = useState<LastFmArtist | null>(null)
  const [lastFmArtistTags, setLastFmArtistTags] = useState<TLastFmTag[] | null>(null)
  const [loadingPage, setLoadingPage] = useState(true)
  const [errorPage, setErrorPage] = useState<string | null>(null)
  const location = useLocation()

  useEffect(() => {
    const fetchData = async () => {
      setLoadingPage(true)
      setErrorPage(null)

      if (!artistId) {
        setErrorPage('Artist ID not provided in URL.')
        setLoadingPage(false)
        return
      }

      try {
        // Fetch artist information from Spotify
        const fetchedArtist = await getSpotifyArtist(artistId)
        setArtist(fetchedArtist)

        // Fetch artist information from Last.fm
        if (fetchedArtist && fetchedArtist.name) {
          const lastFmResponse = await getLastFMArtistInfo(fetchedArtist.name)

          if (lastFmResponse && !lastFmResponse.error) {
            setLastFmArtist(lastFmResponse.artist)

            const tags =
              lastFmResponse.artist?.tags?.tag?.map((tag: any) => ({
                name: tag.name,
                url: tag.url,
              })) || []

            if (tags.length > 0) {
              setLastFmArtistTags(tags)
            } else {
              setLastFmArtistTags(null)
            }
          } else {
            console.error(
              'Artist Component: Erro do proxy Last.FM:',
              lastFmResponse?.error || 'Erro desconhecido'
            )
            setLastFmArtist(null)
            setLastFmArtistTags(null)
          }
        } else {
          console.warn(
            'Artist Component: Não foi possível buscar Last.fm: Artista Spotify não encontrado ou sem nome.'
          )
        }
      } catch (error: any) {
        console.error('Artist Component: Erro ao buscar detalhes do artista:', error)
        // O axiosInterceptor deve lidar com 401s, mas outros erros podem acontecer
        if (error.response && error.response.status === 401) {
          setErrorPage('Sessão expirada. Por favor, faça login novamente.')
        } else {
          setErrorPage(`Erro ao carregar artista: ${error.message || 'Erro desconhecido'}`)
        }
        setArtist(null)
      } finally {
        setLoadingPage(false)
      }
    }

    fetchData()
  }, [artistId])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // Disable browser's scroll restoration.
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [location.pathname])

  if (loadingPage) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center h-screen-minus-header">
        <Text variant="h2">Loading...</Text>
      </div>
    )
  }

  if (errorPage) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center h-screen-minus-header">
        <Text variant="paragraph">{errorPage}</Text>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1">
      {artist && (
        <>
          <ArtistHero artist={artist} />

          <div className="relative container">
            <div className="grid grid-cols-4 gap-16">
              <div className="col-span-2">
                <Albums
                  biographyLastFM={lastFmArtist ? lastFmArtist.bio.content : ''}
                  artistName={artist.name}
                  artistURI={artist.uri}
                />
              </div>
              <div className="col-span-2 pt-16">
                <div className="grid grid-cols-3 gap-8 -mt-28">
                  <div className="col-start-2 col-end-4">
                    <AspectRatio ratio={1 / 1} className="rounded-sm overflow-hidden">
                      <img
                        className="rounded-sm p-1 bg-white dark:bg-black"
                        src={`${artist.images[0].url}`}
                        alt=""
                      />
                    </AspectRatio>
                  </div>
                </div>
                <TopTracks artistId={artist.id} />

                <ArtistsGenres genres={artist.genres} lastFmTags={lastFmArtistTags ?? []} />

                {/* <SimilarArtists artistId={artist.id} lastFmSimilar={lastFmArtist?.similar!} /> */}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Artist
