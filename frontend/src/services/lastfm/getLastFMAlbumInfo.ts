import { TLastFmAlbumGetInfoError, TLastFmAlbumGetInfoResponse } from '@/types/LastFmAlbum'
import axios from 'axios'

export async function getLastFMAlbumInfo(
  artistName: string,
  albumName: string
): Promise<TLastFmAlbumGetInfoResponse | TLastFmAlbumGetInfoError> {
  try {
    const response = await axios.get<TLastFmAlbumGetInfoResponse>(`/api/lastfm/album.getinfo`, {
      params: {
        artist: artistName,
        album: albumName,
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
          'Error fetching Last.FM album info (API Error Response):',
          error.response.data.message
        )
        return error.response.data as TLastFmAlbumGetInfoError
      }
      console.error(
        'Error fetching Last.FM album info (HTTP Error Response):',
        error.response.status,
        error.response.data
      )
      return {
        error: error.response.status,
        message: `API Error: ${error.response.status} - ${error.response.data.message || 'Unknown'}`,
      }
    }

    console.error(
      'Error fetching Last.FM album info via proxy (Network/Unknown Error):',
      error.message || error
    )
    return { error: -1, message: 'Failed to load album info from Last.FM proxy.' }
  }
}
