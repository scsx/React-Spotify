import { useEffect, useState } from 'react'

import { useLocation, useParams } from 'react-router-dom'

import { LastFmArtist } from '@/types/LastFmArtist'
import { LastFmTag } from '@/types/LastFmTag'
import { SpotifyArtist } from '@/types/SpotifyArtist'
import axios from 'axios'

import Albums from '@/components/AlbumsAndBio'
import ArtistsGenres from '@/components/ArtistsGenres'
import HeadingOne from '@/components/HeadingOne'
import RelatedArtists from '@/components/RelatedArtists'
import TopTracks from '@/components/TopTracks'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Progress } from '@/components/ui/progress'

import { useToken } from '@/contexts/TokenContext'

import { getArtist } from '@/services/SpotifyGetArtist'

const Artist = (): JSX.Element => {
  const { artistId } = useParams<string>()
  const [artist, setArtist] = useState<SpotifyArtist | null>(null)
  const [lastFmArtist, setLastFmArtist] = useState<LastFmArtist | null>(null)
  const [lastFmArtistTags, setLastFmArtistTags] = useState<LastFmTag[] | null>(null)
  const token = useToken()
  const location = useLocation()

  let lastFmTags: LastFmTag[] = []

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (artistId) {
          // Fetch artist information from Spotify
          const fetchedArtist = await getArtist(artistId)
          setArtist(fetchedArtist)

          // Fetch artist information from Last.fm
          if (token) {
            const lastFmResponse = await axios.get(
              `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(
                fetchedArtist.name
              )}&api_key=${token.lastFMKey}&format=json`
            )
            setLastFmArtist(lastFmResponse.data.artist)

            lastFmTags = lastFmResponse.data.artist.tags.tag.map((tag: any) => {
              return {
                name: tag.name,
                url: tag.url,
              }
            })

            if (lastFmTags) {
              setLastFmArtistTags(lastFmTags)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching artist details:', error)
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
                <div>
                  <h3 className="mt-14 mb-4 text-1xl md:text-3xl">Related Artists</h3>
                  <RelatedArtists artistId={artist.id} lastFmSimilar={lastFmArtist?.similar!} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Artist
