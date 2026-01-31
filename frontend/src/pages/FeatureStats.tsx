import { useNavigate } from 'react-router-dom'

import { IoIosArrowBack } from 'react-icons/io'

import Text from '@/components/Text'
import GlobalFeatureStats from '@/components/Tracks/GlobalFeatureStats/GlobalFeatureStats'
import FeatureStatsInfo from '@/components/Tracks/GlobalFeatureStats/GlobalFeatureStatsInfo'

const FeatureStats = () => {
  const navigate = useNavigate()

  return (
    <div className="relative container">
      <div className="flex">
        <Text variant="h1" className="grow">
          Top Audio Features
        </Text>
        <Text className='mt-4'>
          <button onClick={() => navigate(-1)} className="text-base">
            <IoIosArrowBack className="inline-block mr-1 text-sm" />
            Back
          </button>
        </Text>
      </div>
      <Text variant="h4" color="muted" className="mt-2 mb-8">
        In Liked songs, using Skiley.
      </Text>
      <div className="flex space-x-12">
        <div className="w-3/4">
          <GlobalFeatureStats />
        </div>
        <div className="w-1/4">
          <FeatureStatsInfo />
        </div>
      </div>
    </div>
  )
}

export default FeatureStats
