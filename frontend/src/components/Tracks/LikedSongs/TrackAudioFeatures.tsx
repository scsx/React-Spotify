import { TSkileyLikedSong } from '@/types/SkileyTrack'
import { GrCircleQuestion } from 'react-icons/gr'

import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'

type TrackAudioFeaturesProps = {
  track: TSkileyLikedSong
}

const features: { key: keyof TSkileyLikedSong; label: string }[] = [
  { key: 'trackFeatureAcousticness', label: 'Acousticness' },
  { key: 'trackFeatureDanceability', label: 'Danceability' },
  { key: 'trackFeatureEnergy', label: 'Energy' },
  { key: 'trackFeatureInstrumentalness', label: 'Instrumentalness' },
  { key: 'trackFeatureLiveness', label: 'Liveness' },
  { key: 'trackFeatureLoudness', label: 'Loudness' },
  { key: 'trackFeatureSpeechiness', label: 'Speechiness' },
  { key: 'trackFeatureTempo', label: 'Tempo' },
  { key: 'trackFeatureValence', label: 'Valence' },
  { key: 'trackPopularity', label: 'Popularity' },
]

const TrackAudioFeatures = ({ track }: TrackAudioFeaturesProps) => {
  const trackId = track.trackUrl.split('/').pop()

  return (
    <div>
      <Text variant="h6" className="mt-8 mb-4 flex items-center justify-between">
        <span>Features</span>
        {/* TODO: nao é detalhes desta track, é top features de todas as tracks */}
        <Hyperlink href={`/tracks/${trackId}/feature-stats`} variant="icon">
          <GrCircleQuestion /> TODO: TEXT
        </Hyperlink>
      </Text>

      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
        {features.map(({ key, label }) => {
          const value = track[key]

          if (value === null || value === undefined) return null

          return (
            <div key={key}>
              <Text color="muted">{label}</Text>
              <Text>{value}</Text>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TrackAudioFeatures
