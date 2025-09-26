import { TSpotifyArtist } from '@/types/SpotifyArtist'

import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'

type TFollowedArtistsProps = {
  artists: TSpotifyArtist[]
}

const FollowedArtists = ({ artists }: TFollowedArtistsProps) => {
  return (
    <div className="text-right">
      <Text as="h4" variant="h3" className="mb-8">
        Following
      </Text>
      {artists.length > 0 ? (
        <ul className="list-none space-y-1">
          {artists.map((artist) => (
            <li key={artist.id}>
              <Text variant='paragraph'><Hyperlink href={`/artists/${artist.id}`} variant='icon'>{artist.name}</Hyperlink></Text>
            </li>
          ))}
        </ul>
      ) : (
        <Text className="text-gray-400">No followed artists found.</Text>
      )}
    </div>
  )
}

export default FollowedArtists
