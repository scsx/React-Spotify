import { TSpotifyArtist } from '@/types/SpotifyArtist'
import axios from 'axios'

export const getSpotifyArtist = async (artistId: string): Promise<TSpotifyArtist> => {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`)

    const artist: TSpotifyArtist = response.data

    return artist
  } catch (error) {
    throw new Error('Failed to get top tracks')
  }
}
