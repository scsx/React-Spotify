import axios from 'axios'
import { SpotifyAlbum } from '@/types/SpotifyAlbum'

export const getArtistAlbums = async (artistId: string): Promise<SpotifyAlbum[]> => {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single`)

    const albums: SpotifyAlbum[] = response.data.items

    return albums
  } catch (error) {
    throw new Error('Failed to get top tracks')
  }
}
