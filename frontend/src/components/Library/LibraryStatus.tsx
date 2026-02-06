import { useEffect, useRef, useState } from 'react'

import LibraryPLViewer from '@/components/Library/LibraryPLViewer'

import { TLibrarySyncResult, getLibrarySyncResult } from '@/services/library/getLibrarySyncResult'
import { getLibrarySyncStatus } from '@/services/library/getLibrarySyncStatus'

type TLibraryStatusProps = {
  jobId: string | null
}

const LibraryStatus = ({ jobId }: TLibraryStatusProps) => {
  const [status, setStatus] = useState<'idle' | 'running' | 'completed' | 'failed'>('idle')
  const [progress, setProgress] = useState<{
    completed: number
    total: number
    message?: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [jobResult, setJobResult] = useState<TLibrarySyncResult | null>(null)
  const pollRef = useRef<number | null>(null)

  useEffect(() => {
    if (!jobId) return

    const poll = async () => {
      try {
        const data = await getLibrarySyncStatus(jobId)
        setProgress(data.progress || null)

        if (data.status === 'completed') {
          setStatus('completed')
          if (pollRef.current) window.clearInterval(pollRef.current)

          const result = await getLibrarySyncResult(jobId)

          setJobResult(result)
          console.log('result', result)
        } else if (data.status === 'failed') {
          setStatus('failed')
          setError(data.error || 'Job falhou.')
          if (pollRef.current) window.clearInterval(pollRef.current)
        } else {
          setStatus('running')
        }
      } catch (err) {
        setError('Erro a obter status do job.')
      }
    }

    poll()
    pollRef.current = window.setInterval(poll, 2000)

    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current)
    }
  }, [jobId])

  if (error && !jobResult) return <div>{error}</div>

  if (!jobId && !jobResult) return null

  return (
    <div>
      <div>Status: {status}</div>
      {progress && (
        <div className="p-4">
          {progress.message ? (
            <div className="text-sm text-gray-900">{progress.message}</div>
          ) : (
            <div>
              Progresso: {progress.completed}/{progress.total}
            </div>
          )}
        </div>
      )}

      {jobResult && (
        <div className="mt-4">
          <div className="mb-2 font-semibold">Resultado disponível</div>

          <div className="mb-2">
            <button
              onClick={() => console.log('Library result:', jobResult)}
              className="bg-slate-700 text-white px-3 py-1 rounded mr-2"
            >
              Ver JSON na consola
            </button>
          </div>

          <LibraryPLViewer playlists={jobResult.playlists} />
        </div>
      )}
    </div>
  )
}

export default LibraryStatus
