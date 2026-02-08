import { TDiscogsArtist, TDiscogsError } from '@/types/Discogs'
import axios from 'axios'

export async function getDiscogsArtist(
  artistId: string | number
): Promise<TDiscogsArtist | TDiscogsError> {
  try {
    const response = await axios.get<TDiscogsArtist>(`/api/discogs/artist/${artistId}`)
    return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response && error.response.data) {
      if (typeof error.response.data === 'object' && 'error' in error.response.data) {
        console.error(
          'Error fetching Discogs artist (API Error Response):',
          error.response.data.error
        )
        return error.response.data as TDiscogsError
      }
      console.error(
        'Error fetching Discogs artist (HTTP Error Response):',
        error.response.status,
        error.response.data
      )
      return {
        error: `API Error: ${error.response.status}`,
        details: error.response.data.error || 'Unknown error',
      }
    }

    console.error(
      'Error fetching Discogs artist via proxy (Network/Unknown Error):',
      error instanceof Error ? error.message : String(error)
    )
    return { error: 'Failed to load artist from Discogs.' }
  }
}
