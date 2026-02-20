import { TLibraryJobRecord, TTLibraryTopGenres } from '@/types/Library'
import Dexie, { Table } from 'dexie'

export class AppDatabase extends Dexie {
  libraryJobs!: Table<TLibraryJobRecord>
  topGenres!: Table<TTLibraryTopGenres>

  constructor() {
    super('react-spotify')
    this.version(2).stores({
      libraryJobs: 'jobId, savedAt',
      topGenres: 'id',
    })
  }
}

export const db = new AppDatabase()
