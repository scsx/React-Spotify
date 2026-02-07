import { TLibraryJob } from '@/types/Library'
import axios from 'axios'

export async function getLibraryJobs(): Promise<TLibraryJob[]> {
  const response = await axios.get<TLibraryJob[]>(`/api/spotify/library/jobs`)
  return response.data
}
