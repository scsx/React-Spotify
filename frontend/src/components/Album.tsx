import { Link } from 'react-router-dom'

import { TSpotifyAlbum } from '@/types/SpotifyAlbum'
import { CiCalendarDate } from 'react-icons/ci'
import { CiBoxList } from 'react-icons/ci'

import Text from '@/components/Text'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface SpotifyAlbumProps {
  album: TSpotifyAlbum
}

const Album: React.FC<SpotifyAlbumProps> = ({ album }): JSX.Element => {
  return (
    <Card className="flex flex-col">
      <CardHeader className="p-0">
        <AspectRatio
          ratio={1 / 1}
          className="w-full rounded-tl-sm rounded-tr-sm overflow-hidden p-1"
        >
          <img
            src={album.images[1]?.url}
            className="object-cover w-full text-sm text-gray-400 dark:text-gray-700 rounded-tl-sm rounded-tr-sm"
          />
        </AspectRatio>
      </CardHeader>
      <CardContent className="py-2 px-4 flex-1">
        <CardTitle>
          <Link to={`/album/${album.id}`}>
            {album.name.includes('(') ? (
              <>
                <Text variant="h3" className="block mt-2">
                  {album.name.split('(')[0]}
                </Text>
                <small className="block mb-2 text-base font-normal text-gray-500 dark:text-gray-400">
                  ({album.name.split('(')[1]})
                </small>
              </>
            ) : (
              <Text variant="h3" className="block mt-2">
                {album.name}
              </Text>
            )}
          </Link>
        </CardTitle>
      </CardContent>
      <CardFooter className="flex px-4">
        <Text color="muted" className="flex flex-1 items-center -ml-1">
          <CiCalendarDate className="text-2xl mr-2" />
          {album.release_date}
        </Text>
        <Text color="muted" className="flex items-center pr-4">
          <CiBoxList className="text-xl mr-2" />
          {album.total_tracks}
        </Text>
      </CardFooter>
    </Card>
  )
}

export default Album
