import { TSpotifyTrack } from '@/types/SpotifyTrack'
import axios from 'axios'

import { SPOTIFY_PREFERRED_MARKET } from '@/lib/constants'

const getSpotifyTopTracks = async (id: string): Promise<TSpotifyTrack[]> => {
  try {
    const response = await axios.get(
      `/api/spotify/artists/${id}/top-tracks?market=${SPOTIFY_PREFERRED_MARKET}`
    )

    // Spotify's API for top tracks returns an object with a 'tracks' array
    const tracks: TSpotifyTrack[] = response.data.tracks
    return tracks
  } catch (error) {
    console.error('Failed to get top tracks:', error)
    throw new Error('Failed to get top tracks')
  }
}

export default getSpotifyTopTracks
