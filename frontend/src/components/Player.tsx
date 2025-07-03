import React, { useEffect, useState } from 'react'

import { TSpotifyAlbum } from '@/types/SpotifyAlbum'
import { TSpotifyArtist } from '@/types/SpotifyArtist'

import Hyperlink from '@/components/Hyperlink'

import { getSpotifyCurrentlyPlaying } from '@/services/spotify/spotifyPlayer'

import { useAuth } from '../contexts/AuthContext'

// TODO: Interfaces for Player are simpler and not complete.
interface NowPlaying {
  album: TSpotifyAlbum
  name: string
  artists: TSpotifyArtist[]
  uri: string
  duration_ms: number
}

const Player = (): JSX.Element => {
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null)
  const { isLoggedIn } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const playingData = await getSpotifyCurrentlyPlaying()

        if (playingData && playingData.item) {
          setNowPlaying(playingData.item as NowPlaying)
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

      // Opcional: Adicionar polling para atualizar a música a tocar automaticamente
      const intervalId = setInterval(fetchData, 5000) // Exemplo: a cada 5 segundos

      return () => clearInterval(intervalId)
    } else {
      setNowPlaying(null)
    }
  }, [isLoggedIn])

  return (
    <div>
      {nowPlaying && (
        <div className="flex">
          <img
            src={nowPlaying.album?.images[2].url}
            alt={nowPlaying.name}
            width={48}
            height={48}
            className="mr-2"
          />
          <div>
            <p className="text-gray-700 dark:text-gray-300">{nowPlaying.name}</p>
            <p className="text-gray-500">
              {nowPlaying.artists.map((artist, index) => {
                return (
                  <React.Fragment key={artist.id}>
                    {index > 0 ? ', ' : ''}
                    <Hyperlink className="hover:text-primary" href={`/artists/${artist.id}`}>
                      {artist.name}
                    </Hyperlink>
                  </React.Fragment>
                )
              })}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Player
