import { useEffect, useRef, useState } from 'react'

import TemporaryPLViewer from '@/components/Library/TemporaryPLViewer'

import { getLibrarySyncResult } from '@/services/library/getLibrarySyncResult'
import { getLibrarySyncStatus } from '@/services/library/getLibrarySyncStatus'

type TLibraryStatusProps = {
  jobId: string | null
}

const LibraryStatus = ({ jobId }: TLibraryStatusProps) => {
  const [status, setStatus] = useState<'idle' | 'running' | 'completed' | 'failed'>('idle')
  const [progress, setProgress] = useState<{ completed: number; total: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  // TODO: any
  const [jobResult, setJobResult] = useState<any>(null)
  const pollRef = useRef<number | null>(null)
  // TODO: temp
  const [manualJobId, setManualJobId] = useState('')
  const [loadingManual, setLoadingManual] = useState(false)

  const fetchManualResult = async (id?: string) => {
    const jid = id ?? manualJobId
    if (!jid) {
      setError('jobId obrigatório.')
      return
    }
    try {
      setLoadingManual(true)
      setError(null)
      console.log('Fetching result for jobId:', jid)
      const result = await getLibrarySyncResult(jid)
      console.log('Result received:', result)
      setJobResult(result)
      setStatus('completed')
    } catch (e) {
      console.error('Erro ao fetch result:', e)
      setError(`Erro a obter resultado: ${e instanceof Error ? e.message : 'desconhecido'}`)
    } finally {
      setLoadingManual(false)
    }
  }

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

          // TODO: guardar no IndexedDB
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

  // Se não há jobId nem resultado, mostra input manual
  if (!jobId && !jobResult) {
    return (
      <div className="mt-2 flex items-center gap-2">
        <input
          value={manualJobId}
          onChange={(e) => setManualJobId(e.target.value)}
          placeholder="Insere jobId"
          className="border px-2 py-1 rounded text-gray-500 grow"
        />
        <button
          onClick={() => fetchManualResult()}
          disabled={loadingManual}
          className="bg-slate-700 text-white px-3 py-1 rounded"
        >
          {loadingManual ? 'A carregar...' : 'Carregar jobId'}
        </button>
      </div>
    )
  }

  return (
    <div>
      <div>Status: {status}</div>
      {progress && (
        <div>
          Progresso: {progress.completed}/{progress.total}
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

          <TemporaryPLViewer playlists={jobResult.playlists} />
        </div>
      )}
    </div>
  )
}

export default LibraryStatus
