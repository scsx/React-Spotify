import { useEffect, useState } from 'react'

import { TSkileyLikedSong } from '@/types/SkileyTrack'

import Text from '@/components/Text'
import FeatureStatsTopsTrack from '@/components/Tracks/FeatureStats/FeatureStatsTopsTrack'

type TopsMap = {
  [key: string]: {
    top: TSkileyLikedSong[]
    bottom: TSkileyLikedSong[]
  }
}

const FeatureStatsTops = () => {
  const [tops, setTops] = useState<TopsMap>({})

  const features = [
    { key: 'trackFeatureAcousticness', name: 'Acousticness', unit: '%', isPercentage: true },
    { key: 'trackFeatureDanceability', name: 'Danceability', unit: '%', isPercentage: true },
    { key: 'trackFeatureEnergy', name: 'Energy', unit: '%', isPercentage: true },
    {
      key: 'trackFeatureInstrumentalness',
      name: 'Instrumentalness',
      unit: '%',
      isPercentage: true,
    },
    { key: 'trackFeatureLiveness', name: 'Liveness', unit: '%', isPercentage: true },
    { key: 'trackFeatureSpeechiness', name: 'Speechiness', unit: '%', isPercentage: true },
    { key: 'trackFeatureValence', name: 'Valence', unit: '%', isPercentage: true },
    { key: 'trackFeatureLoudness', name: 'Loudness', unit: ' dB', isPercentage: false },
    { key: 'trackFeatureTempo', name: 'Tempo', unit: ' BPM', isPercentage: false },
    { key: 'trackFeatureTimeSignature', name: 'Time Signature', unit: '/ 4', isPercentage: false },
  ]

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/data/skiley/2025-10-02-skiley-liked-songs.json')
      const json: TSkileyLikedSong[] = await response.json()

      const result: TopsMap = {}

      features.forEach(({ key }) => {
        const sorted = [...json].sort((a, b) => {
          const valA = a[key as keyof TSkileyLikedSong] as number
          const valB = b[key as keyof TSkileyLikedSong] as number
          return valB - valA
        })

        const top = sorted.slice(0, 10)

        let bottom = sorted.slice(-10)
        // Remove 0 values for tempo and time signature
        if (key === 'trackFeatureTempo' || key === 'trackFeatureTimeSignature') {
          bottom = sorted.filter((t) => (t[key as keyof TSkileyLikedSong] as number) > 0).slice(-10)
        }

        result[key] = { top, bottom }
      })

      setTops(result)
    }

    fetchData()
  }, [])

  return (
    <div className="pt-8">
      {features.map((f) => (
        <div key={f.key} className="flex items-start mb-20">
          <div className="w-2/5 pt-8">
            {tops[f.key]?.top.map((track) => (
              <FeatureStatsTopsTrack
                key={track.trackUri}
                track={track}
                value={track[f.key as keyof TSkileyLikedSong] as number}
                unit={f.unit}
                isPercentage={f.isPercentage}
              />
            ))}
          </div>
          <div className="w-1/5 text-center">
            <Text variant="h6" as="h4">
              + {f.name} -
            </Text>
          </div>
          <div className="w-2/5 pt-8 text-right">
            {tops[f.key]?.bottom.map((track) => (
              <FeatureStatsTopsTrack
                key={track.trackUri}
                track={track}
                value={track[f.key as keyof TSkileyLikedSong] as number}
                unit={f.unit}
                isPercentage={f.isPercentage}
                alignRight
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default FeatureStatsTops
