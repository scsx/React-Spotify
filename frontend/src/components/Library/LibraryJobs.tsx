import { useEffect, useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { TLibraryJob, getLibraryJobs } from '@/services/library/getLibraryJobs'
import { TLibrarySyncResult, getLibrarySyncResult } from '@/services/library/getLibrarySyncResult'

import TemporaryPLViewer from './TemporaryPLViewer'

export default function LibraryJobs() {
  const [jobs, setJobs] = useState<TLibraryJob[]>([])
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [selectedResult, setSelectedResult] = useState<TLibrarySyncResult | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await getLibraryJobs()
        setJobs(data)
      } catch (e) {
        console.error('Error loading jobs:', e)
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
          ← Back
        </button>
        {selectedResult && <TemporaryPLViewer playlists={selectedResult.playlists} />}
      </div>
    )
  }

  return (
    <div>
      <h3 className="font-semibold mb-4">Job History ({jobs.length})</h3>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead>Updated at</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-gray-400">
                No jobs in history
              </TableCell>
            </TableRow>
          ) : (
            jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-mono text-sm">
                  {job.id?.slice(0, 8) || 'n/a'}...
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-sm inline-block ${
                      job.status === 'completed'
                        ? 'bg-green-700'
                        : job.status === 'failed'
                          ? 'bg-red-600'
                          : 'bg-yellow-600'
                    }`}
                  >
                    {job.status || 'n/a'}
                  </span>
                </TableCell>
                <TableCell>
                  {job.progress
                    ? `${job.progress.completed || 0}/${job.progress.total || 0}`
                    : 'n/a'}
                </TableCell>
                <TableCell>
                  {job.createdAt ? new Date(job.createdAt).toLocaleString('en-US') : 'n/a'}
                </TableCell>
                <TableCell>
                  {job.updatedAt ? new Date(job.updatedAt).toLocaleString('en-US') : 'n/a'}
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => handlePreview(job.id)}
                    disabled={loading}
                    className="px-2 py-1 bg-blue-700 text-white rounded text-sm disabled:opacity-50 hover:bg-blue-800"
                  >
                    Preview
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
