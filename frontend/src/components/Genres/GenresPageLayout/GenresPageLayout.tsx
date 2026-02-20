import React from 'react'

import { useTopGenres } from '@/hooks/useTopGenres'

import Loading from '@/components/shared/Loading'

const GenresPageLayout = () => {
  const { topGenres, isLoading } = useTopGenres()

  if (isLoading) return <Loading />

  return (
    <div>
      <h2>Top Genres</h2>
      {topGenres.map((item) => (
        <div key={item.genre}>
          {item.genre} - {item.count}
        </div>
      ))}
    </div>
  )
}

export default GenresPageLayout
