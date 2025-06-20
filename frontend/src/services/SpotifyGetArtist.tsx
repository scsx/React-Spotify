import axios from 'axios'
import { SpotifyArtist } from '@/types/SpotifyArtist'

export const getArtist = async (artistId: string): Promise<SpotifyArtist> => {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`)

    const artist: SpotifyArtist = response.data

    return artist
  } catch (error) {
    throw new Error('Failed to get top tracks')
  }
}
