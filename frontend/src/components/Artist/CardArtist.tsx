import { useState } from 'react'

import { Link } from 'react-router-dom'

import { TSpotifyArtist } from '@/types/SpotifyArtist'
import { FaGoogle } from 'react-icons/fa'
import { FaSpotify } from 'react-icons/fa'
import { FaBullseye } from 'react-icons/fa6'
import { MdOutlinePanoramaFishEye } from 'react-icons/md'

import TopTracks from '@/components/Artist/TopTracks'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

interface CardArtistProps {
  artist: TSpotifyArtist
  classes?: string
}

const CardArtist: React.FC<CardArtistProps> = ({ artist, classes = '' }): JSX.Element => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const openSheet = async () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <Sheet onOpenChange={openSheet}>
      <Card className={classes}>
        <CardContent className="card__content flex flex-col h-full">
          <div className="w-2/3 mx-auto my-8 overflow-hidden rounded-full">
            <AspectRatio ratio={1 / 1}>
              <img
                src={artist.images[0]?.url}
                alt={Array(40).fill(artist.name).join(' ')} // In case of no image.
                className="object-cover text-sm text-gray-400 dark:text-gray-700"
              />
            </AspectRatio>
          </div>
          <CardHeader className="text-center p-0 flex-grow">
            <CardTitle className="text-4xl">
              <Link to={`/artists/${artist.id}`}>{artist.name}</Link>
            </CardTitle>
            <CardDescription>{artist.followers.total.toLocaleString()} followers</CardDescription>
            <div className="block pt-3">
              {artist.genres.length > 0 &&
                artist.genres.map((genre) => {
                  return (
                    <Link key={genre} to={`/genres/spotify:${genre}`}>
                      <Badge className="m-1 font-normal bg-zinc-200 dark:bg-zinc-700 hover:bg-primary dark:hover:bg-primary text-zinc-700 hover:text-white dark:text-zinc-200 dark:hover:text-white">
                        {genre}
                      </Badge>
                    </Link>
                  )
                })}
            </div>
          </CardHeader>
          <CardFooter className="flex-col pt-5 pb-0">
            <Progress value={artist.popularity} className="h-1 w-2/3 mx-auto" />
            <div className="flex pt-6">
              <SheetTrigger>
                <MdOutlinePanoramaFishEye className="mx-2 text-xl -mt-0.5 text-muted-foreground hover:text-primary" />
              </SheetTrigger>
              {/* TODO: use Hyperlink */}
              <Link to={`/${artist.id}`}>
                <FaBullseye className="mx-2 text-muted-foreground hover:text-primary" />
              </Link>
              <a href={artist.uri}>
                <FaSpotify className="mx-2 text-muted-foreground hover:text-primary" />
              </a>
              <a target="_blank" href={`https://www.google.com/search?q=${artist.name}`}>
                <FaGoogle className="mx-2 text-muted-foreground hover:text-primary" />
              </a>
            </div>
          </CardFooter>
        </CardContent>
      </Card>
      {/* SIDEBAR */}
      <SheetContent className="w-full max-w-full sm:max-w-1/2 sm:w-1/2 overflow-y-auto">
        <div className="flex items-center">
          <SheetHeader className="w-1/2">
            <SheetTitle className="text-6xl">
              <Link to={`/${artist.id}`}>{artist.name}</Link>
            </SheetTitle>
            <div className="flex pt-4">
              <Link to={`/${artist.id}`}>
                <FaBullseye className="mx-2 text-lg text-muted-foreground hover:text-primary" />
              </Link>
              <a target="_blank" href={artist.uri}>
                <FaSpotify className="mx-2 text-lg text-muted-foreground hover:text-primary" />
              </a>
              <a target="_blank" href={`https://www.google.com/search?q=${artist.name}`}>
                <FaGoogle className="mx-2 text-lg text-muted-foreground hover:text-primary" />
              </a>
            </div>
          </SheetHeader>
          <img src={artist.images[0]?.url} alt="Image" className="w-1/2" />
        </div>

        <h3 className="text-2xl mt-4">Top Tracks</h3>
        <TopTracks artistId={artist.id} />
      </SheetContent>
    </Sheet>
  )
}

export default CardArtist
