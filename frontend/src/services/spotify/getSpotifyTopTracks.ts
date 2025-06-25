import { TSpotifyTrack } from '@/types/SpotifyTrack'
import axios from 'axios'

import { SPOTIFY_API_BASE_URL, SPOTIFY_PREFERRED_MARKET } from '@/lib/constants'

const getSpotifyTopTracks = async (id: string): Promise<TSpotifyTrack[]> => {
  try {
    const response = await axios.get(
      `${SPOTIFY_API_BASE_URL}/artists/${id}/top-tracks?market=${SPOTIFY_PREFERRED_MARKET}`
    )

    const tracks: TSpotifyTrack[] = response.data.tracks
    return tracks
  } catch (error) {
    throw new Error('Failed to get top tracks')
  }
}

export default getSpotifyTopTracks
