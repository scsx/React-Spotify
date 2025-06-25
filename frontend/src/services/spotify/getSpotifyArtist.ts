import { TSpotifyArtist } from '@/types/SpotifyArtist'
import axios from 'axios'

import { SPOTIFY_API_BASE_URL } from '@/lib/constants'

export const getSpotifyArtist = async (artistId: string): Promise<TSpotifyArtist> => {
  try {
    const response = await axios.get(`${SPOTIFY_API_BASE_URL}/artists/${artistId}`)

    const artist: TSpotifyArtist = response.data

    return artist
  } catch (error) {
    throw new Error('Failed to get top tracks')
  }
}
