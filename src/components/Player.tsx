import { useState, useEffect } from 'react'
import { SpotifyArtist } from '@/types/SpotifyArtist'
import { getCurrentlyPlaying } from '@/services/SpotifyPlayer'
import { useToken } from '../contexts/TokenContext'
import { SpotifyAlbum } from '@/types/SpotifyAlbum'

// Interfaces for Player are simpler and not complete.
interface NowPlaying {
  album: SpotifyAlbum
  name: string
  artists: SpotifyArtist[]
}

const Player = (): JSX.Element => {
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null)
  const isAuthorized = useToken()?.isValid

  useEffect(() => {
    const fetchData = async () => {
      try {
        const playing = await getCurrentlyPlaying()
        setNowPlaying(playing.data.item)
       // console.log(playing)
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
      {nowPlaying && (
        <div className='flex'>
          <img src={nowPlaying.album?.images[2].url} alt={nowPlaying.name} width={48} height={48} className='mr-2' />
          <div>
            <p className='text-gray-700 dark:text-gray-300'>{nowPlaying.name}</p>
            <p className='text-gray-500'>{nowPlaying.artists[0]?.name}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Player
