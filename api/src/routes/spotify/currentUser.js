const { SPOTIFY_API_BASE } = require('../../utils/constants-api')

const express = require('express')
const axios = require('axios')
const router = express.Router()
const { requireSpotifyAccessToken } = require('../../utils/spotifyAuthMiddleware')

// Middleware para garantir que o token de acesso do Spotify está presente
router.use(requireSpotifyAccessToken)

/**
 * GET /api/spotify/me
 */
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${SPOTIFY_API_BASE}/me`, {
      headers: {
        Authorization: `Bearer ${req.spotifyAccessToken}`,
      },
    })

    res.status(200).json({
      message: 'Spotify user data successfully retrieved.',
      user: response.data,
    })
  } catch (error) {
    console.error('Spotify /me error:', error.response?.data || error.message)

    res.status(error.response?.status || 500).json({
      message: 'Spotify API error',
      details: error.response?.data || error.message,
    })
  }
})

/**
 * GET /api/spotify/me/following
 */
router.get('/following', async (req, res) => {
  const limit = 50
  let after = null
  let allArtists = []
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  try {
    let totalArtists = 0

    do {
      const response = await axios.get('https://api.spotify.com/v1/me/following', {
        headers: {
          Authorization: `Bearer ${req.spotifyAccessToken}`,
        },
        params: {
          type: 'artist',
          limit,
          after,
        },
      })

      const { artists } = response.data
      allArtists = [...allArtists, ...artists.items]
      after = artists.cursors?.after || null
      totalArtists = artists.total

      if (after) {
        await delay(100)
      }
    } while (after && allArtists.length < totalArtists)

    res.status(200).json({
      message: 'Spotify followed artists successfully retrieved.',
      artists: {
        items: allArtists,
        total: allArtists.length,
        limit,
        cursors: { after: null },
      },
    })
  } catch (error) {
    console.error('Spotify /me/following error:', error.response?.data || error.message)

    res.status(error.response?.status || 500).json({
      message: 'Spotify API error',
      details: error.response?.data || error.message,
    })
  }
})

/**
 * GET /api/spotify/me/tracks/contains?ids=TRACK_ID
 */
router.get('/tracks/contains', async (req, res) => {
  const { ids } = req.query

  if (!ids) {
    return res.status(400).json({ message: 'Missing ids query parameter.' })
  }

  try {
    const response = await axios.get('https://api.spotify.com/v1/me/tracks/contains', {
      headers: {
        Authorization: `Bearer ${req.spotifyAccessToken}`,
      },
      params: { ids },
    })

    res.status(200).json({
      ids: ids.split(','),
      contains: response.data,
    })
  } catch (error) {
    console.error('Spotify /me/tracks/contains error:', error.response?.data || error.message)

    res.status(error.response?.status || 500).json({
      message: 'Spotify API error',
      details: error.response?.data || error.message,
    })
  }
})

module.exports = router
