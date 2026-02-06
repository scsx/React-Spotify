import axios from 'axios'

export async function deleteLibraryJob(jobId: string): Promise<{ success: boolean }> {
  const response = await axios.delete(`/api/spotify/library/jobs/${jobId}`)
  return response.data
}
