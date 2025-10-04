import { getSpotifyAlbum } from '@/services/spotify/getSpotifyAlbum'
import { getSpotifyTrack } from '@/services/spotify/getSpotifyTrack'

export const checkSpotifyContentAvailability = async (
  type: 'track' | 'album', // Pode ser estendido para 'episode' | 'show' no futuro
  id: string
): Promise<boolean> => {
  try {
    if (!id) {
      console.warn(`[checkSpotifyContentAvailability] Missing ID for ${type}`)
      return false
    }

    const data = type === 'album' ? await getSpotifyAlbum(id) : await getSpotifyTrack(id)

    const markets = data?.available_markets

    return Array.isArray(markets) && markets.includes('PT')
  } catch (error) {
    console.error(`[checkSpotifyContentAvailability] Failed for ${type} ${id}:`, error)
    return false
  }
}
