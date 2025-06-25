import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import { TSpotifyArtist } from '@/types/SpotifyArtist'
import { TSpotifyGenres } from '@/types/SpotifyGenres'
import { FaLastfm } from 'react-icons/fa'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { getSpotifyFakeRelatedArtists } from '@/services/spotify/getSpotifyFakeRelatedArtists'

import CardArtistLight from './CardArtistLight'

interface RelatedArtistsProps {
  artistId: string
  lastFmSimilar?: any
  genres?: TSpotifyGenres
}

const RelatedArtists: React.FC<RelatedArtistsProps> = ({
  artistId,
  lastFmSimilar,
  genres,
}): JSX.Element => {
  const [relatedArtists, setRelatedArtists] = useState<TSpotifyArtist[] | null>(null)
  const [activeTab, setActiveTab] = useState('spotifyRelated')

  const onTabChange = (value: string) => {
    setActiveTab(value)
  }

  useEffect(() => {
    const fetchSpotifySimilarArtists = async () => {
      if (!genres || genres.length === 0) {
        return
      }

      try {
        const params = {
          artist: { id: artistId, genres: genres } as TSpotifyArtist,
          genres: genres,
        }

        const data = await getSpotifyFakeRelatedArtists(params)
        setRelatedArtists(data.artists)
      } catch (err: any) {}
    }

    fetchSpotifySimilarArtists()
  }, [artistId, genres])

  useEffect(() => {
    setActiveTab('spotifyRelated')
  }, [artistId, lastFmSimilar])

  const renderSpotifyRelated = (): JSX.Element[] | null => {
    if (relatedArtists && relatedArtists.length > 0) {
      return relatedArtists.map((artist) => {
        return <CardArtistLight key={artist.id} artist={artist} />
      })
    } else {
      return null
    }
  }

  return (
    <>
      <h3 className="mt-14 mb-4 text-1xl md:text-3xl">Related Artists</h3>

      {relatedArtists && lastFmSimilar ? (
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList>
            <TabsTrigger value="spotifyRelated">Spotify</TabsTrigger>
            <TabsTrigger value="lastfmRelated">LastFM</TabsTrigger>
          </TabsList>
          <TabsContent value="spotifyRelated">
            <div className="grid grid-cols-3 gap-4">{renderSpotifyRelated()}</div>
          </TabsContent>
          <TabsContent value="lastfmRelated">
            {lastFmSimilar &&
              lastFmSimilar.artist &&
              lastFmSimilar.artist.map((artist: any) => {
                return (
                  <div className="mt-4" key={artist.name}>
                    <h5 className="text-lg">{artist.name}</h5>
                    <div className="flex">
                      <Link
                        className="inline-block text-sm mr-8 text-gray-500 hover:text-black dark:hover:text-white"
                        to={`/?searchKey=${artist.name}`}
                      >
                        Search this app
                      </Link>
                      <a
                        className="flex text-sm mr-4 text-gray-500 hover:text-black dark:hover:text-white"
                        target="_blank"
                        href={artist.url}
                      >
                        <FaLastfm className="text-red-500 mt-1 mr-1" />
                        View on LastFM
                      </a>
                    </div>
                  </div>
                )
              })}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="grid grid-cols-3 gap-4">{renderSpotifyRelated()}</div>
      )}
      <p className="mt-4 text-gray-500 text-sm">
        The Spotify endpoint for related artists is deprecated for{' '}
        <a
          href="https://developer.spotify.com/documentation/web-api/tutorials/implicit-flow"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="link" className="p-0">
            implicit grant
          </Button>
        </a>
        . This is a workaround using search.
      </p>
    </>
  )
}

export default RelatedArtists
