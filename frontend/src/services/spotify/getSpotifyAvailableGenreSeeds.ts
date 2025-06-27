import axios from 'axios'

interface TAvailableGenreSeedsResponse {
  genres: string[]
}

export const getSpotifyGenreSeeds = async (): Promise<TAvailableGenreSeedsResponse> => {
  try {
    const response = await axios.get(`/api/spotify/recommendations/available-genre-seeds`)

    const genres: TAvailableGenreSeedsResponse = response.data

    return genres
  } catch (error) {
    console.error('Failed to get genre seeds:', error)
    throw new Error('Failed to get genre seeds')
  }
}
