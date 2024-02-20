import { useState, useEffect } from 'react'
import { SpotifyArtist } from '@/types/SpotifyArtist'
import { getCurrentlyPlaying } from '@/services/SpotifyPlayer'
import { useToken } from '../contexts/TokenContext'

interface NowPlaying {
  data: {
    item: {
      name: string
      artists: SpotifyArtist[]
    }
  }
}

const Player = (): JSX.Element => {
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null)
  const isAuthorized = useToken()?.isValid

  console.log(isAuthorized)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const playing = await getCurrentlyPlaying()
        setNowPlaying(playing)
        console.log(playing)
      } catch (error) {
        console.error('Error fetching currently playing:', error)
      }
    }

    if (isAuthorized) {
      fetchData()
    }
  }, [isAuthorized])

  return (
    <div>
      {nowPlaying && nowPlaying?.data && (
        <>
          <p>{nowPlaying && nowPlaying?.data?.item?.name}</p>
          <p>{nowPlaying && nowPlaying?.data?.item?.artists[0]?.name}</p>
        </>
      )}
    </div>
  )
}

export default Player
