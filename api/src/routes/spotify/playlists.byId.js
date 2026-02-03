/**
Rotas que usam ID direto:
 */

const { SPOTIFY_API_BASE } = require('../../utils/constants-api')
const express = require('express')
const router = express.Router()
const axios = require('axios')
const { requireSpotifyAccessToken } = require('../../utils/spotifyAuthMiddleware')

router.use(requireSpotifyAccessToken)

async function fetchFullPlaylistDetails(playlistId, accessToken) {
  const response = await axios.get(`${SPOTIFY_API_BASE}/playlists/${playlistId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return response.data
}

// GET /api/spotify/playlists/:playlistId
router.get('/:playlistId', async (req, res) => {
  try {
    const data = await fetchFullPlaylistDetails(req.params.playlistId, req.spotifyAccessToken)
    res.json(data)
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || error.message)
  }
})

// POST /api/spotify/playlists/by-ids
router.post('/by-ids', async (req, res) => {
  const ids = req.body.ids
  if (!Array.isArray(ids) || !ids.length) {
    return res.status(400).json({ error: 'Array de ids é obrigatório.' })
  }

  const results = []
  const errors = []

  const CONCURRENCY = 3
  const DELAY_MS = 200
  const delay = (ms) => new Promise((r) => setTimeout(r, ms))

  for (let i = 0; i < ids.length; i += CONCURRENCY) {
    const batch = ids.slice(i, i + CONCURRENCY)

    const batchResults = await Promise.all(
      batch.map(async (id) => {
        try {
          return await fetchFullPlaylistDetails(id, req.spotifyAccessToken)
        } catch (e) {
          errors.push({ id, error: e.response?.data || e.message })
          return null
        }
      })
    )

    results.push(...batchResults.filter(Boolean))

    if (i + CONCURRENCY < ids.length) await delay(DELAY_MS)
  }

  res.json({ items: results, total: results.length, errors })
})

module.exports = router
