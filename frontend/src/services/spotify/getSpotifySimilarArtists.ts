// frontend/src/services/spotify/getSpotifySimilarArtists.ts
import { TSpotifyArtist } from '@/types/SpotifyArtist'
import axios, { AxiosResponse } from 'axios'

interface TSpotifySimilarArtistsResponse {
  artists: TSpotifyArtist[]
}

export const getSpotifySimilarArtists = async (
  artistId: string,
  limit: number = 7
): Promise<TSpotifySimilarArtistsResponse> => {
  try {
    const response: AxiosResponse<TSpotifySimilarArtistsResponse> = await axios.get(
      `/api/spotify/artists/${artistId}/similar-artists`,
      {
        params: { limit: limit },
      }
    )

    // The backend now handles the filtering of the original artist and result limitation.
    return { artists: response.data.artists || [] }
  } catch (error: any) {
    console.error(
      'getSpotifySimilarArtists: Error fetching similar artists (via genre search):',
      error.response?.data || error.message,
      error.config?.url
    )
    throw new Error(
      `Failed to get similar artists (genre search): ${error.response?.statusText || error.message}`
    )
  }
}
