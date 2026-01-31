import { TSkileyLikedSong } from '@/types/SkileyTrack'
import { TSpotifyArtist } from '@/types/SpotifyArtist'

import Hyperlink from '@/components/shared/Hyperlink'
import Text from '@/components/shared/Text'

type TAdvancedTracklistDetailProps = {
  track: TSkileyLikedSong | null
  albumImageUrl: string | null
  artist: TSpotifyArtist | null
}

const NoImage = () => (
  <div className="w-full aspect-square flex items-center justify-center">
    <Text>No image</Text>
  </div>
)

const AdvancedTracklistDetail = ({
  track,
  albumImageUrl,
  artist,
}: TAdvancedTracklistDetailProps) => {
  if (!track) return null

  const getSpotifyIdFromUrl = (url: string) => {
    if (!url) return ''
    const parts = url.split('/')
    return parts[parts.length - 1] || ''
  }

  const boxClass = 'pt-4 px-5 pb-2 mb-4 border bg-background dark:bg-black'

  return (
    <div className="mt-4 sticky top-24">
      <div className={boxClass}>
        <Text variant="h6" className="mb-2">
          Track
        </Text>
        <Text className="mb-6 leading-none text-xl">{track.trackName}</Text>
        <Text className="mb-2">
          <Hyperlink href={`/tracks/${getSpotifyIdFromUrl(track.trackUrl)}`}>
            See track details
          </Hyperlink>
        </Text>
      </div>

      <div className={boxClass}>
        <Text variant="h6" className="mb-4">
          Artist
        </Text>
        <div className="flex items-center mb-2">
          <div className="w-[100px]">
            {artist?.images?.[0]?.url ? (
              <img src={artist.images[0].url} alt={artist.name} className="w-full aspect-square" />
            ) : (
              <NoImage />
            )}
          </div>
          <div className="pl-4 mb-2">
            <Text className="!leading-tight text-xl mb-1">
              <Hyperlink href={`/artists/${artist?.id}`} variant="title">
                {artist?.name}
              </Hyperlink>
            </Text>
            <Text className="leading-none" color="muted">
              {artist?.followers?.total} followers
            </Text>
          </div>
        </div>
      </div>

      <div className={boxClass}>
        <Text variant="h6" className="mb-4">
          Album
        </Text>
        <div className="flex items-center mb-2">
          <div className="w-[100px]">
            {albumImageUrl ? (
              <img
                src={albumImageUrl}
                alt={`Capa do álbum ${track.albumName}`}
                className="w-full aspect-square mb-2"
              />
            ) : (
              <NoImage />
            )}
          </div>
          <div className="pl-4 mb-1">
            <Text className="mb-2 !leading-tight text-lg">{track.albumName}</Text>
            <Text className="leading-none" color="muted">
              {track.albumRecordLabel}, {track.albumReleaseDate}
            </Text>
          </div>
        </div>
      </div>

      <div className={boxClass}>
        <Text variant="h6" className="mb-2">
          About
        </Text>
        <Text className="mb-2">
          These tracks are loaded locally from a file exported via{' '}
          <Hyperlink href="https://skiley.net/playlists" external>
            skiley.net
          </Hyperlink>
          . See the <Hyperlink href="/dev-notes#skiley">dev notes</Hyperlink> for more details.
        </Text>
      </div>
    </div>
  )
}

export default AdvancedTracklistDetail
