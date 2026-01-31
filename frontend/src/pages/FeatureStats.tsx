import Text from '@/components/Text'
import FeatureStatsInfo from '@/components/Tracks/FeatureStats/FeatureStatsInfo'
import FeatureStatsTops from '@/components/Tracks/FeatureStats/FeatureStatsTops'

const FeatureStats = () => {
  return (
    <div className="relative container">
      <Text variant="h1" className="mb-8">
        Liked songs
      </Text>
      <div className="flex space-x-12">
        <div className="w-3/4">
          <FeatureStatsTops />
        </div>
        <div className="w-1/4">
          <FeatureStatsInfo />
        </div>
      </div>
    </div>
  )
}

export default FeatureStats
