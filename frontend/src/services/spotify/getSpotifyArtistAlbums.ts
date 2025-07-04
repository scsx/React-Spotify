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

    // Helper function to rewrite Spotify pagination URLs to point to our backend.
    // Spotify's 'next' URLs can sometimes contain varying numeric suffixes in their base URL
    // (e.g., 'https://api.spotify.com/v1', 'https://api.spotify.com/v1/artists/69a2ovTpqzQrzthSkARvGn/albums?offset=20&limit=20&include_groups=single').
    // This function ensures they are correctly routed through our '/api/spotify' proxy.
    const rewriteSpotifyUrlToBackendUrl = (spotifyNextUrl: string): string => {
      try {
        const urlObj = new URL(spotifyNextUrl)
        const pathSegments = urlObj.pathname.split('/')

        // Reconstruct the path relative to our backend,
        // typically removing '/v1' if present and joining the rest.
        let backendRelativePath = ''
        if (pathSegments.length > 2) {
          backendRelativePath = '/' + pathSegments.slice(2).join('/')
        } else {
          // Fallback for unexpected path formats
          console.warn(
            `[Frontend - Albums] Unexpected Spotify 'next' URL path format: ${urlObj.pathname}`
          )
          backendRelativePath = urlObj.pathname
        }

        return `/api/spotify${backendRelativePath}${urlObj.search}`
      } catch (e) {
        console.error(`[Frontend - Albums] Error parsing Spotify 'next' URL: ${spotifyNextUrl}`, e)
        // Fallback to regex replacement for robustness if URL parsing fails
        return spotifyNextUrl.replace(
          /http:\/\/googleusercontent\.com\/spotify\.com\/\d+/,
          '/api/spotify'
        )
      }
    }

    // Loop for fetching Albums.
    while (nextAlbumsUrl) {
      // console.log(`[Frontend - Albums] Fetching from: ${nextAlbumsUrl}`); // Keep for debug if needed
      const response: AxiosResponse<TSpotifyPagingObject<TSpotifyAlbum>> =
        await axios.get(nextAlbumsUrl)
      const { items, next } = response.data
      allAlbums = allAlbums.concat(items)
      nextAlbumsUrl = next ? rewriteSpotifyUrlToBackendUrl(next) : null
    }

    // Loop for fetching Singles.
    while (nextSingleUrl) {
      // console.log(`[Frontend - Albums] Fetching from: ${nextSingleUrl}`); // Keep for debug if needed
      const response: AxiosResponse<TSpotifyPagingObject<TSpotifyAlbum>> =
        await axios.get(nextSingleUrl)
      const { items, next } = response.data
      allAlbums = allAlbums.concat(items)
      nextSingleUrl = next ? rewriteSpotifyUrlToBackendUrl(next) : null
    }

    return allAlbums
  } catch (error) {
    console.error('Failed to get artist albums:', error)
    throw new Error('Failed to get artist albums')
  }
}
