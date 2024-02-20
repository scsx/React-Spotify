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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { FaBullseye } from 'react-icons/fa6'

interface CardArtistProps {
  artist: SpotifyArtist
  classes?: string
}

const CardArtist: React.FC<CardArtistProps> = ({ artist, classes = '' }): JSX.Element => {
  return (
    <Sheet>
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
                  return (
                    <Badge
                      className='m-1 bg-secondary hover:bg-secondary text-muted-foreground'
                      key={genre}>
                      {genre}
                    </Badge>
                  )
                })}
            </div>
          </CardHeader>
        </CardContent>
        <CardFooter className='flex-col'>
          <Progress value={artist.popularity} className='h-1 w-2/3 mx-auto' />
          <div className='flex pt-6'>
            <SheetTrigger>
              <MdOutlinePanoramaFishEye className='mx-2 text-xl -mt-0.5 text-muted-foreground' />
            </SheetTrigger>
            <FaBullseye className='mx-2 text-muted-foreground' />
            <FaGoogle className='mx-2 text-muted-foreground' />
          </div>
        </CardFooter>
      </Card>
      {/* SIDEBAR */}
      fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 inset-y-0 right-0 h-full border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm w-2/4
      <SheetContent className='w-full  max-w-full sm:max-w-1/2 sm:w-1/2'>
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your account and remove your
            data from our servers.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default CardArtist
