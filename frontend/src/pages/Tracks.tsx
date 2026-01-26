import Text from '@/components/Text'
import LikedSongs from '@/components/Tracks/LikedSongs/LikedSongs'

const TracksPage = () => {
  return (
    <div className="relative container">
      <Text variant="h1" className="mb-8">
        Liked songs
      </Text>
      <LikedSongs />
    </div>
  )
}

export default TracksPage
