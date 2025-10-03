import FeatureStatsInfo from '@/components/FeatureStats/FeatureStatsInfo'
import FeatureStatsTops from '@/components/FeatureStats/FeatureStatsTops'

const FeatureStats = () => {
  return (
    <div className="flex space-x-12">
      <div className="w-3/4">
        <FeatureStatsTops />
      </div>
      <div className="w-1/4">
        <FeatureStatsInfo />
      </div>
    </div>
  )
}

export default FeatureStats
