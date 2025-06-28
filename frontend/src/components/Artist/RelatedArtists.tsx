import { useEffect, useState } from 'react'

import { TSpotifyArtist } from '@/types/SpotifyArtist'
import { FaLastfm } from 'react-icons/fa'

import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { getSpotifySimilarArtists } from '@/services/spotify/getSpotifySimilarArtists'

import CardArtistLight from './CardArtistLight'

interface RelatedArtistsProps {
  artistId: string
  lastFmSimilar?: any
}

const RelatedArtists: React.FC<RelatedArtistsProps> = ({
  artistId,
  lastFmSimilar,
}): JSX.Element => {
  const [spotifySimilarArtists, setSpotifySimilarArtists] = useState<TSpotifyArtist[] | null>(null)
  const [activeTab, setActiveTab] = useState('spotifyRelated')

  const onTabChange = (value: string) => {
    setActiveTab(value)
  }

  useEffect(() => {
    const fetchSpotifySimilarArtists = async () => {
      try {
        const data = await getSpotifySimilarArtists(artistId)
        setSpotifySimilarArtists(data.artists)
      } catch (err: any) {
        console.error('Error fetching Spotify similar artists:', err)
        setSpotifySimilarArtists([])
      }
    }

    if (artistId) {
      fetchSpotifySimilarArtists()
    }
  }, [artistId])

  const renderSpotifySimilar = (): JSX.Element[] | null => {
    if (spotifySimilarArtists && spotifySimilarArtists.length > 0) {
      return spotifySimilarArtists.map((artist) => {
        return <CardArtistLight key={artist.id} artist={artist} />
      })
    } else {
      return null
    }
  }

  return (
    <>
      <Text variant="h2" className="mb-4">
        Related Artists
      </Text>

      {spotifySimilarArtists && lastFmSimilar ? (
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList>
            <TabsTrigger value="spotifyRelated">Spotify</TabsTrigger>
            <TabsTrigger value="lastfmRelated">LastFM</TabsTrigger>
          </TabsList>
          <TabsContent value="spotifyRelated">
            <div className="grid grid-cols-3 gap-4">{renderSpotifySimilar()}</div>
          </TabsContent>
          <TabsContent value="lastfmRelated">
            {lastFmSimilar &&
              lastFmSimilar.artist &&
              lastFmSimilar.artist.map((artist: any) => {
                return (
                  <div className="mt-4" key={artist.name}>
                    <h5 className="text-lg">{artist.name}</h5>
                    <div className="flex">
                      {/* TODO: test Hyperlink when LastFM works again. */}
                      <Hyperlink
                        className="inline-block text-sm mr-8 text-gray-500 hover:text-black dark:hover:text-white"
                        href={`/?searchKey=${artist.name}`}
                      >
                        Search this app
                      </Hyperlink>
                      <Hyperlink
                        className="flex text-sm mr-4 text-gray-500 hover:text-black dark:hover:text-white"
                        external
                        href={artist.url}
                      >
                        <FaLastfm className="text-red-500 mt-1 mr-1" />
                        View on LastFM
                      </Hyperlink>
                    </div>
                  </div>
                )
              })}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="grid grid-cols-3 gap-4">{renderSpotifySimilar()}</div>
      )}
      <Text color="gray" className="mt-4">
        The Spotify endpoint for related artists is deprecated for{' '}
        <Hyperlink
          href="https://developer.spotify.com/documentation/web-api/tutorials/implicit-flow"
          external
        >
          implicit grant
        </Hyperlink>
        . This workaround uses search.
      </Text>
    </>
  )
}

export default RelatedArtists
