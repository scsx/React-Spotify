import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LastFmTag } from '@/types/LastFmTag'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { FaLastfm } from 'react-icons/fa'

interface ArtistsGenresProps {
  genres: string[]
  lastFmTags?: LastFmTag[]
}

const ArtistsGenres: React.FC<ArtistsGenresProps> = ({ genres, lastFmTags }): JSX.Element => {
  const [activeTab, setActiveTab] = useState('spotifyGenres')

  const onTabChange = (value: string) => {
    setActiveTab(value)
  }

  useEffect(() => {
    setActiveTab('spotifyGenres')
  }, [genres, lastFmTags])

  const renderSpotifyGenres = (): JSX.Element[] | null => {
    if (genres && genres.length > 0) {
      return genres.map((genre) => {
        return (
          <Link key={genre} to={`/genre/${genre}`}>
            <Badge
              variant='outline'
              className='text-sm mt-2 mr-2 font-normal bg-secondary hover:bg-primary dark:hover:text-white dark:text-muted-foreground'>
              {genre}
            </Badge>
          </Link>
        )
      })
    } else {
      return null
    }
  }

  return (
    <>
      {genres && lastFmTags ? (
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList>
            <TabsTrigger value='spotifyGenres'>Spotify</TabsTrigger>
            <TabsTrigger value='lastfmGenres'>LastFM</TabsTrigger>
          </TabsList>
          <TabsContent value='spotifyGenres'>{renderSpotifyGenres()}</TabsContent>
          <TabsContent value='lastfmGenres'>
            {lastFmTags.map((tag) => {
              return (
                <a key={tag.url} href={tag.url} target='_blank'>
                  <Badge
                    variant='outline'
                    className='text-sm mt-2 mr-2 font-normal bg-secondary hover:bg-primary dark:hover:text-white dark:text-muted-foreground'>
                    <FaLastfm className='text-red-500 mr-2' /> {tag.name}
                  </Badge>
                </a>
              )
            })}
          </TabsContent>
        </Tabs>
      ) : (
        <div className='grid grid-cols-3 gap-4'>{renderSpotifyGenres()}</div>
      )}
    </>
  )
}

export default ArtistsGenres
