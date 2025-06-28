import React, { useEffect, useState } from 'react'

import { TSpotifyAlbum } from '@/types/SpotifyAlbum'
import { TSpotifyArtist } from '@/types/SpotifyArtist'

import Hyperlink from '@/components/Hyperlink'

import { getSpotifyCurrentlyPlaying } from '@/services/spotify/spotifyPlayer'

import { useToken } from '../contexts/TokenContext'

// Interfaces for Player are simpler and not complete.
interface NowPlaying {
  album: TSpotifyAlbum
  name: string
  artists: TSpotifyArtist[]
}

const Player = (): JSX.Element => {
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null)
  const isAuthorized = useToken()?.isValid

  useEffect(() => {
    const fetchData = async () => {
      try {
        const playing = await getSpotifyCurrentlyPlaying()
        setNowPlaying(playing.data.item)
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
