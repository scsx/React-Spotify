import { TSkileyLikedSong } from '@/types/SkileyTrack'

import { LOCAL_SKILEY_DATA_PATH } from '@/lib/constants'

let cache: TSkileyLikedSong[] | null = null

const loadSkileyData = async (): Promise<TSkileyLikedSong[]> => {
  if (cache) return cache

  const response = await fetch(LOCAL_SKILEY_DATA_PATH)

  if (!response.ok) {
    throw new Error(`Failed to load Skiley data: ${response.status}`)
  }

  const json = await response.json()
  cache = json

  return json
}

export const getLocalSkileyTrackById = async (
  trackId: string
): Promise<TSkileyLikedSong | null> => {
  const tracks = await loadSkileyData()

  const track = tracks.find((t) => {
    const id = t.trackUrl.split('/').pop()
    return id === trackId
  })

  return track ?? null
}
