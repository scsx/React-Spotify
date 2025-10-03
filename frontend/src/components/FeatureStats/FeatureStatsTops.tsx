const FeatureStatsTops = () => {
  const features = [
    { key: 'trackFeatureAcousticness', name: 'Acousticness', unit: '%' },
    { key: 'trackFeatureDanceability', name: 'Danceability', unit: '%' },
    { key: 'trackFeatureEnergy', name: 'Energy', unit: '%' },
    { key: 'trackFeatureInstrumentalness', name: 'Instrumentalness', unit: '%' },
    { key: 'trackFeatureLiveness', name: 'Liveness', unit: '%' },
    { key: 'trackFeatureSpeechiness', name: 'Speechiness', unit: '%' },
    { key: 'trackFeatureValence', name: 'Valence', unit: '%' },
    { key: 'trackFeatureLoudness', name: 'Loudness', unit: ' dB' },
    { key: 'trackFeatureTempo', name: 'Tempo', unit: ' BPM' },
    { key: 'trackFeatureTimeSignature', name: 'Time Signature', unit: '' },
  ]

  return <div>FeatureStatsTops</div>
}

export default FeatureStatsTops
