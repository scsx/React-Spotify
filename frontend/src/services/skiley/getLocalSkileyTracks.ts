import { TSkileyLikedSong } from '@/types/SkileyTrack'

import { LOCAL_SKILEY_DATA_PATH } from '@/lib/constants'

let cache: TSkileyLikedSong[] | null = null

export const getLocalSkileyTracks = async (): Promise<TSkileyLikedSong[]> => {
  if (cache) return cache

  const res = await fetch(LOCAL_SKILEY_DATA_PATH)

  if (!res.ok) {
    throw new Error(`Failed to load Skiley tracks (${res.status})`)
  }

  const json = await res.json()
  cache = json

  return json
}
