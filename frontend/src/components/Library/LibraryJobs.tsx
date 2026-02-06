import { useEffect, useState } from 'react'

import { AiOutlineDelete } from 'react-icons/ai'
import { FaCcDiscover, FaCheckCircle } from 'react-icons/fa'
import { IoWarningOutline } from 'react-icons/io5'
import { IoCloseSharp } from 'react-icons/io5'
import { LuEye } from 'react-icons/lu'

import Loading from '@/components/shared/Loading'
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

import TemporaryPLViewer from './LibraryPLViewer'

export default function LibraryJobs() {
  const [jobs, setJobs] = useState<TLibraryJob[]>([])
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [selectedResult, setSelectedResult] = useState<TLibrarySyncResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [savedJobs, setSavedJobs] = useState<Record<string, number>>({})
  const [isLoadingJobs, setIsLoadingJobs] = useState(true)

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await getLibraryJobs()
        setJobs(data)
      } catch (e) {
        console.error('Error loading jobs:', e)
      } finally {
        setIsLoadingJobs(false)
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

  const handleSaveToIndexDB = async (jobId: string) => {
    try {
      const result = await getLibrarySyncResult(jobId)
      const db = indexedDB.open('react-spotify', 1)
      db.onsuccess = (event) => {
        const database = (event.target as IDBOpenDBRequest).result
        const transaction = database.transaction(['library-jobs'], 'readwrite')
        const store = transaction.objectStore('library-jobs')
        store.put({ jobId, data: result, savedAt: Date.now() })
        setSavedJobs((prev) => ({ ...prev, [jobId]: Date.now() }))
      }
    } catch (e) {
      console.error('Error saving to IndexDB:', e)
    }
  }

  const handleDeleteJob = () => {
    console.log('Delete job - to be implemented')
  }

  if (selectedJobId) {
    return (
      <div>
        <button onClick={() => setSelectedJobId(null)} className="mb-2 px-2 py-1">
          ← Back
        </button>
        {selectedResult && <TemporaryPLViewer playlists={selectedResult.playlists} />}
      </div>
    )
  }

  if (isLoadingJobs) {
    return (
      <>
        <Text variant="h4" className="mb-4">
          Job History...
        </Text>
        <Loading type="table" gridSize="4x6" />
      </>
    )
  }

  return (
    <div>
      <div className="flex items-center">
        <Text variant="h4" className="mb-4">
          Job History ({jobs.length})
        </Text>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Created</TableHead>
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
                  <TableCell className="flex items-center">
                    <span
                      className={`text-lg inline-block ml-[15%] ${
                        job.status === 'completed'
                          ? 'text-green-600'
                          : job.status === 'failed'
                            ? 'text-red-600'
                            : 'text-yellow-600'
                      }`}
                    >
                      {job.status === 'completed' ? (
                        <FaCheckCircle />
                      ) : job.status === 'failed' ? (
                        <IoCloseSharp />
                      ) : (
                        <IoWarningOutline />
                      )}
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

                  <TableCell className="flex items-center gap-4">
                    <button
                      className="text-2xl hover:text-blue-500"
                      onClick={() => handlePreview(job.id)}
                      disabled={loading}
                    >
                      <LuEye />
                    </button>
                    <button
                      className="text-2xl hover:text-red-500"
                      onClick={handleDeleteJob}
                      disabled={loading}
                    >
                      <AiOutlineDelete />
                    </button>
                  </TableCell>

                  <TableCell className="border-l-2">
                    {savedJobs[job.id] ? (
                      <span className="text-sm">
                        {formatJobDate(savedJobs[job.id])?.date}
                        <br />
                        {formatJobDate(savedJobs[job.id])?.time}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSaveToIndexDB(job.id)}
                        className="text-2xl hover:text-blue-500"
                        disabled={loading}
                      >
                        <FaCcDiscover />
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
