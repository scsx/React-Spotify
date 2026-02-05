import { TLibraryPlaylist } from '@/types/Library'
import axios from 'axios'

export type TLibrarySyncResult = {
  meta?: {
    syncedAt?: string
    playlistCount?: number
    totalTracks?: number
  }
  playlists: TLibraryPlaylist[]
  errors: Array<{ id: string; error: string }>
}

export async function getLibrarySyncResult(jobId: string): Promise<TLibrarySyncResult> {
  const response = await axios.get<TLibrarySyncResult>(`/api/spotify/library/sync/${jobId}/result`)
  return response.data
}
