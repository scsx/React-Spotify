import { Link } from 'react-router-dom'
import { SpotifyAlbum } from '@/types/SpotifyAlbum'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { AspectRatio } from '@/components/ui/aspect-ratio'

interface SpotifyAlbumProps {
  album: SpotifyAlbum
}

const Album: React.FC<SpotifyAlbumProps> = ({ album }): JSX.Element => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{album.name}</CardTitle>
        <AspectRatio ratio={1 / 1}>
          <img
            src={album.images[1]?.url}
            className='object-cover text-sm text-gray-400 dark:text-gray-700'
          />
        </AspectRatio>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  )
}

export default Album
