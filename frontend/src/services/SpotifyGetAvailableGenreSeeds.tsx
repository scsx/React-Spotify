import axios from 'axios'

interface AvailableGenreSeedsResponse {
  genres: string[]
}

export const getGenreSeeds = async (): Promise<AvailableGenreSeedsResponse> => {
  try {
    const response = await axios.get(
      'https://api.spotify.com/v1/recommendations/available-genre-seeds'
    )

    const genres: AvailableGenreSeedsResponse = response.data

    return genres
  } catch (error) {
    throw new Error('Failed to get top tracks')
  }
}
