import { SpotifyArtist } from '@/types/SpotifyArtist'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

interface CardArtistProps {
  artist: SpotifyArtist
  classes?: string
}

const CardArtist: React.FC<CardArtistProps> = ({
  artist,
  classes = ''
}): JSX.Element => {
  return (
    <Card
      key={artist.id}
      className={classes}>
      <CardHeader>
        <CardTitle>{artist.name}</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Popularity: {artist.popularity}</p>
      </CardFooter>
    </Card>
  )
}

export default CardArtist
