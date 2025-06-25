import axios from 'axios'

import { SPOTIFY_API_BASE_URL } from '@/lib/constants'

// TODO: move?
interface TAvailableGenreSeedsResponse {
  genres: string[]
}

export const getSpotifyGenreSeeds = async (): Promise<TAvailableGenreSeedsResponse> => {
  try {
    const response = await axios.get(
      `${SPOTIFY_API_BASE_URL}/recommendations/available-genre-seeds`
    )

    const genres: TAvailableGenreSeedsResponse = response.data

    return genres
  } catch (error) {
    throw new Error('Failed to get top tracks')
  }
}
