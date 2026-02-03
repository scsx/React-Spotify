/*
POST /api/spotify/library/sync → cria job
GET /api/spotify/library/sync/:jobId → estado
GET /api/spotify/library/sync/:jobId/result → dados finais
*/
const express = require('express')
const router = express.Router()
const { getAccessTokenFromSession } = require('../../utils/sessionHelpers')
const {
  createLibraryJob,
  getLibraryJobStatus,
  getLibraryJobResult,
} = require('../../utils/librarySync') 

// Middleware de token
router.use((req, res, next) => {
  const accessToken = getAccessTokenFromSession(req)
  if (!accessToken) {
    return res.status(401).json({ error: 'No Spotify access token provided.' })
  }
  req.spotifyAccessToken = accessToken
  next()
})

/**
 * POST /api/spotify/library/sync
 * Body: { playlists: [{ id, name }, ...] }
 */
router.post('/sync', async (req, res) => {
  const { playlists } = req.body

  if (!Array.isArray(playlists) || playlists.length === 0) {
    return res.status(400).json({ error: 'Array de playlists é obrigatório.' })
  }

  try {
    const job = await createLibraryJob({
      playlists,
      accessToken: req.spotifyAccessToken,
    })
    return res.status(202).json({ jobId: job.id })
  } catch (error) {
    return res.status(500).json({ error: 'Falha ao criar job.', details: error.message })
  }
})

/**
 * GET /api/spotify/library/sync/:jobId
 */
router.get('/sync/:jobId', async (req, res) => {
  try {
    const job = await getLibraryJobStatus(req.params.jobId)
    if (!job) return res.status(404).json({ error: 'Job não encontrado.' })
    return res.json(job)
  } catch (error) {
    return res.status(500).json({ error: 'Falha ao obter status.', details: error.message })
  }
})

/**
 * GET /api/spotify/library/sync/:jobId/result
 */
router.get('/sync/:jobId/result', async (req, res) => {
  try {
    const result = await getLibraryJobResult(req.params.jobId)
    if (!result) return res.status(404).json({ error: 'Resultado não encontrado.' })
    return res.json(result)
  } catch (error) {
    return res.status(500).json({ error: 'Falha ao obter resultado.', details: error.message })
  }
})

module.exports = router
