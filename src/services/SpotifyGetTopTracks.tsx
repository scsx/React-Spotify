import axios from 'axios'
import { SpotifyMultipleTracks } from '@/types/SpotifyTrack'
import market from './spotifyPreferredMarket'

const getTopTracks = async (id: string): Promise<SpotifyMultipleTracks> => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${id}/top-tracks?market=${market}`
    )

    const tracks: SpotifyMultipleTracks = {
      items: response.data.tracks
    }
    return tracks
  } catch (error) {
    throw new Error('Failed to get top tracks')
  }
}

export default getTopTracks
