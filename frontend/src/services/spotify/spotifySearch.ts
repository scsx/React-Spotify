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
    let finalQuery = query.trim()
    if (genres && genres.trim() !== '') {
      finalQuery += ` ${genres.trim()}`
    }

    if (!finalQuery && !searchType) {
      throw new Error('No search query or type provided.')
    }

    const response = await axios.get<TSpotifySearchResults>(`${SPOTIFY_API_BASE_URL}/search`, {
      params: {
        q: finalQuery,
        type: searchType,
        limit: 50,
        // market: 'PT'
      },
    })

    return response.data
  } catch (error) {
    throw new Error('Failed to fetch from Spotify API')
  }
}

export default spotifySearch
