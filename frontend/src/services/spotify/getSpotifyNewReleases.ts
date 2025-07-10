import { TSpotifyAlbum } from '@/types/SpotifyAlbum'
import axios from 'axios'

const getSpotifyNewReleases = async (): Promise<TSpotifyAlbum[]> => {
  try {
    const response = await axios.get(`/api/spotify/new-releases`)
    const albums: TSpotifyAlbum[] = response.data.items
    return albums
  } catch (error) {
    console.error('Failed to get Spotify albums:', error)
    throw new Error('Failed to get Spotify albums')
  }
}

export default getSpotifyNewReleases
