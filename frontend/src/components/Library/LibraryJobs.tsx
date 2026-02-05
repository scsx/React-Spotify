import { useEffect, useState } from 'react'

import { TLibraryJob, getLibraryJobs } from '@/services/library/getLibraryJobs'
import { getLibrarySyncResult } from '@/services/library/getLibrarySyncResult'

import TemporaryPLViewer from './TemporaryPLViewer'

export default function LibraryJobs() {
  const [jobs, setJobs] = useState<TLibraryJob[]>([])
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [selectedResult, setSelectedResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await getLibraryJobs()
        console.log('Jobs received:', data)
        setJobs(data)
      } catch (e) {
        console.error('Erro ao carregar jobs:', e)
      }
    }
    loadJobs()
  }, [])

  const handlePreview = async (jobId: string) => {
    setLoading(true)
    try {
      const result = await getLibrarySyncResult(jobId)
      setSelectedJobId(jobId)
      setSelectedResult(result)
    } catch (e) {
      console.error('Erro ao carregar resultado:', e)
    } finally {
      setLoading(false)
    }
  }

  if (selectedJobId) {
    return (
      <div>
        <button
          onClick={() => setSelectedJobId(null)}
          className="mb-2 px-2 py-1 bg-gray-500 text-white rounded"
        >
          ← Voltar
        </button>
        {selectedResult && <TemporaryPLViewer playlists={selectedResult.playlists} />}
      </div>
    )
  }

  return (
    <div>
      <h3 className="font-semibold mb-2">Histórico de Jobs ({jobs.length})</h3>

      <div className="space-y-2">
        {jobs.map((job) => (
          <div key={job.id} className="flex items-center gap-2 p-2 border rounded">
            <span className="flex-1 font-mono text-sm">{job.id.slice(0, 8)}...</span>
            <span
              className={`px-2 py-1 rounded text-sm ${
                job.status === 'completed'
                  ? 'bg-green-100'
                  : job.status === 'failed'
                    ? 'bg-red-600'
                    : 'bg-yellow-600'
              }`}
            >
              {job.status}
            </span>
            <span className="text-xs">
              {job.progress.completed}/{job.progress.total}
            </span>
            <button
              onClick={() => handlePreview(job.id)}
              disabled={loading}
              className="px-2 py-1 bg-blue-500 text-white rounded text-sm disabled:opacity-50"
            >
              Preview
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
