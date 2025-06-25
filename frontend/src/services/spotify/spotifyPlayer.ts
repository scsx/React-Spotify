import axios from 'axios'

import { SPOTIFY_API_BASE_URL, SPOTIFY_PREFERRED_MARKET } from '@/lib/constants'

export const getSpotifyCurrentlyPlaying = async (): Promise<any> => {
  try {
    const response = await axios.get(
      `${SPOTIFY_API_BASE_URL}/me/player/currently-playing?market=${SPOTIFY_PREFERRED_MARKET}`
    )
    return response
  } catch (error) {
    throw new Error('Failed to get top tracks')
  }
}
