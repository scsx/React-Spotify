import { TSpotifyArtist } from '@/types/SpotifyArtist'
import { TSpotifyGenres } from '@/types/SpotifyGenres'
import { TSpotifySearchResults } from '@/types/SpotifySearchResults'
import axios from 'axios'

import { SPOTIFY_API_BASE_URL } from '@/lib/constants'

interface TFakeRelatedArtistsParams {
  artist: TSpotifyArtist
  genres: TSpotifyGenres
}

interface TFakeRelatedArtistsResponse {
  artists: TSpotifyArtist[]
}

// getSpotifyFakeRelatedArtists "related artists" using search instead of the deprecated endpoint /artists/{id}/related-artists
export const getSpotifyFakeRelatedArtists = async (
  params: TFakeRelatedArtistsParams
): Promise<TFakeRelatedArtistsResponse> => {
  let limit: number = 9
  try {
    const { artist, genres } = params

    // Usar os géneros do parâmetro 'genres' (ou 'artist.genres', ambos devem ser os mesmos)
    const genresToSearch: TSpotifyGenres = genres || artist.genres || [] // Prioriza 'genres' se fornecido, fallback para 'artist.genres'

    if (!genresToSearch || genresToSearch.length === 0) {
      console.warn(
        `getSpotifyFakeRelatedArtists: Artista ${artist.name} (${artist.id}) não tem géneros. Não é possível encontrar artistas semelhantes por género.`
      )
      return { artists: [] }
    }

    const slicedGenres = genresToSearch.slice(0, 3)
    const searchQuery = slicedGenres.join(' OR ')

    // Usar o endpoint /search para encontrar artistas por género
    const searchResponse = await axios.get<TSpotifySearchResults>(
      `${SPOTIFY_API_BASE_URL}/search`,
      {
        params: {
          q: searchQuery,
          type: 'artist',
          limit: limit + 1,
          // market: 'PT'
        },
      }
    )

    let foundArtists: TSpotifyArtist[] = searchResponse.data.artists?.items || []

    foundArtists = foundArtists.filter((item) => item.id !== artist.id)

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
