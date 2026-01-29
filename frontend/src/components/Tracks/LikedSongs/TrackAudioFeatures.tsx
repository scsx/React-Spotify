import Text from '@/components/Text'
import { TSkileyLikedSong } from '@/types/SkileyTrack'
import Hyperlink from '@/components/Hyperlink'
import { GrCircleQuestion } from 'react-icons/gr'

// TODO: COMPLETE
const TrackAudioFeatures = () => {
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

  return (
    <div>
      TrackAudioFeatures
      {/* <Text variant="h6" className="mt-8 mb-4 flex items-center justify-between">
        <span>Features</span>
        <Hyperlink href="/playlists/liked-songs/feature-stats" className="text-lg" variant="icon">
          <GrCircleQuestion />
        </Hyperlink>
      </Text>
      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
        {features.map(({ key, label }) => (
          <div key={key}>
            <Text color="muted">{label}</Text>
            <Text>{track[key]}</Text>
          </div>
        ))}
      </div> */}
    </div>
  )
}

export default TrackAudioFeatures
