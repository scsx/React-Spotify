import { useState } from 'react'

import LibraryJobs from '@/components/Library/LibraryJobs'
import LibrarySidebar from '@/components/Library/LibrarySidebar'
import LibraryStatus from '@/components/Library/LibraryStatus'
import Text from '@/components/shared/Text'

// import { Checkbox } from '@/components/ui/checkbox'

import { startLibrarySync } from '@/services/library/startLibrarySync'

import { SPOTIFY_FAVORITE_PLAYLISTS } from '@/lib/constants'
import { SPOTIFY_SPECIAL_PLAYLISTS } from '@/lib/constants'

const LibraryLayout = () => {
  const allPlaylists = [...SPOTIFY_FAVORITE_PLAYLISTS, ...SPOTIFY_SPECIAL_PLAYLISTS]
  const [jobId, setJobId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isStarting, setIsStarting] = useState(false)

  const handleStartSync = async () => {
    try {
      setIsStarting(true)
      setError(null)

      const playlists = allPlaylists.map((p) => ({ id: p.id, name: p.name }))
      const { jobId } = await startLibrarySync(playlists)

      setJobId(jobId)
    } catch (err) {
      setError('Falha ao iniciar sincronização da library.')
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <div className="flex gap-x-16 mt-16">
      <div className="w-3/4">
        <Text variant="h2" className="mb-8">
          Favorite and Special playlists
        </Text>

        <LibraryJobs />

        <button onClick={handleStartSync} disabled={isStarting} className="bg-red-500 p-2 my-2">
          {isStarting ? 'A iniciar...' : 'START'}
        </button>
        <div>
          {error && <div>{error}</div>}
          {jobId ? (
            <div className="bg-primary my-4">Sync iniciado: {jobId}</div>
          ) : (
            <div className="bg-orange-500 my-4">Iniciando sync…</div>
          )}
          <div className="my-4 bg-blue-400">
            <LibraryStatus jobId={jobId} />
          </div>
        </div>
      </div>

      <div className="w-1/4">
        <LibrarySidebar allPlaylists={allPlaylists} />
      </div>
    </div>
  )
}

export default LibraryLayout
