import { TSpotifyAlbum } from '@/types/SpotifyAlbum'
import axios from 'axios'

export const getSpotifyArtistAlbums = async (artistId: string): Promise<TSpotifyAlbum[]> => {
  try {
    let allAlbums: TSpotifyAlbum[] = []

    // Two calls because API is simply returning only albums when using ?include_groups=album,single.
    let nextAlbumsUrl = `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album`
    let nextSingleUrl = `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=single`

    // while to keep asking after the 20 limit is passed - Albums.
    while (nextAlbumsUrl) {
      const response = await axios.get(nextAlbumsUrl)
      const { items, next } = response.data
      allAlbums = allAlbums.concat(items)

      // Check if there's another page of results
      nextAlbumsUrl = next
    }

    // while to keep asking after the 20 limit is passed - Singles.
    while (nextSingleUrl) {
      const response = await axios.get(nextSingleUrl)
      const { items, next } = response.data
      allAlbums = allAlbums.concat(items)

      nextSingleUrl = next
    }

    return allAlbums
  } catch (error) {
    throw new Error('Failed to get artist albums')
  }
}
