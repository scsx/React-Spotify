import {
  TLastFmSimilarTracksError,
  TLastFmSimilarTracksResponse,
} from '@/types/LastFmSimilarTracks'
import axios from 'axios'

export async function getLastFMSimilarTracks(
  artistName: string,
  trackName: string,
  limit: number = 10
): Promise<TLastFmSimilarTracksResponse | TLastFmSimilarTracksError> {
  try {
    const response = await axios.get<TLastFmSimilarTracksResponse>(`/api/lastfm/track.getsimilar`, {
      params: {
        artist: artistName,
        track: trackName,
        limit,
      },
    })
    return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response && error.response.data) {
      if (
        typeof error.response.data === 'object' &&
        'error' in error.response.data &&
        'message' in error.response.data
      ) {
        console.error(
          'Error fetching Last.FM similar tracks (API Error Response):',
          error.response.data.message
        )
        return error.response.data as TLastFmSimilarTracksError
      }
      console.error(
        'Error fetching Last.FM similar tracks (HTTP Error Response):',
        error.response.status,
        error.response.data
      )
      return {
        error: error.response.status,
        message: `API Error: ${error.response.status} - ${error.response.data.message || 'Unknown'}`,
      }
    }

    console.error(
      'Error fetching Last.FM similar tracks via proxy (Network/Unknown Error):',
      error instanceof Error ? error.message : String(error)
    )
    return { error: -1, message: 'Failed to load similar tracks from Last.FM proxy.' }
  }
}
