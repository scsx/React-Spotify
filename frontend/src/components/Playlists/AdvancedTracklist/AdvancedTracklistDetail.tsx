import { TSkileyLikedSong } from '@/types/SkileyTrack'

import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'

type Props = {
  track: TSkileyLikedSong | null
}

const AdvancedTracklistDetail = ({ track }: Props) => {
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
    <div className="mt-4 p-8 border sticky top-24 bg-background dark:bg-black">
      <Text variant="h6" className="mb-4">
        Album
      </Text>
      <Text color="muted">Track Name</Text>
      <Text variant="h5" className="mb-2">
        {track.trackName}
      </Text>
      <Text color="muted">Album Name</Text>
      <Text variant="h5" className="mb-2">
        <Hyperlink href={`/albums/${albumId}`}>{track.albumName}</Hyperlink>
      </Text>
      <Text color="muted">Label</Text>
      <Text variant="h5" className="mb-2">
        {track.albumRecordLabel}, {track.albumReleaseDate}
      </Text>

      <Text variant="h6" className="mt-8 mb-4">
        Features
      </Text>
      <div className="grid grid-cols-2 gap-4">
        {features.map(({ key, label }) => (
          <div key={key}>
            <Text color="muted">{label}</Text>
            <Text variant="h5">{track[key]}</Text>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdvancedTracklistDetail
