import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import { TSpotifyArtist } from '@/types/SpotifyArtist'
import { FaLastfm } from 'react-icons/fa'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { getSpotifyRelatedArtists } from '@/services/spotify/getSpotifyRelatedArtists'

import CardArtistLight from './CardArtistLight'

interface RelatedArtistsProps {
  artistId: string
  lastFmSimilar?: any
}

const RelatedArtists: React.FC<RelatedArtistsProps> = ({
  artistId,
  lastFmSimilar,
}): JSX.Element => {
  const [relatedArtists, setRelatedArtists] = useState<TSpotifyArtist[] | null>(null)
  const [activeTab, setActiveTab] = useState('spotifyRelated')

  const onTabChange = (value: string) => {
    setActiveTab(value)
  }

  useEffect(() => {
    const getArtistsById = async () => {
      try {
        const fetchedData = await getSpotifyRelatedArtists(artistId)
        setRelatedArtists(fetchedData.artists)
      } catch (error) {
        console.error('Error fetching top tracks:', error)
      }
    }

    getArtistsById()
  }, [artistId, lastFmSimilar])

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
    </>
  )
}

export default RelatedArtists
