export type TLibraryPlaylist = {
  id: string
  name: string
  description?: string | null
  images?: { url: string }[]
  owner?: { display_name?: string }
  tracks?: Array<{
    id: string
    name: string
    uri?: string
    duration_ms?: number
    artists?: { id: string; name: string }[]
    album?: { id: string; name?: string; images?: { url: string }[] }
  }>
}

export type TLibrarySyncResult = {
  meta?: {
    syncedAt?: string
    playlistCount?: number
    totalTracks?: number
  }
  playlists: TLibraryPlaylist[]
  errors: Array<{ id: string; error: string }>
}

export type TLibraryJobRecord = {
  jobId: string
  data: TLibrarySyncResult
  savedAt: number
}

export type TLibraryJob = {
  id: string
  status: 'queued' | 'running' | 'completed' | 'failed'
  progress: { completed: number; total: number }
  createdAt: number
  updatedAt: number
  resultPath?: string
  error?: string
}

// Exceptionally props here to reduce file size.I
export type TLibraryJobsTableProps = {
  jobs: TLibraryJob[]
  jobId: string | null
  currentJobStatus: 'idle' | 'running' | 'completed' | 'failed'
  currentJobProgress: { completed: number; total: number; message?: string } | null
  loading: boolean
  savedJobs: Record<string, number>
  onPreview: (jobId: string) => void
  onDelete: (jobId: string) => void
  onSaveToIndexDB: (jobId: string) => void
  onDownloadJob: (jobId: string) => void
}

export type TTLibraryTopGenres = {
  id: string
  genres: { genre: string; count: number }[]
  updatedAt: number
}
