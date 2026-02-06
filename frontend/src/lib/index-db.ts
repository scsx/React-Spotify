import { TLibraryJobRecord } from '@/types/Library'
import Dexie, { Table } from 'dexie'

export class AppDatabase extends Dexie {
  libraryJobs!: Table<TLibraryJobRecord>

  constructor() {
    super('react-spotify')
    this.version(1).stores({
      libraryJobs: 'jobId, savedAt',
    })
  }
}

export const db = new AppDatabase()
