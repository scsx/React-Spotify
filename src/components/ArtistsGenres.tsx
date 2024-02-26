import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LastFmTag } from '@/types/LastFmTag'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { FaLastfm } from 'react-icons/fa'
import { LuPlusCircle } from 'react-icons/lu'

interface ArtistsGenresProps {
  genres: string[]
  lastFmTags?: LastFmTag[]
}

const ArtistsGenres: React.FC<ArtistsGenresProps> = ({ genres, lastFmTags }): JSX.Element => {
  const [activeTab, setActiveTab] = useState('spotifyGenres')
  const [searchQuery, setSearchQuery] = useState(['pop rock'])

  const onTabChange = (value: string) => {
    setActiveTab(value)
  }

  const addToSearch = () => {
    console.log('hey')
  }

  useEffect(() => {
    setActiveTab('spotifyGenres')
  }, [genres, lastFmTags])

  const renderSpotifyGenres = (): JSX.Element[] | null => {
    if (genres && genres.length > 0) {
      return genres.map((genre) => {
        return (
          <Badge
            key={genre}
            variant='outline'
            className='text-base mt-2 mr-2 font-normal bg-secondary'>
            <Link
              to={`/genre/${genre}`}
              className='dark:hover:text-white dark:text-muted-foreground'>
              {genre}
            </Link>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <LuPlusCircle
                    onClick={addToSearch}
                    className='text-lg ml-2 dark:hover:text-primary dark:text-muted-foreground'
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to search</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Badge>
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
      {searchQuery.length === 0 ? (
        <p className='mt-8 text-gray-500 text-sm'>
          Click on a genre to search or <LuPlusCircle className='inline' /> to search for multiple
          genres.
        </p>
      ) : (
        <p className='mt-8 text-gray-500 text-sm'>
          Search for{' '}
          <Badge
            variant='outline'
            className='text-sm mt-2 mr-2 font-normal bg-secondary hover:bg-primary dark:hover:text-white dark:text-muted-foreground'>
            {searchQuery[0]}
          </Badge>
        </p>
      )}
    </>
  )
}

export default ArtistsGenres
