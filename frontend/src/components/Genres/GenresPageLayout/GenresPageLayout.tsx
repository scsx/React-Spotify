import React from 'react'

import { useTopGenres } from '@/hooks/useTopGenres'
import Text from '@/components/shared/Text'
import Loading from '@/components/shared/Loading'

const GenresPageLayout = () => {
  const { topGenres, isLoading } = useTopGenres()

  if (isLoading) return <Loading />

  return (
    <div className='pt-16'>
      <Text variant="h2" className='mb-4'>Top Genres</Text>
      {topGenres.map((item) => (
        <div key={item.genre}>
          {item.genre} - {item.count}
        </div>
      ))}
    </div>
  )
}

export default GenresPageLayout
