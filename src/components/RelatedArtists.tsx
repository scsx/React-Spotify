import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getRelatedArtists } from '@/services/SpotifyGetRelatedArtists'
import { SpotifyArtist } from '@/types/SpotifyArtist'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CardArtistLight from './CardArtistLight'

interface RelatedArtistsProps {
  artistId: string
  lastFmSimilar?: any
}

const RelatedArtists: React.FC<RelatedArtistsProps> = ({
  artistId,
  lastFmSimilar
}): JSX.Element => {
  const [relatedArtists, setRelatedArtists] = useState<SpotifyArtist[] | null>(null)

  useEffect(() => {
    const getArtistsById = async () => {
      try {
        const fetchedData = await getRelatedArtists(artistId)
        setRelatedArtists(fetchedData.artists)
      } catch (error) {
        console.error('Error fetching top tracks:', error)
      }
    }

    getArtistsById()
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
        <Tabs defaultValue='spotifyRelated'>
          <TabsList>
            <TabsTrigger value='spotifyRelated'>Spotify</TabsTrigger>
            <TabsTrigger value='lastfmRelated'>LastFM</TabsTrigger>
          </TabsList>
          <TabsContent value='spotifyRelated'>
            <div className='grid grid-cols-3 gap-4'>{renderSpotifyRelated()}</div>
          </TabsContent>
          <TabsContent value='lastfmRelated'>
            {lastFmSimilar &&
              lastFmSimilar.artist &&
              lastFmSimilar.artist.map((artist: any) => {
                return (
                  <div className='mt-4' key={artist.name}>
                    <h5 className='text-lg'>{artist.name}</h5>
                    <div className='flex'>
                      <Link
                        className='inline-block text-sm mr-4 text-slate-500'
                        to={`/?searchKey=${artist.name}`}>
                        Search this app
                      </Link>
                      <a
                        className='inline-block text-sm mr-4 text-slate-500'
                        target='_blank'
                        href={artist.url}>
                        View on LastFM
                      </a>
                    </div>
                  </div>
                )
              })}
          </TabsContent>
        </Tabs>
      ) : (
        <div className='grid grid-cols-3 gap-4'>{renderSpotifyRelated()}</div>
      )}
    </>
  )
}

export default RelatedArtists
