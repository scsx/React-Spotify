import { TSpotifyPlaylist } from '@/types/SpotifyPlaylist'
import axios from 'axios'

interface SpotifyPlaylistsByNamesResponse {
  found: TSpotifyPlaylist[]
  notFound: string[]
  message: string
}

export async function getSpotifyPlaylistsByNames(
  playlistNames: string[]
): Promise<SpotifyPlaylistsByNamesResponse> {
  if (!playlistNames || playlistNames.length === 0) {
    return { found: [], notFound: [], message: 'No playlist names provided.' }
  }

  try {
    const response = await axios.post<SpotifyPlaylistsByNamesResponse>(
      '/api/spotify/playlists/by-names',
      { names: playlistNames } // O corpo do pedido deve ser um objeto com a propriedade 'names'
    )

    return response.data
  } catch (error: any) {
    console.error(
      `Erro ao buscar playlists por nomes (${playlistNames.join(', ')}) do backend:`,
      axios.isAxiosError(error) ? (error.response ? error.response.data : error.message) : error
    )
    throw new Error(`Falha ao carregar as playlists: ${playlistNames.join(', ')}.`)
  }
}
