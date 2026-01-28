import { TSpotifyArtist } from '@/types/SpotifyArtist'
import { TSpotifyTrack } from '@/types/SpotifyTrack'
import { TSpotifyUserTopItemsResponse } from '@/types/SpotifyUser'
import axios, { AxiosResponse } from 'axios'

export const getSpotifyUserTopItems = async <T extends TSpotifyTrack | TSpotifyArtist>(
  type: 'tracks' | 'artists',
  timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
  limit: number = 20
): Promise<TSpotifyUserTopItemsResponse<T>> => {
  try {
    const response: AxiosResponse<TSpotifyUserTopItemsResponse<T>> = await axios.get(
      `/api/spotify/user-top-items/${type}`,
      {
        params: {
          time_range: timeRange,
          limit,
        },
      }
    )

    return response.data
  } catch (error: unknown) {
    console.error('Error fetching user top items from Spotify API:', error)

    if (axios.isAxiosError(error) && error.response?.data) {
      const errorMessage =
        (error.response.data as { message?: string }).message || 'Erro desconhecido da API Spotify.'
      throw new Error(`Erro da API Spotify: ${errorMessage}`)
    }

    throw new Error(
      'Não foi possível carregar os top items. Verifique a conexão ou a autenticação.'
    )
  }
}
