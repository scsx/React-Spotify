import Text from '@/components/Text'
import LikedSongs from '@/components/Tracks/LikedSongs/LikedSongs'

const TracksPage = () => {
  return (
    <div className="relative container">
      <Text variant="h1">Tracks</Text>
      <Text variant="h4" color="muted" className="mb-8">
        Liked songs, using Skiley.
      </Text>
      <LikedSongs />
    </div>
  )
}

export default TracksPage
