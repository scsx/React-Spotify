import { useEffect, useRef, useState } from 'react'

import { getLibrarySyncStatus } from '@/services/library/getLibrarySyncStatus'
import { startLibrarySync } from '@/services/library/startLibrarySync'

import { SPOTIFY_FAVORITE_PLAYLISTS, SPOTIFY_SPECIAL_PLAYLISTS } from '@/lib/constants'

export function useLibraryJobSync() {
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

  return {
    jobId,
    currentJobStatus,
    currentJobProgress,
    playlistSyncError,
    isStarting,
    handleStartSync,
  }
}
