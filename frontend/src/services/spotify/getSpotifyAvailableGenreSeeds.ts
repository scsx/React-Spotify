import axios from 'axios'

interface TAvailableGenreSeedsResponse {
  genres: string[]
}

export const getSpotifyGenreSeeds = async (): Promise<TAvailableGenreSeedsResponse> => {
  try {
    const response = await axios.get(
      'https://api.spotify.com/v1/recommendations/available-genre-seeds'
    )

    const genres: TAvailableGenreSeedsResponse = response.data

    return genres
  } catch (error) {
    throw new Error('Failed to get top tracks')
  }
}
