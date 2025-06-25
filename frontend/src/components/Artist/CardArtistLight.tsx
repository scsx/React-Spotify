import { Link } from 'react-router-dom'

import { TSpotifyArtist } from '@/types/SpotifyArtist'
import { FaGoogle } from 'react-icons/fa'
import { FaSpotify } from 'react-icons/fa'
import { FaBullseye } from 'react-icons/fa6'

import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface CardArtistLightProps {
  artist: TSpotifyArtist
}

const CardArtistLight: React.FC<CardArtistLightProps> = ({ artist }): JSX.Element => {
  return (
    <Card>
      <CardContent className="flex flex-col">
        <div className="w-2/3 mx-auto my-4 overflow-hidden bg-slate-200 dark:bg-black rounded-full">
          <AspectRatio ratio={1 / 1}>
            <img
              src={artist.images[0]?.url}
              alt={Array(40).fill(artist.name).join(' ')} // In case of no image.
              className="object-cover text-sm text-gray-400 dark:text-gray-700"
            />
          </AspectRatio>
        </div>
        <CardHeader className="text-center p-0 flex-grow">
          <CardTitle className="text-xl font-medium">
            <Link to={`/artists/${artist.id}`}>{artist.name}</Link>
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col pt-3 pb-0">
          <Progress value={artist.popularity} className="h-1" />
          <div className="flex pt-3">
            <Link to={`/${artist.id}`}>
              <FaBullseye className="mx-2 text-muted-foreground hover:text-primary" />
            </Link>
            <a target="_blank" href={artist.uri}>
              <FaSpotify className="mx-2 text-muted-foreground hover:text-primary" />
            </a>
            <a target="_blank" href={`https://www.google.com/search?q=${artist.name}`}>
              <FaGoogle className="mx-2 text-muted-foreground hover:text-primary" />
            </a>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  )
}

export default CardArtistLight
