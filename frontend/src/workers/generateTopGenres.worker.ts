import { TTLibraryTopGenres } from '@/types/Library'
import Dexie from 'dexie'

import { getLocalSkileyTracks } from '@/services/skiley/getLocalSkileyTracks'
import { getTopGenres } from '@/services/skiley/getTopGenres'

// Initialize IndexedDB connection in worker
class WorkerDatabase extends Dexie {
  topGenres!: Dexie.Table<TTLibraryTopGenres>

  constructor() {
    super('react-spotify')
    this.version(2).stores({
      topGenres: 'id',
    })
  }
}

const db = new WorkerDatabase()

self.onmessage = async () => {
  try {
    console.log('[Worker] Starting top genres calculation...')

    // 1. Get Skiley liked songs
    const skileyData = await getLocalSkileyTracks()
    console.log(`[Worker] Loaded ${skileyData.length} Skiley songs`)

    // 2. Call getTopGenres() function
    const topGenres = await getTopGenres(skileyData, 30)
    console.log('[Worker] Top genres calculated:', topGenres)

    // 3. Save to topGenres table in IndexedDB
    const result: TTLibraryTopGenres = {
      id: 'latest',
      genres: topGenres,
      updatedAt: Date.now(),
    }

    await db.topGenres.put(result)
    console.log('[Worker] Saved to IndexedDB')

    // 4. Send result back to main thread
    self.postMessage({
      success: true,
      data: topGenres,
      message: 'Top genres calculated successfully',
    })
  } catch (error) {
    console.error('[Worker] Error:', error)
    self.postMessage({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
