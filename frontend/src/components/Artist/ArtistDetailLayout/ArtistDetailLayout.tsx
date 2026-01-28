import { useEffect, useState } from 'react'

import { useLocation, useParams } from 'react-router-dom'

import { TLastFmArtistGetInfoResponse } from '@/types/LastFmArtist'
import { TLastFmTag } from '@/types/LastFmTag'
import { TSpotifyArtist } from '@/types/SpotifyArtist'

import AlbumsAndBio from '@/components/Artist/AlbumsAndBio'
import ArtistHero from '@/components/Artist/ArtistHero'
import ArtistsGenres from '@/components/Artist/ArtistsGenres'
import SimilarArtists from '@/components/Artist/SimilarArtists'
import TopTracks from '@/components/Artist/TopTracks'
import Loading from '@/components/Loading'
import Text from '@/components/Text'
import { AspectRatio } from '@/components/ui/aspect-ratio'

import { getLastFMArtistInfo } from '@/services/lastfm/getLastFMArtistInfo'
import { getSpotifyArtist } from '@/services/spotify/getSpotifyArtist'

const ArtistDetailLayout = (): JSX.Element => {
  const { artistId } = useParams<string>()
  const location = useLocation()

  const [artist, setArtist] = useState<TSpotifyArtist | null>(null)
  const [lastFmResponseData, setLastFmResponseData] = useState<TLastFmArtistGetInfoResponse | null>(
    null
  )
  const [lastFmArtistTags, setLastFmArtistTags] = useState<TLastFmTag[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!artistId) {
        setError('Artist ID not provided.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const fetchedArtist = await getSpotifyArtist(artistId)
        setArtist(fetchedArtist)

        if (fetchedArtist?.name) {
          const lastFmResponse = await getLastFMArtistInfo(fetchedArtist.name)

          if ('error' in lastFmResponse) {
            setLastFmResponseData(null)
            setLastFmArtistTags(null)
          } else {
            setLastFmResponseData(lastFmResponse)

            const tags =
              lastFmResponse.artist?.tags?.tag?.map((tag) => ({
                name: tag.name,
                url: tag.url,
              })) ?? []

            setLastFmArtistTags(tags.length > 0 ? tags : null)
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Erro ao carregar artista.')
        }
        setArtist(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [artistId])

  useEffect(() => {
    window.scrollTo({ top: 0 })
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [location.pathname])

  if (loading) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center h-[600px]">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center h-[600px]">
        <Text variant="paragraph">{error}</Text>
      </div>
    )
  }

  if (!artist) return <></>

  return (
    <>
      <ArtistHero artist={artist} />

      <div className="relative container">
        <div className="grid grid-cols-4 gap-16">
          <div className="col-span-2">
            <AlbumsAndBio
              biographyLastFM={lastFmResponseData?.artist?.bio?.content || ''}
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
            <SimilarArtists
              artistId={artist.id}
              lastFmSimilar={lastFmResponseData?.artist?.similar || []}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default ArtistDetailLayout
