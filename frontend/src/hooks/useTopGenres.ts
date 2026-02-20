import { useEffect, useState } from 'react'

import { db } from '@/lib/index-db'

export function useTopGenres() {
  const [topGenres, setTopGenres] = useState<{ genre: string; count: number }[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const result = await db.topGenres.get('latest')
        if (result) {
          setTopGenres(result.genres)
        }
      } catch (error) {
        console.error('Error loading top genres:', error)
        setTopGenres([])
      } finally {
        setIsLoading(false)
      }
    }

    loadGenres()
  }, [])

  return { topGenres, isLoading }
}
