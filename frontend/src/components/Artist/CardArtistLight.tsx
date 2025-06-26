import { TSpotifyArtist } from '@/types/SpotifyArtist'
import { FaGoogle } from 'react-icons/fa'
import { FaSpotify } from 'react-icons/fa'
import { FaBullseye } from 'react-icons/fa6'

import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface CardArtistLightProps {
  artist: TSpotifyArtist
}

const CardArtistLight: React.FC<CardArtistLightProps> = ({ artist }): JSX.Element => {
  return (
    <Card className="flex flex-col h-full">
      <CardContent className="flex flex-col p-0 flex-grow">
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
          <Text variant="h4" as="h4">
            <Hyperlink variant="title" href={`/artists/${artist.id}`}>
              {artist.name}
            </Hyperlink>
          </Text>
        </CardHeader>
        <CardFooter className="flex-col py-4">
          <Progress value={artist.popularity} className="h-1" />
          <div className="flex space-x-3 pt-3">
            <Hyperlink variant="icon" href={`/${artist.id}`}>
              <FaBullseye />
            </Hyperlink>
            <Hyperlink variant="icon" href={artist.uri} external>
              <FaSpotify />
            </Hyperlink>
            <Hyperlink
              variant="icon"
              href={`https://www.google.com/search?q=${artist.name}`}
              external
            >
              <FaGoogle />
            </Hyperlink>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  )
}

export default CardArtistLight
