import { useEffect, useState } from 'react'

import { useLocation, useParams } from 'react-router-dom'

import { LastFmArtist } from '@/types/LastFmArtist'
import { TLastFmTag } from '@/types/LastFmTag'
import { TSpotifyArtist } from '@/types/SpotifyArtist'

import Albums from '@/components/AlbumsAndBio'
import ArtistsGenres from '@/components/Artist/ArtistsGenres'
import RelatedArtists from '@/components/Artist/RelatedArtists'
import HeadingOne from '@/components/HeadingOne'
import TopTracks from '@/components/TopTracks'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Progress } from '@/components/ui/progress'

import { useToken } from '@/contexts/TokenContext'

import { getLastFMArtistInfo } from '@/services/lastfm/getLastFMArtistInfo'
import { getSpotifyArtist } from '@/services/spotify/getSpotifyArtist'

/* TODO: remove unused vars */

const Artist = (): JSX.Element => {
  const { artistId } = useParams<string>()
  const [artist, setArtist] = useState<TSpotifyArtist | null>(null)
  const [lastFmArtist, setLastFmArtist] = useState<LastFmArtist | null>(null)
  const [lastFmArtistTags, setLastFmArtistTags] = useState<TLastFmTag[] | null>(null)
  const { tokenInfo, isValid } = useToken()
  const [loadingPage, setLoadingPage] = useState(true)
  const [errorPage, setErrorPage] = useState<string | null>(null)
  const location = useLocation()

  useEffect(() => {
    const fetchData = async () => {
      setLoadingPage(true)
      setErrorPage(null)

      if (!isValid || !tokenInfo?.accessToken) {
        console.warn(
          'Artist Component: Spotify token not valid or available. Skipping Spotify API calls.'
        )
        setErrorPage(
          'Autenticação necessária ou token expirado. Por favor, tente fazer login novamente.'
        )
        setArtist(null)
        setLastFmArtist(null)
        setLastFmArtistTags(null)
        setLoadingPage(false)
        return
      }

      if (!artistId) {
        setErrorPage('ID do artista não fornecido na URL.')
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
        setArtist(null) // Limpa dados em caso de erro
      } finally {
        setLoadingPage(false) // Finaliza o estado de carregamento
      }
    }

    fetchData()
    // Adicione tokenInfo.accessToken às dependências para re-executar se o token mudar/for carregado
  }, [artistId, tokenInfo?.accessToken, isValid])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // Disable browser's scroll restoration.
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [location.pathname])

  return (
    <div className="flex flex-col flex-1">
      {artist && (
        <>
          <div
            className="w-full -mt-40 absolute h-96 bg-cover blur-sm bg-center bg-no-repeat z-0"
            style={{
              backgroundImage: `url(${artist.images[0].url})`,
            }}
          ></div>
          <div className="w-full -mt-4 absolute top-96 h-8 z-0 bg-white dark:bg-background transition duration-500"></div>
          <div className="relative container">
            <div className="-mt-4 bg-white dark:bg-black inline-block p-4 rounded-sm rounded-bl-none">
              <HeadingOne
                text={artist.name}
                classes="text-3xl md:text-6xl font-semibold mb-0 tracking-wide min-w-40"
              />
              <Progress value={artist.popularity} className="h-1 mt-4 mx-auto" />
            </div>
            <div className="mb-6">
              <div className="inline-block bg-white dark:bg-black py-2 px-4 rounded-bl-sm rounded-br-sm">
                <div className="flex items-center">
                  <div>{artist.followers.total.toLocaleString()} followers</div>
                </div>
              </div>
            </div>

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
                <div>
                  <h3 className="mt-10 mb-4 text-1xl md:text-3xl">Top Tracks</h3>
                  <TopTracks artistId={artist.id} />
                </div>
                <div>
                  <h3 className="mt-14 mb-4 text-1xl md:text-3xl">Genres</h3>
                  <ArtistsGenres genres={artist.genres} lastFmTags={lastFmArtistTags ?? []} />
                </div>

                <RelatedArtists
                  genres={artist.genres}
                  artistId={artist.id}
                  lastFmSimilar={lastFmArtist?.similar!}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Artist
