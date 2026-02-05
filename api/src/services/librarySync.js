/**
Cria um job com estado inicial.
Faz throttling/concurrency.
Faz chamadas à Spotify API para cada playlist/faixas.
Atualiza progresso e status.
No fim, guarda o resultado e marca como concluído.
 */
const { normalizePlaylist } = require('./librarySyncPreferences')

const axios = require('axios')
const { v4: uuidv4 } = require('uuid')

const { SPOTIFY_API_BASE } = require('../utils/constants-api')
const {
  initStore,
  createJob,
  updateJob,
  getJob,
  saveResult,
  getResult,
} = require('../storage/libraryStore')

const DEFAULTS = {
  concurrency: 1,
  delayMs: 500,
  tracksPageLimit: 100,
  maxTracksPerPlaylist: null, // dev only (0 ou null = sem limite)
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function fetchPlaylistDetails(playlistId, accessToken) {
  const { data } = await axios.get(`${SPOTIFY_API_BASE}/playlists/${playlistId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return data
}

async function fetchAllPlaylistTracks(
  playlistId,
  accessToken,
  limit = 100,
  maxTracksPerPlaylist = 0
) {
  let all = []
  let offset = 0

  console.log(`[FetchTracks] Starting fetch for playlist ${playlistId}, maxTracksPerPlaylist=${maxTracksPerPlaylist}`)

  while (true) {
    const { data } = await axios.get(`${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { limit, offset },
    })

    console.log(`[FetchTracks] Got ${data.items.length} items, offset=${offset}, hasNext=${!!data.next}`)
    all.push(...data.items)
    if (!data.next) break
    offset += limit
  }

  console.log(`[FetchTracks] Total collected: ${all.length} tracks before limit check`)

  // Use in dev only.
  if (maxTracksPerPlaylist && maxTracksPerPlaylist > 0) {
    console.log(`[FetchTracks] Limiting to ${maxTracksPerPlaylist} tracks`)
    return all.slice(0, maxTracksPerPlaylist)
  }

  return all
}

async function fetchPlaylistsMetadata(playlistIds, accessToken) {
  const metadata = []
  
  for (const id of playlistIds) {
    try {
      const { data } = await axios.get(`${SPOTIFY_API_BASE}/playlists/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      
      // total_tracks pode estar em diferentes formatos
      const totalTracks = data.tracks?.total || data.total_tracks || 0
      
      metadata.push({
        id: data.id,
        name: data.name,
        total_tracks: totalTracks,
      })
      
      console.log(`[Metadata] ${data.name}: ${totalTracks} tracks`)
    } catch (error) {
      console.error(`[Metadata Error] Playlist ${id}:`, error.message)
      // Skip on error
    }
  }
  
  console.log(`[Metadata Complete] Total playlists with metadata: ${metadata.length}`)
  return metadata
}

async function runSyncJob(jobId, playlists, accessToken, options = {}) {
  const { concurrency, delayMs, tracksPageLimit, maxTracksPerPlaylist } = {
    ...DEFAULTS,
    ...options,
  }

  updateJob(jobId, { status: 'running', updatedAt: Date.now() })

  // Pre-fetch metadata to calculate total tracks
  console.log(`Fetching metadata for ${playlists.length} playlists...`)
  const playlistsMetadata = await fetchPlaylistsMetadata(
    playlists.map((p) => p.id),
    accessToken
  )

  const totalTracks = playlistsMetadata.reduce((sum, p) => sum + (p.total_tracks || 0), 0)
  console.log(
    `Total tracks to fetch: ${totalTracks} across ${playlistsMetadata.length} playlists`
  )

  // Fallback: se totalTracks é 0, usa número de playlists como medida
  const displayTotal = totalTracks > 0 ? totalTracks : playlists.length
  
  updateJob(jobId, {
    progress: {
      completed: 0,
      total: displayTotal,
      message: `Fetching ${displayTotal} ${totalTracks > 0 ? 'tracks' : 'playlists'}...`,
    },
    updatedAt: Date.now(),
  })

  const results = []
  const errors = []
  let tracksProcessed = 0

  for (let i = 0; i < playlists.length; i += concurrency) {
    const batch = playlists.slice(i, i + concurrency)

    const batchResults = await Promise.all(
      batch.map(async (playlist) => {
        try {
          const details = await fetchPlaylistDetails(playlist.id, accessToken)
          const tracks = await fetchAllPlaylistTracks(
            playlist.id,
            accessToken,
            tracksPageLimit,
            maxTracksPerPlaylist
          )
          const normalized = normalizePlaylist(details, tracks)

          // Update track count
          tracksProcessed += tracks.length
          console.log(`[Fetch] ${details.name}: fetched ${tracks.length} tracks`)
          
          const percentage = displayTotal > 0 ? Math.round((tracksProcessed / displayTotal) * 100) : 0
          updateJob(jobId, {
            progress: {
              completed: tracksProcessed,
              total: displayTotal,
              message: `${tracksProcessed}/${displayTotal} tracks (${percentage}%)`,
            },
            updatedAt: Date.now(),
          })

          return {
            id: playlist.id,
            name: playlist.name,
            ...normalized,
          }
        } catch (error) {
          errors.push({
            id: playlist.id,
            error: error.response?.data || error.message,
          })
          return null
        }
      })
    )

    results.push(...batchResults.filter(Boolean))

    if (i + concurrency < playlists.length) {
      await delay(delayMs)
    }
  }

  const resultPath = saveResult(jobId, { playlists: results, errors })

  updateJob(jobId, {
    status: 'completed',
    resultPath,
    updatedAt: Date.now(),
  })

  return { resultPath }
}

function createLibraryJob({ playlists, accessToken, options }) {
  initStore()

  const job = createJob({
    id: uuidv4(),
    status: 'queued',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    progress: { completed: 0, total: playlists.length },
  })

  // run in background
  runSyncJob(job.id, playlists, accessToken, options).catch((error) => {
    updateJob(job.id, {
      status: 'failed',
      error: error.response?.data || error.message,
      updatedAt: Date.now(),
    })
  })

  return job
}

function getLibraryJobStatus(jobId) {
  return getJob(jobId)
}

function getLibraryJobResult(jobId) {
  return getResult(jobId)
}

module.exports = {
  createLibraryJob,
  getLibraryJobStatus,
  getLibraryJobResult,
}
