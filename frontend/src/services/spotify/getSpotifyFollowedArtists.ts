import { TSpotifyFollowedArtistsResponse } from '@/types/SpotifyUser'
import axios, { AxiosResponse } from 'axios'

export const getSpotifyFollowedArtists = async (
  limit = 40,
  after?: string
): Promise<TSpotifyFollowedArtistsResponse> => {
  try {
    const response: AxiosResponse<TSpotifyFollowedArtistsResponse> = await axios.get(
      '/api/spotify/me/following',
      {
        params: {
          limit,
          after,
        },
      }
    )

    return response.data
  } catch (error: any) {
    console.error('Error fetching followed artists from Spotify API:', error)

    if (axios.isAxiosError(error) && error.response && error.response.data) {
      const errorMessage = error.response.data.message || 'Error from API Spotify.'
      throw new Error(`Error from API Spotify: ${errorMessage}`)
    }

    throw new Error(
      'Could not load followed artists. Please check your connection or authentication.'
    )
  }
}
