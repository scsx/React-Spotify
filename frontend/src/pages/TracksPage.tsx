import LikedSongs from '@/components/Tracks/LikedSongs/LikedSongs'
import Text from '@/components/shared/Text'

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
