import { useEffect, useRef, useState } from 'react'

import Loading from '@/components/shared/Loading'
import Text from '@/components/shared/Text'

import { deleteLibraryJob } from '@/services/library/deleteLibraryJob'
import { TLibraryJob, getLibraryJobs } from '@/services/library/getLibraryJobs'
import { TLibrarySyncResult, getLibrarySyncResult } from '@/services/library/getLibrarySyncResult'
import { getLibrarySyncStatus } from '@/services/library/getLibrarySyncStatus'
import { startLibrarySync } from '@/services/library/startLibrarySync'

import { SPOTIFY_FAVORITE_PLAYLISTS, SPOTIFY_SPECIAL_PLAYLISTS } from '@/lib/constants'

import LibraryJobsTable from './LibraryJobsTable'
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

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Delete job for sure?')) return

    try {
      await deleteLibraryJob(jobId)
      setJobs((prev) => prev.filter((job) => job.id !== jobId))
    } catch (e) {
      console.error('Error deleting job:', e)
      alert('Failed to delete job.')
    }
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
        <Loading type="table" gridSize="1x4" />
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
          className="bg-primary py-1 px-4 rounded-sm hover:bg-blue-500"
        >
          <Text className="text-white">{isStarting ? 'Starting...' : 'New job'}</Text>
        </button>
      </div>

      {playlistSyncError && <div className="text-red-500 mb-2">{playlistSyncError}</div>}

      <LibraryJobsTable
        jobs={jobs}
        jobId={jobId}
        currentJobStatus={currentJobStatus}
        currentJobProgress={currentJobProgress}
        loading={loading}
        savedJobs={savedJobs}
        onPreview={handlePreview}
        onDelete={handleDeleteJob}
        onSaveToIndexDB={handleSaveToIndexDB}
      />
    </div>
  )
}
