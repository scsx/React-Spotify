/**
Rotas que listam e filtram playlists (envolvem /me/playlists):
*/
const { SPOTIFY_API_BASE } = require('../../utils/constants')
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

async function getAllUserPlaylists(accessToken) {
  const all = []
  let offset = 0
  const limit = 50

  while (true) {
    const { data } = await axios.get(`${SPOTIFY_API_BASE}/me/playlists`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { limit, offset },
    })

    all.push(...data.items)
    if (!data.next) break
    offset += limit
  }

  return all
}

// GET /api/spotify/playlists
router.get('/', async (req, res) => {
  try {
    const { data } = await axios.get(`${SPOTIFY_API_BASE}/me/playlists`, {
      headers: { Authorization: `Bearer ${req.spotifyAccessToken}` },
      params: {
        limit: req.query.limit || 40,
        offset: req.query.offset || 0,
      },
    })
    res.json(data)
  } catch (e) {
    res.status(e.response?.status || 500).json(e.response?.data || e.message)
  }
})

// GET /api/spotify/playlists/favorites
router.get('/favorites', async (req, res) => {
  const playlists = await getAllUserPlaylists(req.spotifyAccessToken)

  const matches = playlists.filter((p) => p.name.toLowerCase().includes('favorite'))

  const full = await Promise.all(
    matches.map((p) => fetchFullPlaylistDetails(p.id, req.spotifyAccessToken).catch(() => null))
  )

  res.json({ items: full.filter(Boolean), total: full.length })
})

// GET /api/spotify/playlists/your-top-songs
// GET /api/spotify/playlists/by-year
router.get('/:filterType(your-top-songs|by-year)', async (req, res) => {
  const term = req.query.term
  if (!term) return res.status(400).json({ error: 'term is required' })

  const playlists = await getAllUserPlaylists(req.spotifyAccessToken)

  const matches = playlists.filter((p) => p.name.toLowerCase().includes(term.toLowerCase()))

  const full = await Promise.all(
    matches.map((p) => fetchFullPlaylistDetails(p.id, req.spotifyAccessToken).catch(() => null))
  )

  res.json({ items: full.filter(Boolean), total: full.length })
})

// POST /api/spotify/playlists/by-names
router.post('/by-names', async (req, res) => {
  const names = req.body.names
  if (!Array.isArray(names) || !names.length) {
    return res.status(400).json({ error: 'Array of playlist names is required' })
  }

  const playlists = await getAllUserPlaylists(req.spotifyAccessToken)

  const found = []
  const notFound = []

  for (const name of names) {
    const match = playlists.find((p) => p.name.toLowerCase().includes(name.toLowerCase()))

    if (!match) {
      notFound.push(name)
      continue
    }

    try {
      found.push(await fetchFullPlaylistDetails(match.id, req.spotifyAccessToken))
    } catch {
      notFound.push(name)
    }
  }

  res.json({ found, notFound })
})

module.exports = router
