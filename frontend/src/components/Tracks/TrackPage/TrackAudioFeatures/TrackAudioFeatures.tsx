import { TSkileyLikedSong } from '@/types/SkileyTrack'

import Hyperlink from '@/components/shared/Hyperlink'
import Text from '@/components/shared/Text'
import { Progress } from '@/components/ui/progress'

import { AUDIO_FEATURES, AUDIO_FEATURE_KEYS } from './audioFeatures'

type TrackAudioFeaturesProps = {
  track: TSkileyLikedSong
}

const TrackAudioFeatures = ({ track }: TrackAudioFeaturesProps) => {
  const normalize = (value: number, min: number, max: number) => {
    const clamped = Math.min(Math.max(value, min), max)
    return ((clamped - min) / (max - min)) * 100
  }

  return (
    <>
      <div>
        {AUDIO_FEATURE_KEYS.map((key) => {
          const feature = AUDIO_FEATURES[key]
          const raw = track[key]

          if (raw === null || raw === undefined) return null

          const percent = normalize(raw, feature.min, feature.max)

          return (
            <div key={key}>
              <div className="flex justify-between">
                <Text color="muted">{feature.label}</Text>
                <Text>
                  {raw}
                  {feature.unit ? ` ${feature.unit}` : ''}
                </Text>
              </div>

              <Progress value={percent} className="h-1 mb-2" />
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
