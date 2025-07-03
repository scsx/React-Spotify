// frontend/src/services/spotifyPlayer.ts
import axios from 'axios'

import { SPOTIFY_PREFERRED_MARKET } from '@/lib/constants'

const marketValue = SPOTIFY_PREFERRED_MARKET.split('=')[1] || 'US'

export const getSpotifyCurrentlyPlaying = async (): Promise<any> => {
  try {
    const { data } = await axios.get(`/api/spotify/player/currently-playing`, {
      params: {
        market: marketValue,
      },
    })

    console.log('Currently playing song:', data)
    return data
  } catch (error) {
    console.error('Failed to get currently playing song:', error)
    throw new Error('Failed to get currently playing song')
  }
}
