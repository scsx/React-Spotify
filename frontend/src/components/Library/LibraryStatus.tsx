import { useEffect, useRef, useState } from 'react'

import { getLibrarySyncResult } from '@/services/library/getLibrarySyncResult'
import { getLibrarySyncStatus } from '@/services/library/getLibrarySyncStatus'

type TLibraryStatusProps = {
  jobId: string | null
}

const LibraryStatus = ({ jobId }: TLibraryStatusProps) => {
  const [status, setStatus] = useState<'idle' | 'running' | 'completed' | 'failed'>('idle')
  const [progress, setProgress] = useState<{ completed: number; total: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
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
          // TODO: guardar no IndexedDB
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

  if (!jobId) return <div>Nenhum sync iniciado.</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <div>Status: {status}</div>
      {progress && (
        <div>
          Progresso: {progress.completed}/{progress.total}
        </div>
      )}
    </div>
  )
}

export default LibraryStatus
