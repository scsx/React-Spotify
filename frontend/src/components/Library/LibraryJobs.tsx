import { useEffect, useState } from 'react'

import { useLibraryJobStorage } from '@/hooks/useLibraryJobStorage'
import { useLibraryJobSync } from '@/hooks/useLibraryJobSync'
import { TLibrarySyncResult } from '@/types/Library'
import { TLibraryJob } from '@/types/Library'
import { IoCloudDownloadOutline } from 'react-icons/io5'

import Loading from '@/components/shared/Loading'
import Text from '@/components/shared/Text'

import { deleteLibraryJob } from '@/services/library/deleteLibraryJob'
import { getLibraryJobs } from '@/services/library/getLibraryJobs'
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

  const handleDownloadJob = async (jobId: string) => {
    try {
      const result = await getLibrarySyncResult(jobId)
      const job = jobs.find((j) => j.id === jobId)
      if (!job || !result) return

      // Format date as yyyy-mm-dd
      const date = new Date(job.createdAt)
      const formattedDate = date.toISOString().split('T')[0]

      // Combine job metadata with full result data
      const fullData = {
        jobMetadata: job,
        syncResult: result,
      }

      const jsonString = JSON.stringify(fullData, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${formattedDate}-favorite-playlists.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Error downloading job:', e)
      alert('Failed to download job data.')
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
          className="bg-primary py-1 pl-4 pr-5 rounded hover:bg-blue-500"
        >
          <Text className="text-white">
            {isStarting ? (
              'Starting...'
            ) : (
              <span className="flex items-center gap-x-2">
                <IoCloudDownloadOutline /> New job
              </span>
            )}
          </Text>
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
        onDownloadJob={handleDownloadJob}
      />
    </div>
  )
}
