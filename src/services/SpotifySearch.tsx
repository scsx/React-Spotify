import axios from 'axios'
import { SpotifyArtist } from '@/types/SpotifyArtist'
import { SpotifyTrack } from '@/types/SpotifyTrack'

// Searches for Artist or Track. Keep adding Types and conditions for album, playlist, etc.
const searchSpotify = async (
  token: string,
  query: string,
  searchType: string
): Promise<SpotifyArtist[] | SpotifyTrack[]> => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/search?type=${searchType}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          q: query
        }
      }
    )

    if (searchType === 'artist') {
      const { items }: { items: SpotifyArtist[] } = response.data.artists
      return items
    } else if (searchType === 'track') {
      const { items }: { items: SpotifyTrack[] } = response.data.tracks
      return items
    } else {
      throw new Error('Invalid search type')
    }
  } catch (error) {
    throw new Error('Failed to fetch from Spotify API')
  }
}

export default searchSpotify
