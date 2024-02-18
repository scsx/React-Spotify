import axios from 'axios'
import { SpotifySearchResults } from '@/types/SpotifySearchResults'

// Searches for Artist or Track. Keep adding <types> and conditions for album, playlist, etc.
const searchSpotify = async (
  query: string,
  searchType: string
): Promise<SpotifySearchResults> => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/search?type=${searchType}`,
      {
        params: {
          q: query
        }
      }
    )
    
    if (searchType === 'artist') {
      return {
        items: response.data.artists.items,
        nextPage: response.data.artists.next ? response.data.artists.next : '',
        prevPage: response.data.artists.prev ? response.data.artists.prev : '',
        total: response.data.artists.total
      }
    } else if (searchType === 'track') {
      return {
        items: response.data.tracks.items,
        nextPage: response.data.tracks.next ? response.data.tracks.next : '',
        prevPage: response.data.tracks.prev ? response.data.tracks.prev : '',
        total: response.data.tracks.total
      }
    } else {
      throw new Error('Invalid search type')
    }
  } catch (error) {
    throw new Error('Failed to fetch from Spotify API')
  }
}

export default searchSpotify
