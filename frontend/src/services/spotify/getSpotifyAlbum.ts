import { TSpotifyAlbum } from '@/types/SpotifyAlbum'
import axios from 'axios'

export const getSpotifyAlbum = async (albumId: string): Promise<TSpotifyAlbum> => {
  try {
    const response = await axios.get(`/api/spotify/albums/${albumId}`)

    const album: TSpotifyAlbum = response.data

    return album
  } catch (error) {
    console.error(`Failed to get album details for ID ${albumId}:`, error)
    throw new Error('Failed to get album details')
  }
}
