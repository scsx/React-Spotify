import axios from 'axios'
import { SpotifySearchResults } from '@/types/SpotifySearchResults'

// Searches for Artist or Track. Keep adding <types> and conditions for album, playlist, etc.
const searchSpotify = async (
  query: string,
  searchType: string,
  genres?: string
): Promise<SpotifySearchResults> => {
  try {
    let url = `https://api.spotify.com/v1/search?type=${searchType}&q=${query}`

    if (genres) {
      console.log(genres)
      url += `%20genre=${encodeURIComponent(genres)}`
      console.log(url)
    }

    const response = await axios.get(url)

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
