import { TSpotifyUserResponse } from '@/types/SpotifyUser'
import axios, { AxiosResponse } from 'axios'

export const getSpotifyCurrentUserProfile = async (): Promise<TSpotifyUserResponse> => {
  try {
    const response: AxiosResponse<TSpotifyUserResponse> = await axios.get('/api/spotify/me')

    return response.data
  } catch (error: any) {
    console.error('Error fetching user profile from Spotify API:', error)

    if (axios.isAxiosError(error) && error.response && error.response.data) {
      const errorMessage = error.response.data.message || 'Erro desconhecido da API Spotify.'
      throw new Error(`Erro da API Spotify: ${errorMessage}`)
    }

    throw new Error(
      'Não foi possível carregar o perfil do utilizador. Verifique a conexão ou a autenticação.'
    )
  }
}
