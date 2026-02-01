import axios from 'axios'

export const getSpotifyArtistIsFollowedByUser = async (artistId: string): Promise<boolean> => {
  try {
    const response = await axios.get(`/api/spotify/artists/${artistId}/user-follows`)

    return response.data.follows === true
  } catch (error) {
    console.error('Failed to check if user follows artist:', error)
    throw new Error('Failed to check if user follows artist')
  }
}
