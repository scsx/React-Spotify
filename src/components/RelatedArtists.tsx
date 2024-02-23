import { useState, useEffect } from 'react'
import { getRelatedArtists } from '@/services/SpotifyGetRelatedArtists'
import { SpotifyArtist } from '@/types/SpotifyArtist'
import CardArtistLight from './CardArtistLight'

interface RelatedArtistsProps {
  artistId: string
}

const RelatedArtists: React.FC<RelatedArtistsProps> = ({ artistId }): JSX.Element => {
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
  }, [artistId])

  return (
    <div className='grid grid-cols-3 gap-4'>
      {relatedArtists &&
        relatedArtists.map((artist) => {
          return <CardArtistLight key={artist.id} artist={artist} />
        })}
    </div>
  )
}

export default RelatedArtists
