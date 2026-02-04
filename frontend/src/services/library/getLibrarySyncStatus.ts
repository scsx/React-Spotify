import axios from 'axios'

export type TLibrarySyncStatus = {
  id: string
  status: 'queued' | 'running' | 'completed' | 'failed'
  progress?: {
    completed: number
    total: number
  }
  updatedAt?: number
  error?: string
}

export async function getLibrarySyncStatus(jobId: string): Promise<TLibrarySyncStatus> {
  const response = await axios.get<TLibrarySyncStatus>(`/api/spotify/library/sync/${jobId}`)
  return response.data
}
