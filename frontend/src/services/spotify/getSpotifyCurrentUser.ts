import { TSpotifyUser } from '@/types/SpotifyUser'
import axios, { AxiosResponse } from 'axios'

export const getCurrentUserProfile = async (): Promise<TSpotifyUser> => {
  try {
    const response: AxiosResponse<TSpotifyUser> = await axios.get('/api/spotify/me')
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw new Error('Não foi possível carregar o perfil do utilizador.')
  }
}
