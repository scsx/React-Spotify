import { TSpotifyArtist } from '@/types/SpotifyArtist'
import { TSpotifyGenres } from '@/types/SpotifyGenres'
import { TSpotifySearchResults } from '@/types/SpotifySearchResults'
import axios from 'axios'

import { SPOTIFY_API_BASE_URL } from '@/lib/constants'

interface TFakeRelatedArtistsResponse {
  artists: TSpotifyArtist[]
}

// NOTE: getSpotifyFakeRelatedArtists "related artists" using search instead of the deprecated endpoint /artists/{id}/related-artists
export const getSpotifyFakeRelatedArtists = async (
  artistId: string,
  artistGenres: TSpotifyGenres,
  limit: number = 9
): Promise<TFakeRelatedArtistsResponse> => {
  try {
    if (!artistGenres || artistGenres.length === 0) {
      console.warn(
        `getSpotifyFakeRelatedArtists: Nenhum género fornecido para o artista ${artistId}. Não é possível encontrar artistas semelhantes por género.`
      )
      return { artists: [] }
    }

    const slicedGenres = artistGenres.slice(0, 3)
    const searchQuery = slicedGenres.join(' OR ')

    const searchResponse = await axios.get<TSpotifySearchResults>(
      `${SPOTIFY_API_BASE_URL}/search`,
      {
        params: {
          q: searchQuery,
          type: 'artist',
          limit: limit + 1,
          // market: 'PT' // TODO: use?
        },
      }
    )

    let foundArtists: TSpotifyArtist[] = searchResponse.data.artists?.items || []
    foundArtists = foundArtists.filter((item) => item.id !== artistId)

    return { artists: foundArtists.slice(0, limit) }
  } catch (error: any) {
    console.error(
      'getSpotifyFakeRelatedArtists: Erro ao buscar artistas semelhantes (via pesquisa por género):',
      error.response?.data || error.message,
      error.config?.url
    )
    throw new Error(
      `Falha ao obter artistas semelhantes: ${error.response?.statusText || error.message}`
    )
  }
}
