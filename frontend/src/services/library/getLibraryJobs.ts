import axios from 'axios'

export type TLibraryJob = {
  id: string
  status: 'queued' | 'running' | 'completed' | 'failed'
  progress: { completed: number; total: number }
  createdAt: number
  updatedAt: number
  resultPath?: string
  error?: string
}

export async function getLibraryJobs(): Promise<TLibraryJob[]> {
  const response = await axios.get<TLibraryJob[]>(`/api/spotify/library/jobs`)
  return response.data
}
