import { SpotifyArtist } from '@/types/SpotifyArtist'
import axios from 'axios'

interface RelatedArtistsResponse {
  artists: SpotifyArtist[]
}

export const getRelatedArtists = async (artistId: string): Promise<RelatedArtistsResponse> => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${artistId}/related-artists`
    )

    const artists: RelatedArtistsResponse = response.data

    return artists
  } catch (error) {
    throw new Error('Failed to get top tracks')
  }
}
