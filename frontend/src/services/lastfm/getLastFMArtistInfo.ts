import { TLastFmArtistGetInfoError, TLastFmArtistGetInfoResponse } from '@/types/LastFmArtist'
import axios from 'axios'

export async function getLastFMArtistInfo(
  artistName: string
): Promise<TLastFmArtistGetInfoResponse | TLastFmArtistGetInfoError> {
  try {
    const response = await axios.get<TLastFmArtistGetInfoResponse>(`/api/lastfm/artist.getinfo`, {
      params: {
        artist: artistName,
      },
    })
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response && error.response.data) {
      if (
        typeof error.response.data === 'object' &&
        'error' in error.response.data &&
        'message' in error.response.data
      ) {
        console.error(
          'Error fetching Last.FM artist info (API Error Response):',
          error.response.data.message
        )
        return error.response.data as TLastFmArtistGetInfoError
      }
      console.error(
        'Error fetching Last.FM artist info (HTTP Error Response):',
        error.response.status,
        error.response.data
      )
      return {
        error: error.response.status,
        message: `API Error: ${error.response.status} - ${error.response.data.message || 'Unknown'}`,
      }
    }

    console.error(
      'Error fetching Last.FM artist info via proxy (Network/Unknown Error):',
      error.message || error
    )
    return { error: -1, message: 'Failed to load artist info from Last.FM proxy.' }
  }
}
