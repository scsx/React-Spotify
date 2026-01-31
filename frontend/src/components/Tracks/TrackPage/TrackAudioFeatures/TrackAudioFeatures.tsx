import { TSkileyLikedSong } from '@/types/SkileyTrack'

import Hyperlink from '@/components/shared/Hyperlink'
import Text from '@/components/shared/Text'

import { AUDIO_FEATURES, AUDIO_FEATURE_KEYS } from './audioFeatures'

type TrackAudioFeaturesProps = {
  track: TSkileyLikedSong
}

const TrackAudioFeatures = ({ track }: TrackAudioFeaturesProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
        {AUDIO_FEATURE_KEYS.map((key) => {
          const feature = AUDIO_FEATURES[key]
          const value = track[key]

          if (value === null || value === undefined) return null

          return (
            <div key={key}>
              <Text color="muted">{feature.label}</Text>
              <Text>{value}</Text>
            </div>
          )
        })}
      </div>
      <Hyperlink href={`/tracks/feature-stats`} variant="title" className="mt-4 inline-block">
        See top audio features
      </Hyperlink>
      <Text color="muted">
        Spotify's audio features endpoints were deprecated in late 2024. These come from Skiley's
        exported .json, for the time being.
      </Text>
    </>
  )
}

export default TrackAudioFeatures
