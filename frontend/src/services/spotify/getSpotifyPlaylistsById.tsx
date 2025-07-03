import { TSpotifyPlaylist } from '@/types/SpotifyPlaylist'
import axios from 'axios'

/**
 * Get one or more Spotify playlists by their IDs.
 * The api function gets only one at a time, if more than one ID is provided the frontend manages the calls.
 */
export async function getSpotifyPlaylistsById(
  playlistIds: string | string[]
): Promise<TSpotifyPlaylist[]> {
  const idsToFetch = Array.isArray(playlistIds) ? playlistIds : [playlistIds]
  const fetchedPlaylists: TSpotifyPlaylist[] = []
  const errors: string[] = [] // Delay to prevent rate limiting.

  const THROTTLE_DELAY_MS_SINGLE = 100

  for (let i = 0; i < idsToFetch.length; i++) {
    const id = idsToFetch[i]
    try {
      const response = await axios.get(`/api/spotify/playlist-details/${id}`)
      fetchedPlaylists.push(response.data)
    } catch (error: any) {
      console.error(
        `Erro ao buscar playlist com ID ${id} do backend:`,
        error.response ? error.response.data : error.message
      )
      errors.push(`Falha ao buscar playlist ${id}`)
    }

    if (i < idsToFetch.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, THROTTLE_DELAY_MS_SINGLE))
    }
  }

  if (errors.length > 0) {
    console.warn("Warning: some playlists weren't fetched", errors)
  }

  return fetchedPlaylists
}
