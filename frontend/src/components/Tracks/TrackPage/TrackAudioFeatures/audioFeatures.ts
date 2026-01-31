export const AUDIO_FEATURE_KEYS = [
  'trackFeatureAcousticness',
  'trackFeatureDanceability',
  'trackFeatureEnergy',
  'trackFeatureInstrumentalness',
  'trackFeatureLiveness',
  'trackFeatureSpeechiness',
  'trackFeatureValence',
  'trackFeatureLoudness',
  'trackFeatureTempo',
  'trackPopularity',
] as const

export type AudioFeatureKey = (typeof AUDIO_FEATURE_KEYS)[number]

export const AUDIO_FEATURES: Record<
  AudioFeatureKey,
  { label: string; min: number; max: number; unit?: string }
> = {
  trackFeatureAcousticness: {
    label: 'Acousticness',
    min: 0,
    max: 1,
  },
  trackFeatureDanceability: {
    label: 'Danceability',
    min: 0,
    max: 1,
  },
  trackFeatureEnergy: {
    label: 'Energy',
    min: 0,
    max: 1,
  },
  trackFeatureInstrumentalness: {
    label: 'Instrumentalness',
    min: 0,
    max: 1,
  },
  trackFeatureLiveness: {
    label: 'Liveness',
    min: 0,
    max: 1,
  },
  trackFeatureSpeechiness: {
    label: 'Speechiness',
    min: 0,
    max: 1,
  },
  trackFeatureValence: {
    label: 'Valence',
    min: 0,
    max: 1,
  },
  trackFeatureLoudness: {
    label: 'Loudness',
    min: -60,
    max: 0,
    unit: 'dB',
  },
  trackFeatureTempo: {
    label: 'Tempo',
    min: 40,
    max: 220,
    unit: 'BPM',
  },
  trackPopularity: {
    label: 'Popularity',
    min: 0,
    max: 100,
    unit: '%',
  },
}
