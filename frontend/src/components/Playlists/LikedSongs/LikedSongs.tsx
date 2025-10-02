import { useEffect, useState } from 'react'

import { TSkileyLikedSong } from '@/types/SkileyTrack'

import ErrorDisplay from '@/components/ErrorDisplay'
import Hyperlink from '@/components/Hyperlink'
import Loading from '@/components/Loading'
import Text from '@/components/Text'

const LikedSongs = () => {
  const [data, setData] = useState<TSkileyLikedSong[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const DATA_PATH = '/data/skiley/2025-10-02-skiley-liked-songs.json'

  useEffect(() => {
    const fetchLikedSongs = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(DATA_PATH)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const json = await response.json()
        console.log('Fetched liked songs data:', json)
        setData(json)
      } catch (e: any) {
        console.error('Error fetching liked songs data:', e)
        setError(e.message || 'Failed to fetch data.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLikedSongs()
  }, [])

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <ErrorDisplay message="error" />
  }

  const songCount = data?.length || 0

  return (
    <div className="p-4">
      <Text>
        Using{' '}
        <Hyperlink href="https://skiley.net/playlists" external>
          skiley.net
        </Hyperlink>
      </Text>

      {data && (
        <Text className="mt-4">
          Successfully loaded <strong className="text-green-400">{songCount}</strong> liked songs
          from Skiley. First song: {data[0]?.trackName} by {data[0]?.albumArtistsNames}
        </Text>
      )}
    </div>
  )
}

export default LikedSongs
