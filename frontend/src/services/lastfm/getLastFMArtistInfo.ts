import axios from 'axios'

export async function getLastFMArtistInfo(artistName: string) {
  try {
    const response = await axios.get(`/api/lastfm/artist.getinfo`, {
      params: {
        artist: artistName,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching Last.FM artist info via proxy:', error)
    return { error: 'Failed to load artist info from Last.FM proxy.' }
  }
}
