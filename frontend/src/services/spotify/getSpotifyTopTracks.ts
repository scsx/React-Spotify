import { TSpotifyTrack } from '@/types/SpotifyTrack'
import axios from 'axios'

import market from './spotifyPreferredMarket'

const getSpotifyTopTracks = async (id: string): Promise<TSpotifyTrack[]> => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${id}/top-tracks?market=${market}`
    )

    const tracks: TSpotifyTrack[] = response.data.tracks
    return tracks
  } catch (error) {
    throw new Error('Failed to get top tracks')
  }
}

export default getSpotifyTopTracks
