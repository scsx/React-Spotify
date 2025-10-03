import { TSkileyLikedSong } from '@/types/SkileyTrack'

import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'

type AdvancedTracklistDetailProps = {
  track: TSkileyLikedSong | null
  albumImageUrl: string | null
}

const AdvancedTracklistDetail = ({ track, albumImageUrl }: AdvancedTracklistDetailProps) => {
  const features: { key: keyof TSkileyLikedSong; label: string }[] = [
    { key: 'trackFeatureAcousticness', label: 'Acousticness' },
    { key: 'trackFeatureDanceability', label: 'Danceability' },
    { key: 'trackFeatureEnergy', label: 'Energy' },
    { key: 'trackFeatureInstrumentalness', label: 'Instrumentalness' },
    { key: 'trackFeatureKey', label: 'Key' },
    { key: 'trackFeatureLiveness', label: 'Liveness' },
    { key: 'trackFeatureLoudness', label: 'Loudness' },
    { key: 'trackFeatureSpeechiness', label: 'Speechiness' },
    { key: 'trackFeatureTempo', label: 'Tempo' },
    { key: 'trackFeatureTimeSignature', label: 'Time Signature' },
    { key: 'trackFeatureValence', label: 'Valence' },
    { key: 'trackPopularity', label: 'Popularity' },
  ]

  if (!track) return null

  const albumId = track.albumUrl.split('/').pop()

  return (
    <div className="mt-4 p-8 pt-6 border sticky top-24 bg-background dark:bg-black">
      <Text variant="h6" className="mb-2">
        Album
      </Text>

      {albumImageUrl ? (
        <img
          src={albumImageUrl}
          alt={`Capa do álbum ${track.albumName}`}
          className="w-full aspect-square mb-4"
        />
      ) : (
        <div className="w-full aspect-square bg-gray-700 rounded-lg mb-6 flex items-center justify-center">
          <Text className="text-gray-400 text-sm">No image</Text>
        </div>
      )}

      <Text variant="h5" className="mt-1 mb-2 leading-none">
        <Hyperlink href={`/albums/${albumId}`}>{track.albumName}</Hyperlink>
      </Text>
      <Text className="mt-1 mb-2 leading-none" color='muted'>
        {track.albumRecordLabel}, {track.albumReleaseDate}
      </Text>

      <Text variant="h6" className="mt-8 mb-4">
        Features
      </Text>
      <div className="grid grid-cols-2 gap-4">
        {features.map(({ key, label }) => (
          <div key={key}>
            <Text color="muted">{label}</Text>
            <Text>{track[key]}</Text>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdvancedTracklistDetail
