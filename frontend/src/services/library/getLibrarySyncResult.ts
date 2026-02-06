import { TLibrarySyncResult } from '@/types/Library'
import axios from 'axios'

export async function getLibrarySyncResult(jobId: string): Promise<TLibrarySyncResult> {
  const response = await axios.get<TLibrarySyncResult>(`/api/spotify/library/sync/${jobId}/result`)
  return response.data
}
