import { useEffect, useState } from 'react'

import { getLibrarySyncResult } from '@/services/library/getLibrarySyncResult'

import { db } from '@/lib/index-db'

export function useLibraryJobStorage() {
  const [savedJobs, setSavedJobs] = useState<Record<string, number>>({})

  useEffect(() => {
    const loadSavedJobs = async () => {
      const saved = await db.libraryJobs.toArray()
      const savedMap = saved.reduce(
        (acc, item) => {
          acc[item.jobId] = item.savedAt
          return acc
        },
        {} as Record<string, number>
      )
      setSavedJobs(savedMap)
    }
    loadSavedJobs()
  }, [])

  const handleSaveToIndexDB = async (jobId: string) => {
    try {
      const result = await getLibrarySyncResult(jobId)

      // Apaga todos os jobs anteriores
      await db.libraryJobs.clear()

      // Guarda só o novo
      await db.libraryJobs.put({
        jobId,
        data: result,
        savedAt: Date.now(),
      })

      // Atualiza o estado para mostrar só este
      setSavedJobs({ [jobId]: Date.now() })
    } catch (e) {
      console.error('Error saving to IndexDB:', e)
    }
  }

  return {
    savedJobs,
    handleSaveToIndexDB,
  }
}
