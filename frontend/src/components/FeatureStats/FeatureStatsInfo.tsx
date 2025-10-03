import Text from '@/components/Text'

const FeatureStatsInfo = () => {
  const featureDescriptions = [
    {
      key: 'trackFeatureAcousticness',
      label: 'Acousticness',
      description: 'Likelihood the track is acoustic (0-1).',
    },
    {
      key: 'trackFeatureDanceability',
      label: 'Danceability',
      description: 'Suitability of the track for dancing (0-1).',
    },
    {
      key: 'trackFeatureEnergy',
      label: 'Energy',
      description: 'Intensity and activity of the track (0-1).',
    },
    {
      key: 'trackFeatureInstrumentalness',
      label: 'Instrumentalness',
      description: 'Likelihood the track contains no vocals (0-1).',
    },
    { key: 'trackFeatureKey', label: 'Key', description: 'Musical key of the track (0-11).' },
    {
      key: 'trackFeatureLiveness',
      label: 'Liveness',
      description: 'Presence of live audience sounds (0-1).',
    },
    {
      key: 'trackFeatureLoudness',
      label: 'Loudness',
      description: 'Average volume in decibels (dB).',
    },
    {
      key: 'trackFeatureSpeechiness',
      label: 'Speechiness',
      description: 'Presence of spoken words (0-1).',
    },
    {
      key: 'trackFeatureTempo',
      label: 'Tempo',
      description: 'Overall tempo in beats per minute (BPM).',
    },
    {
      key: 'trackFeatureTimeSignature',
      label: 'Time Signature',
      description: 'Musical meter of the track (e.g., 3 or 4).',
    },
    {
      key: 'trackFeatureValence',
      label: 'Valence',
      description: 'Positivity conveyed by the track (0 = sad, 1 = happy).',
    },
  ]

  const musicKeys: { [key: number]: { latin: string; english: string } } = {
    0: { latin: 'Do', english: 'C' },
    1: { latin: 'Do♯ / Ré♭', english: 'C♯ / D♭' },
    2: { latin: 'Ré', english: 'D' },
    3: { latin: 'Ré♯ / Mi♭', english: 'D♯ / E♭' },
    4: { latin: 'Mi', english: 'E' },
    5: { latin: 'Fa', english: 'F' },
    6: { latin: 'Fa♯ / Sol♭', english: 'F♯ / G♭' },
    7: { latin: 'Sol', english: 'G' },
    8: { latin: 'Sol♯ / La♭', english: 'G♯ / A♭' },
    9: { latin: 'La', english: 'A' },
    10: { latin: 'La♯ / Si♭', english: 'A♯ / B♭' },
    11: { latin: 'Si', english: 'B' },
  }
  return (
    <>
      <Text variant="h4" className="mb-8">
        Spotify Audio Features
      </Text>
      {featureDescriptions.map(({ key, label, description }) => (
        <div key={key} className="mb-4">
          <Text variant="h6" color="muted">
            {label}
          </Text>
          <Text>{description}</Text>
        </div>
      ))}

      <Text variant="h4" className="mt-12 mb-4">
        Keys
      </Text>
      {Object.entries(musicKeys).map(([num, { latin, english }]) => (
        <div key={num} className="mb-2">
          <Text>
            {latin}{' '}
            <Text as="span" color="muted">
              ({english})
            </Text>
          </Text>
        </div>
      ))}
    </>
  )
}

export default FeatureStatsInfo
