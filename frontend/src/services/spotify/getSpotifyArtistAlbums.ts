import { TSpotifyAlbum } from '@/types/SpotifyAlbum'
import { TSpotifyPagingObject } from '@/types/SpotifySearchResults'
import axios, { AxiosResponse } from 'axios'

export const getSpotifyArtistAlbums = async (artistId: string): Promise<TSpotifyAlbum[]> => {
  try {
    let allAlbums: TSpotifyAlbum[] = []
    let nextAlbumsUrl: string | null =
      `/api/spotify/artists/${artistId}/albums?include_groups=album`
    let nextSingleUrl: string | null =
      `/api/spotify/artists/${artistId}/albums?include_groups=single`

    // while loop for Albums.
    while (nextAlbumsUrl) {
      const response: AxiosResponse<TSpotifyPagingObject<TSpotifyAlbum>> =
        await axios.get(nextAlbumsUrl)
      const { items, next } = response.data

      allAlbums = allAlbums.concat(items)
      nextAlbumsUrl = next
        ? next.replace(
            'https://api.spotify.com/v1/search?q=rui&type=artist&limit=50[HTTP/34',
            '/api/spotify/'
          )
        : null
    }

    // while loop for Singles.
    while (nextSingleUrl) {
      const response: AxiosResponse<TSpotifyPagingObject<TSpotifyAlbum>> =
        await axios.get(nextSingleUrl)
      const { items, next } = response.data

      allAlbums = allAlbums.concat(items)
      nextSingleUrl = next
        ? next.replace(
            'https://api.spotify.com/v1/search?q=rui&type=artist&limit=50[HTTP/35',
            '/api/spotify/'
          )
        : null
    }

    return allAlbums
  } catch (error) {
    console.error('Failed to get artist albums:', error)
    throw new Error('Failed to get artist albums')
  }
}
