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

  while (true) {
    const { data } = await axios.get(`${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { limit, offset },
    })

    all.push(...data.items)
    if (!data.next) break
    offset += limit
  }

  // Use in dev only.
  if (maxTracksPerPlaylist && maxTracksPerPlaylist > 0) {
    return all.slice(0, maxTracksPerPlaylist)
  }

  return all
}

async function runSyncJob(jobId, playlists, accessToken, options = {}) {
  const { concurrency, delayMs, tracksPageLimit, maxTracksPerPlaylist } = {
    ...DEFAULTS,
    ...options,
  }

  updateJob(jobId, { status: 'running', updatedAt: Date.now() })

  const results = []
  const errors = []

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

    updateJob(jobId, {
      progress: {
        completed: Math.min(i + batch.length, playlists.length),
        total: playlists.length,
      },
      updatedAt: Date.now(),
    })

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
