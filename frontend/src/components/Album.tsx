import { Link } from 'react-router-dom'
import { SpotifyAlbum } from '@/types/SpotifyAlbum'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { CiCalendarDate } from 'react-icons/ci'
import { CiBoxList } from 'react-icons/ci'

interface SpotifyAlbumProps {
  album: SpotifyAlbum
}

const Album: React.FC<SpotifyAlbumProps> = ({ album }): JSX.Element => {
  const titleClasses = 'block text-2xl leading-tight mt-2'

  return (
    <Card className='flex flex-col'>
      <CardHeader className='p-0'>
        <AspectRatio ratio={1 / 1} className='w-full rounded-tl-sm rounded-tr-sm overflow-hidden p-1'>
          <img
            src={album.images[1]?.url}
            className='object-cover w-full text-sm text-gray-400 dark:text-gray-700 rounded-tl-sm rounded-tr-sm'
          />
        </AspectRatio>
      </CardHeader>
      <CardContent className='p-4 pt-0 flex-1'>
        <CardTitle>
          <Link to={`/album/${album.id}`}>
            {album.name.includes('(') ? (
              <>
                <span className={titleClasses}>{album.name.split('(')[0]}</span>
                <small className='block mb-2 text-base font-normal text-gray-500 dark:text-gray-400'>
                  ({album.name.split('(')[1]}
                </small>
              </>
            ) : (
              <span className={titleClasses}>{album.name}</span>
            )}
          </Link>
        </CardTitle>
      </CardContent>
      <CardFooter className='flex px-4'>
        <p className='flex flex-1 font-normal text-gray-500 dark:text-gray-400'>
          <CiCalendarDate className='text-2xl mr-2' />
          {album.release_date}
        </p>
        <p className='flex pr-4 font-normal text-gray-500 dark:text-gray-400'>
          <CiBoxList className='text-2xl mr-2' />
          {album.total_tracks}
        </p>
      </CardFooter>
    </Card>
  )
}

export default Album
