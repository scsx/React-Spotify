const express = require('express')
const router = express.Router()
const { getAllJobs } = require('../../storage/libraryStore')
const {
  createLibraryJob,
  getLibraryJobStatus,
  getLibraryJobResult,
} = require('../../services/librarySync')

const { requireSpotifyAccessToken } = require('../../utils/spotifyAuthMiddleware')

// Middleware para garantir que o token de acesso do Spotify está presente
router.use(requireSpotifyAccessToken)

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
    console.error('library sync error:', error)
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
    console.error('library sync error:', error)
    return res.status(500).json({ error: 'Falha ao obter resultado.', details: error.message })
  }
})

/**
 * GET /api/spotify/library/jobs
 * Retorna lista de todos os jobs criados
 */
router.get('/jobs', (req, res) => {
  try {
    const allJobs = getAllJobs()
    return res.json(allJobs)
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return res.status(500).json({ error: 'Falha ao obter jobs.', details: error.message })
  }
})

module.exports = router
