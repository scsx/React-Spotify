import { TSpotifyArtist } from '@/types/SpotifyArtist'
import axios from 'axios'

export const getSpotifyArtist = async (artistId: string): Promise<TSpotifyArtist> => {
  try {
    const response = await axios.get(`/api/spotify/artists/${artistId}`)

    const artist: TSpotifyArtist = response.data

    return artist
  } catch (error) {
    console.error('Failed to get artist:', error)
    throw new Error('Failed to get artist')
  }
}
