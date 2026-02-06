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
