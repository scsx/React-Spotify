import React, { useEffect, useState } from 'react'

import { TSpotifyTrack } from '@/types/SpotifyTrack'

import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'

import { getSpotifyCurrentlyPlaying } from '@/services/spotify/spotifyPlayer'

import { useAuth } from '../contexts/AuthContext'

// TODO: Interfaces for Player are simpler and not complete.
// E.g. Missing is_playing, progress_ms, etc.
const Player = (): JSX.Element => {
  const [nowPlaying, setNowPlaying] = useState<TSpotifyTrack | null>(null)
  const { isLoggedIn } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const playingData = await getSpotifyCurrentlyPlaying()

        if (playingData && playingData.item) {
          setNowPlaying(playingData.item as TSpotifyTrack)
        } else {
          setNowPlaying(null)
          console.log(
            "No track currently playing or 'item' is null/undefined in the response from Spotify."
          )
        }
      } catch (error) {
        console.error('Error fetching currently playing:', error)
        setNowPlaying(null)
      }
    }

    if (isLoggedIn) {
      fetchData()

      // Polling para atualizar a música a tocar automaticamente.
      const intervalId = setInterval(fetchData, 5000)

      return () => clearInterval(intervalId)
    } else {
      setNowPlaying(null)
    }
  }, [isLoggedIn])

  return (
    <div>
      {nowPlaying ? (
        <div className="flex">
          <img
            src={nowPlaying.album?.images[2].url}
            alt={nowPlaying.name}
            width={48}
            height={48}
            className="mr-2"
          />
          <div>
            <Text className="text-gray-700 dark:text-gray-300">
              <Hyperlink href={`/tracks/${nowPlaying.id}`} variant="title">
                {nowPlaying.name}
              </Hyperlink>
            </Text>
            <Text className="text-gray-500">
              {nowPlaying.artists.map((artist, index) => (
                <React.Fragment key={artist.id}>
                  {index > 0 ? ', ' : ''}
                  <Hyperlink href={`/artists/${artist.id}`}>{artist.name}</Hyperlink>
                </React.Fragment>
              ))}
            </Text>
          </div>
        </div>
      ) : (
        <p>Nothing playing atm.</p>
      )}
    </div>
  )
}

export default Player
