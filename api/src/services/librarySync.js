/**
Cria um job com estado inicial.
Faz throttling/concurrency.
Faz chamadas à Spotify API para cada playlist/faixas.
Atualiza progresso e status.
No fim, guarda o resultado e marca como concluído.
 */

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
  concurrency: 2,
  delayMs: 150,
  tracksPageLimit: 100,
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function fetchPlaylistDetails(playlistId, accessToken) {
  const { data } = await axios.get(`${SPOTIFY_API_BASE}/playlists/${playlistId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return data
}

async function fetchAllPlaylistTracks(playlistId, accessToken, limit = 100) {
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

  return all
}

async function runSyncJob(jobId, playlists, accessToken, options = {}) {
  const { concurrency, delayMs, tracksPageLimit } = { ...DEFAULTS, ...options }

  updateJob(jobId, { status: 'running', updatedAt: Date.now() })

  const results = []
  const errors = []

  for (let i = 0; i < playlists.length; i += concurrency) {
    const batch = playlists.slice(i, i + concurrency)

    const batchResults = await Promise.all(
      batch.map(async (playlist) => {
        try {
          const details = await fetchPlaylistDetails(playlist.id, accessToken)
          const tracks = await fetchAllPlaylistTracks(playlist.id, accessToken, tracksPageLimit)

          return {
            id: playlist.id,
            name: playlist.name,
            details,
            tracks,
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
