import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LastFmTag } from '@/types/LastFmTag'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { FaLastfm } from 'react-icons/fa'
import { LuPlusCircle } from 'react-icons/lu'

interface ArtistsGenresProps {
  genres: string[]
  lastFmTags?: LastFmTag[]
}

const ArtistsGenres: React.FC<ArtistsGenresProps> = ({ genres, lastFmTags }): JSX.Element => {
  const [activeTab, setActiveTab] = useState('spotifyGenres')
  const [searchQuery, setSearchQuery] = useState<string[]>([])

  const onTabChange = (value: string) => {
    setActiveTab(value)
  }

  const addToSearch = (genre: string) => {
    if (!searchQuery.includes(genre)) {
      setSearchQuery((prevSearchQuery) => [...prevSearchQuery, genre])
    }
  }

  useEffect(() => {
    setActiveTab('spotifyGenres')
  }, [genres, lastFmTags])

  const badgeColors = 'dark:text-gray-200 hover:text-primary dark:hover:text-primary'

  const renderPlusWithTooltip = (brand: string, genre: string): JSX.Element => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className='p-1.5 pr-2'>
            <LuPlusCircle
              onClick={() => addToSearch(`${brand}:${genre}`)}
              className={`text-xl ${badgeColors}`}
            />
          </TooltipTrigger>
          <TooltipContent>
            <div>Add to search</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  const renderSpotifyGenres = (): JSX.Element[] | null => {
    if (genres && genres.length > 0) {
      return genres.map((genre) => {
        return (
          <div key={genre} className='fakebadge flex mt-3 mr-3 font-normal bg-secondary rounded-lg'>
            <Link to={`/genres/spotify:${genre}`} className={`p-1.5 pl-3 text-sm ${badgeColors}`}>
              {genre}
            </Link>
            <Separator
              orientation='vertical'
              className='h-full mx-0.5 w-px bg-white dark:bg-black'
            />
            {renderPlusWithTooltip('spotify', genre)}
          </div>
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
          <TabsList className='mb-4'>
            <TabsTrigger value='spotifyGenres'>Spotify</TabsTrigger>
            <TabsTrigger value='lastfmGenres'>LastFM</TabsTrigger>
          </TabsList>
          <TabsContent value='spotifyGenres' className='flex flex-wrap'>
            {renderSpotifyGenres()}
          </TabsContent>
          <TabsContent value='lastfmGenres'>
            <div className='flex flex-wrap'>
              {lastFmTags.map((tag) => {
                return (
                  <div
                    key={tag.name}
                    className='fakebadge flex mt-3 mr-3 font-normal bg-secondary rounded-lg'>
                    <a
                      key={tag.url}
                      href={tag.url}
                      className='p-1.5 pl-3 pt-2 text-base'
                      target='_blank'>
                      <FaLastfm className='text-red-500' />
                    </a>
                    <Separator
                      orientation='vertical'
                      className='h-full mx-0.5 w-px bg-white dark:bg-black'
                    />
                    <Link
                      to={`/genres/lastfm:${tag.name}`}
                      className={`p-1.5 px-3 text-sm ${badgeColors}`}>
                      {tag.name}
                    </Link>
                    <Separator
                      orientation='vertical'
                      className='h-full mx-0.5 w-px bg-white dark:bg-black'
                    />
                    {renderPlusWithTooltip('lastfm', tag.name)}
                  </div>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className='grid grid-cols-3 gap-4'>{renderSpotifyGenres()}</div>
      )}
      {searchQuery.length === 0 ? (
        <div className='mt-8 text-gray-500 text-sm'>
          Click on a genre to search or <LuPlusCircle className='inline' /> to search for multiple
          genres.
        </div>
      ) : (
        <div className='mt-8 text-gray-500 text-sm'>
          Search for{' '}
          <Badge
            variant='outline'
            className='text-sm mt-2 mr-2 font-normal bg-secondary hover:bg-primary dark:hover:text-white dark:text-muted-foreground'>
            <Link to={`/genres/${searchQuery}`}>{searchQuery}</Link>
          </Badge>
        </div>
      )}
    </>
  )
}

export default ArtistsGenres
