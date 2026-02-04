import axios from 'axios'

export type TLibrarySyncResult = {
  playlists: Array<{
    id: string
    name: string
    details: unknown
    tracks: unknown[]
  }>
  errors: Array<{ id: string; error: string }>
}

export async function getLibrarySyncResult(jobId: string): Promise<TLibrarySyncResult> {
  const response = await axios.get<TLibrarySyncResult>(`/api/spotify/library/sync/${jobId}/result`)
  return response.data
}
