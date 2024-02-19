import { SpotifyArtist } from '@/types/SpotifyArtist'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { FaGoogle } from 'react-icons/fa'
import { MdOutlinePanoramaFishEye } from 'react-icons/md'
import { FaBullseye } from 'react-icons/fa6'

interface CardArtistProps {
  artist: SpotifyArtist
  classes?: string
}

const CardArtist: React.FC<CardArtistProps> = ({ artist, classes = '' }): JSX.Element => {
  console.log(artist)

  return (
    <Card className={classes}>
      <CardContent>
        <div className='w-2/3 mx-auto my-8 overflow-hidden rounded-full'>
          <AspectRatio ratio={1 / 1}>
            <img src={artist.images[0]?.url} alt='Image' className='object-cover' />
          </AspectRatio>
        </div>
        <CardHeader className='text-center p-0'>
          <CardTitle className='text-4xl'>{artist.name}</CardTitle>
          <CardDescription>{artist.followers.total} followers</CardDescription>
          <div className='block'>
            {artist.genres.length > 0 &&
              artist.genres.map((genre) => {
                return <Badge className='mx-1 bg-secondary text-muted-foreground'>{genre}</Badge>
              })}
          </div>
        </CardHeader>
      </CardContent>
      <CardFooter className='flex-col'>
        <Progress value={artist.popularity} className='h-1 w-2/3 mx-auto' />
        <div className='flex pt-6'>
          <MdOutlinePanoramaFishEye className='mx-2 text-xl -mt-0.5 text-muted-foreground' />
          <FaBullseye className='mx-2 text-muted-foreground' />
          <FaGoogle className='mx-2 text-muted-foreground' />
        </div>
      </CardFooter>
    </Card>
  )
}

export default CardArtist
