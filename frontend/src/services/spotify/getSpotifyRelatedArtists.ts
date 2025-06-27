import { TSpotifyArtist } from '@/types/SpotifyArtist'
import axios, { AxiosResponse } from 'axios'

interface TSpotifyRelatedArtistsResponse {
  artists: TSpotifyArtist[]
}

export const getSpotifyRelatedArtists = async (
  artistId: string,
  limit: number = 9
): Promise<TSpotifyRelatedArtistsResponse> => {
  try {
    const response: AxiosResponse<TSpotifyRelatedArtistsResponse> = await axios.get(
      `/api/spotify/artists/${artistId}/related-artists`
    )

    let foundArtists: TSpotifyArtist[] = response.data.artists || []
    foundArtists = foundArtists.filter((item) => item.id !== artistId)

    return { artists: foundArtists.slice(0, limit) }
  } catch (error: any) {
    console.error(
      'getSpotifyRelatedArtists: Error fetching related artists (via official endpoint):',
      error.response?.data || error.message,
      error.config?.url
    )
    throw new Error(`Failed to get related artists: ${error.response?.statusText || error.message}`)
  }
}
