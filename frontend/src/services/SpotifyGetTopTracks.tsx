import axios from 'axios'
import { SpotifyTrack } from '@/types/SpotifyTrack'
import market from './spotifyPreferredMarket'

const getTopTracks = async (id: string): Promise<SpotifyTrack[]> => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${id}/top-tracks?market=${market}`
    )

    const tracks: SpotifyTrack[] = response.data.tracks
    return tracks
  } catch (error) {
    throw new Error('Failed to get top tracks')
  }
}

export default getTopTracks
