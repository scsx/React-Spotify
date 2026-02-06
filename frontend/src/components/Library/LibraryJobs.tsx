import { useEffect, useState } from 'react'

import { useLibraryJobStorage } from '@/hooks/useLibraryJobStorage'
import { useLibraryJobSync } from '@/hooks/useLibraryJobSync'
import { TLibrarySyncResult } from '@/types/Library'

import Loading from '@/components/shared/Loading'
import Text from '@/components/shared/Text'

import { deleteLibraryJob } from '@/services/library/deleteLibraryJob'
import { TLibraryJob, getLibraryJobs } from '@/services/library/getLibraryJobs'
import { getLibrarySyncResult } from '@/services/library/getLibrarySyncResult'

import LibraryJobsTable from './LibraryJobsTable'
import LibraryPLViewer from './LibraryPLViewer'

export default function LibraryJobs() {
  const [jobs, setJobs] = useState<TLibraryJob[]>([])
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [selectedResult, setSelectedResult] = useState<TLibrarySyncResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [isLoadingJobs, setIsLoadingJobs] = useState(true)

  const { savedJobs, handleSaveToIndexDB } = useLibraryJobStorage()
  const {
    jobId,
    currentJobStatus,
    currentJobProgress,
    playlistSyncError,
    isStarting,
    handleStartSync,
  } = useLibraryJobSync()

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

  if (selectedJobId) {
    return (
      <div>
        <button onClick={() => setSelectedJobId(null)} className="mb-2 px-2 py-1">
          ← Back
        </button>
        {selectedResult && <LibraryPLViewer playlists={selectedResult.playlists} />}
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
