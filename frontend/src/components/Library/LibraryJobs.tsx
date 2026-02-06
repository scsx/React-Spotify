import { useEffect, useRef, useState } from 'react'

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
import { getLibrarySyncStatus } from '@/services/library/getLibrarySyncStatus'
import { startLibrarySync } from '@/services/library/startLibrarySync'

import { SPOTIFY_FAVORITE_PLAYLISTS, SPOTIFY_SPECIAL_PLAYLISTS } from '@/lib/constants'
import { formatJobDate, formatJobDateCompact } from '@/lib/format-job-date'

import TemporaryPLViewer from './LibraryPLViewer'

export default function LibraryJobs() {
  const [jobs, setJobs] = useState<TLibraryJob[]>([])
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [selectedResult, setSelectedResult] = useState<TLibrarySyncResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [savedJobs, setSavedJobs] = useState<Record<string, number>>({})
  const [isLoadingJobs, setIsLoadingJobs] = useState(true)
  const [jobId, setJobId] = useState<string | null>(null)
  const [playlistSyncError, setPlaylistSyncError] = useState<string | null>(null)
  const [isStarting, setIsStarting] = useState(false)
  const [currentJobStatus, setCurrentJobStatus] = useState<
    'idle' | 'running' | 'completed' | 'failed'
  >('idle')
  const [currentJobProgress, setCurrentJobProgress] = useState<{
    completed: number
    total: number
    message?: string
  } | null>(null)
  const pollRef = useRef<number | null>(null)

  const allPlaylists = [...SPOTIFY_FAVORITE_PLAYLISTS, ...SPOTIFY_SPECIAL_PLAYLISTS]

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

  useEffect(() => {
    if (!jobId) return

    const poll = async () => {
      try {
        const data = await getLibrarySyncStatus(jobId)
        setCurrentJobProgress(data.progress || null)

        if (data.status === 'completed') {
          setCurrentJobStatus('completed')
          if (pollRef.current) window.clearInterval(pollRef.current)
        } else if (data.status === 'failed') {
          setCurrentJobStatus('failed')
          if (pollRef.current) window.clearInterval(pollRef.current)
        } else {
          setCurrentJobStatus('running')
        }
      } catch (err) {
        console.error('Error polling job status:', err)
      }
    }

    poll()
    pollRef.current = window.setInterval(poll, 2000)

    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current)
    }
  }, [jobId])

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

  const handleStartSync = async () => {
    try {
      setIsStarting(true)
      setPlaylistSyncError(null)

      const playlists = allPlaylists.map((p) => ({ id: p.id, name: p.name }))
      const { jobId } = await startLibrarySync(playlists)

      setJobId(jobId)
    } catch (err) {
      setPlaylistSyncError('Falha ao iniciar sincronização da library.')
    } finally {
      setIsStarting(false)
    }
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
      <div className="flex items-center mb-6">
        <Text variant="h4" className="grow">
          Job History ({jobs.length})
        </Text>
        <button
          onClick={handleStartSync}
          disabled={isStarting}
          className="bg-primary py-1 px-4 rounded-sm"
        >
          <Text>{isStarting ? 'Starting...' : 'New job'}</Text>
        </button>
      </div>

      {playlistSyncError && <div className="text-red-500 mb-2">{playlistSyncError}</div>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="leading-none">
              View or
              <br />
              Delete
            </TableHead>
            <TableHead className="border-l-2 leading-none">
              Saved
              <br />
              to IndexDB
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobId && (
            <TableRow className="bg-blue-500">
              <TableCell className="font-mono text-sm">{jobId?.slice(0, 14) || 'n/a'}...</TableCell>
              <TableCell className="flex items-center">
                <span
                  className={`text-lg inline-block ml-[15%] ${
                    currentJobStatus === 'completed'
                      ? 'text-green-600'
                      : currentJobStatus === 'failed'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                  }`}
                >
                  {currentJobStatus === 'completed' ? (
                    <FaCheckCircle />
                  ) : currentJobStatus === 'failed' ? (
                    <IoCloseSharp />
                  ) : (
                    <IoWarningOutline />
                  )}
                </span>
              </TableCell>
              <TableCell className="font-mono">
                {currentJobProgress
                  ? `${currentJobProgress.completed || 0}/${currentJobProgress.total || 0}`
                  : 'starting...'}
              </TableCell>
              <TableCell>
                <span className="text-sm">today</span>
              </TableCell>
              <TableCell></TableCell>
              <TableCell className="border-l-2"></TableCell>
            </TableRow>
          )}
          {jobs.length === 0 && !jobId ? (
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
                      const formatted = formatJobDateCompact(job.createdAt)
                      if (!formatted) return 'n/a'
                      const [date, daysAgo] = formatted.split(' ')
                      return (
                        <div className="flex gap-x-2">
                          <Text>{date}</Text> <Text color="muted">{daysAgo}</Text>
                        </div>
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
