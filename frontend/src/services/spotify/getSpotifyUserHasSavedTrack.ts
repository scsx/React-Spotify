import axios, { AxiosResponse } from 'axios'

type GetSpotifyUserHasSavedTrackResponse = {
  ids: string[]
  contains: boolean[]
}

export const getSpotifyUserHasSavedTrack = async (trackId: string): Promise<boolean> => {
  try {
    const params = new URLSearchParams()
    params.append('ids', trackId)

    const url = `/api/spotify/me/tracks/contains?${params.toString()}`

    const response: AxiosResponse<GetSpotifyUserHasSavedTrackResponse> = await axios.get(url)

    return response.data.contains[0] === true
  } catch (error) {
    console.error('Failed to check if track is saved:', error)
    throw new Error('Failed to check if track is saved')
  }
}
