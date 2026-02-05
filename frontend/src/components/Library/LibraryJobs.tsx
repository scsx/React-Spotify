import { useEffect, useState } from 'react'

import { AiOutlineDelete } from 'react-icons/ai'
import { LuEye } from 'react-icons/lu'

import Text from '@/components/shared/Text'
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

import { formatJobDate } from '@/lib/format-job-date'

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

  const handleDeleteJob = () => {
    console.log('Delete job - to be implemented')
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
      <Text variant="h4">Job History ({jobs.length})</Text>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead>Actions</TableHead>
            <TableHead className="border-l-2">Saved to IndexDB</TableHead>
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
            [...jobs]
              .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
              .map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-mono text-sm">
                    {job.id?.slice(0, 14) || 'n/a'}...
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-sm inline-block ${
                        job.status === 'completed'
                          ? 'bg-green-600 text-white'
                          : job.status === 'failed'
                            ? 'bg-red-600 text-white'
                            : 'bg-yellow-600 text-white'
                      }`}
                    >
                      {job.status === 'completed' ? 'OK' : job.status || 'n/a'}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono">
                    {job.progress
                      ? `${job.progress.completed || 0}/${job.progress.total || 0}`
                      : 'n/a'}
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const formatted = formatJobDate(job.createdAt)
                      return formatted ? (
                        <>
                          {formatted.date}
                          <br />
                          {formatted.time}
                        </>
                      ) : (
                        'n/a'
                      )
                    })()}
                  </TableCell>

                  <TableCell className="flex items-center gap-2">
                    <button onClick={() => handlePreview(job.id)} disabled={loading}>
                      <LuEye />
                    </button>
                    <button onClick={handleDeleteJob} disabled={loading}>
                      <AiOutlineDelete />
                    </button>
                  </TableCell>

                  <TableCell className="border-l-2">saved date or button "save"</TableCell>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
