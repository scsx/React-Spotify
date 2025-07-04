import { TSpotifyPlaylist } from '@/types/SpotifyPlaylist'
import { TSpotifyPagingObject } from '@/types/SpotifySearchResults'
import axios, { AxiosResponse } from 'axios'

interface GetSpotifyUserPlaylistsOptions {
  limit?: number
  offset?: number
}

export const getSpotifyUserPlaylists = async (
  options?: GetSpotifyUserPlaylistsOptions
): Promise<TSpotifyPagingObject<TSpotifyPlaylist>> => {
  try {
    const params = new URLSearchParams()
    if (options?.limit) {
      params.append('limit', options.limit.toString())
    }
    if (options?.offset) {
      params.append('offset', options.offset.toString())
    }

    const queryString = params.toString()
    const url = `/api/spotify/playlists${queryString ? `?${queryString}` : ''}`

    const response: AxiosResponse<TSpotifyPagingObject<TSpotifyPlaylist>> = await axios.get(url)

    return response.data
  } catch (error) {
    console.error('Failed to get user playlists:', error)
    throw new Error('Failed to get user playlists')
  }
}
