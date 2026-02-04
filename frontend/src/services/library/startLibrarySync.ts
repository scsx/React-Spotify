import axios from 'axios'

type TPlaylistInput = {
  id: string
  name: string
}

type StartLibrarySyncResponse = {
  jobId: string
}

export async function startLibrarySync(
  playlists: TPlaylistInput[]
): Promise<StartLibrarySyncResponse> {
  const response = await axios.post<StartLibrarySyncResponse>('/api/spotify/library/sync', {
    playlists,
  })

  return response.data
}
