import axios from 'axios'

import { TPlaylist } from '@/components/Library/TemporaryPLViewer'

export type TLibrarySyncResult = {
  meta?: {
    syncedAt?: string
    playlistCount?: number
    totalTracks?: number
  }
  playlists: TPlaylist[]
  errors: Array<{ id: string; error: string }>
}

export async function getLibrarySyncResult(jobId: string): Promise<TLibrarySyncResult> {
  const response = await axios.get<TLibrarySyncResult>(`/api/spotify/library/sync/${jobId}/result`)
  return response.data
}
