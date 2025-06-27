import { TSpotifySearchResults } from '@/types/SpotifySearchResults'
import axios from 'axios'

// Searches for Artist or Track. Keep adding <types> and conditions for album, playlist, etc.
const spotifySearch = async (
  query: string,
  searchType: string,
  genres?: string
): Promise<TSpotifySearchResults> => {
  try {
    let finalQuery = query.trim()
    if (genres && genres.trim() !== '') {
      finalQuery += ` ${genres.trim()}`
    }

    if (!finalQuery && !searchType) {
      throw new Error('No search query or type provided.')
    }

    const response = await axios.get<TSpotifySearchResults>(`/api/spotify/search`, {
      params: {
        q: finalQuery,
        type: searchType,
        limit: 50,
        // market: 'PT' // If you want to explicitly pass market from frontend
      },
    })

    return response.data
  } catch (error) {
    console.error('Failed to fetch from Spotify API:', error)
    throw new Error('Failed to fetch from Spotify API')
  }
}

export default spotifySearch
