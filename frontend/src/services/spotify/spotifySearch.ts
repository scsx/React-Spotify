import { TSpotifySearchResults } from '@/types/SpotifySearchResults'
import axios from 'axios'

import { SPOTIFY_API_BASE_URL } from '@/lib/constants'

// Searches for Artist or Track. Keep adding <types> and conditions for album, playlist, etc.
const spotifySearch = async (
  query: string,
  searchType: string,
  genres?: string
): Promise<TSpotifySearchResults> => {
  try {
    // ORDER MATTERS
    // 0
    let params: string = ''
    // 1
    if (query !== '') {
      params += `q=${encodeURIComponent(query)}`
    } else {
      params += 'q='
    }
    // 2
    // Genres must be formatted in GenresFinder.tsx or wherever they come from.
    if (genres) {
      params += `genre:${genres}`
    }
    // 3
    params += `&type=${searchType}`

    const response = await axios.get(`${SPOTIFY_API_BASE_URL}/search?${params}`)

    if (searchType === 'artist') {
      return {
        items: response.data.artists.items,
        nextPage: response.data.artists.next ? response.data.artists.next : '',
        prevPage: response.data.artists.prev ? response.data.artists.prev : '',
        total: response.data.artists.total,
      }
    } else if (searchType === 'track') {
      return {
        items: response.data.tracks.items,
        nextPage: response.data.tracks.next ? response.data.tracks.next : '',
        prevPage: response.data.tracks.prev ? response.data.tracks.prev : '',
        total: response.data.tracks.total,
      }
    } else {
      throw new Error('Invalid search type')
    }
  } catch (error) {
    throw new Error('Failed to fetch from Spotify API')
  }
}

export default spotifySearch
