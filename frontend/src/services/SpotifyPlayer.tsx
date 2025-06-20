import axios from 'axios'
import market from './spotifyPreferredMarket'

export const getCurrentlyPlaying = async (): Promise<any> => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/me/player/currently-playing?market=${market}`
    )
    return response
  } catch (error) {
    throw new Error('Failed to get top tracks')
  }
}
