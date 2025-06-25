import { TSpotifyArtist } from '@/types/SpotifyArtist'
import axios from 'axios'

import { SPOTIFY_API_BASE_URL } from '@/lib/constants'

interface TRelatedArtistsResponse {
  artists: TSpotifyArtist[]
}

export const getSpotifyRelatedArtists = async (
  artistId: string
): Promise<TRelatedArtistsResponse> => {
  try {
    const response = await axios.get(`${SPOTIFY_API_BASE_URL}/artists/${artistId}/related-artists`)

    const artists: TRelatedArtistsResponse = response.data

    return artists
  } catch (error) {
    throw new Error('Failed to get related artists: ' + error)
  }
}
