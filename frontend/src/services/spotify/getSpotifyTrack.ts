import { TSpotifyTrack } from '@/types/SpotifyTrack'
import axios from 'axios'

export const getSpotifyTrack = async (trackId: string): Promise<TSpotifyTrack> => {
  try {
    const response = await axios.get(`/api/spotify/tracks/${trackId}`)
    const track: TSpotifyTrack = response.data
    return track
  } catch (error) {
    console.error(`Failed to get track details for ID ${trackId}:`, error)
    throw new Error('Failed to get track details')
  }
}
