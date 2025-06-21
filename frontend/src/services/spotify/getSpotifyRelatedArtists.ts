import { TSpotifyArtist } from '@/types/SpotifyArtist'
import axios from 'axios'

interface TRelatedArtistsResponse {
  artists: TSpotifyArtist[]
}

export const getSpotifyRelatedArtists = async (
  artistId: string
): Promise<TRelatedArtistsResponse> => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${artistId}/related-artists`
    )

    const artists: TRelatedArtistsResponse = response.data

    return artists
  } catch (error) {
    throw new Error('Failed to get top tracks')
  }
}
