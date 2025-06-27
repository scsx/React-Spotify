// frontend/src/services/spotifyPlayer.ts
import axios from 'axios'

import { SPOTIFY_PREFERRED_MARKET } from '@/lib/constants'

export const getSpotifyCurrentlyPlaying = async (): Promise<any> => {
  try {
    // The frontend now calls its own backend's proxy endpoint.
    // This assumes your backend has a route like `/api/spotify/me/player/currently-playing`
    // that will handle the actual call to Spotify's API.
    const response = await axios.get(
      `/api/spotify/me/player/currently-playing?market=${SPOTIFY_PREFERRED_MARKET}`
    )
    return response
  } catch (error) {
    console.error('Failed to get currently playing song:', error)
    throw new Error('Failed to get currently playing song')
  }
}
