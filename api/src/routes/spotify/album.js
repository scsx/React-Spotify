const express = require('express')
const router = express.Router()
const axios = require('axios')
const { getAccessTokenFromSession } = require('../../utils/sessionHelpers')

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'

// Middleware para garantir que o token de acesso do Spotify está presente
router.use(async (req, res, next) => {
  const accessToken = getAccessTokenFromSession(req)
  if (!accessToken) {
    return res.status(401).json({ error: 'No Spotify access token provided. Please log in.' })
  }
  req.spotifyAccessToken = accessToken
  next()
})

/**
 * Rota para obter detalhes de um álbum específico:
 * GET /api/spotify/albums/:albumId
 */
router.get('/:albumId', async (req, res) => {
  const accessToken = req.spotifyAccessToken
  const { albumId } = req.params

  if (!albumId) {
    return res.status(400).json({ error: 'Missing album ID in request parameters.' })
  }

  try {
    const spotifyApiUrl = `${SPOTIFY_API_BASE}/albums/${albumId}`

    const spotifyApiResponse = await axios.get(spotifyApiUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    // Retorna os dados completos do álbum
    res.json(spotifyApiResponse.data)
  } catch (error) {
    console.error(
      `[Backend - Album] Erro ao buscar álbum ID ${albumId} do Spotify API:`,
      error.response ? error.response.data : error.message
    )
    res.status(error.response?.status || 500).json({
      error: `Failed to fetch album details for ID ${albumId}.`,
      details: error.response ? error.response.data : error.message,
    })
  }
})

module.exports = router
