// api/src/routes/spotify/artist.js (este ficheiro conteria tudo)
const express = require('express')
const router = express.Router()
const axios = require('axios')
const { getAccessTokenFromSession } = require('../../utils/sessionHelpers')

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'

router.use(async (req, res, next) => {
  const accessToken = getAccessTokenFromSession(req)
  if (!accessToken) {
    return res.status(401).json({ error: 'No Spotify access token provided. Please log in.' })
  }
  req.spotifyAccessToken = accessToken
  next()
})

// Rota para obter informações base do artista: /api/spotify/artists/:artistId
router.get('/:artistId', async (req, res) => {
  const accessToken = req.spotifyAccessToken
  const { artistId } = req.params
  try {
    const response = await axios.get(`${SPOTIFY_API_BASE}/artists/${artistId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    res.json(response.data)
  } catch (error) {
    /* ... handle error ... */
  }
})

// Rota para obter álbuns do artista: /api/spotify/artists/:artistId/albums
router.get('/:artistId/albums', async (req, res) => {
  const accessToken = req.spotifyAccessToken
  const { artistId } = req.params
  const { include_groups, limit, offset, market } = req.query
  try {
    const queryParams = new URLSearchParams()
    if (include_groups) queryParams.append('include_groups', include_groups)
    if (limit) queryParams.append('limit', limit)
    if (offset) queryParams.append('offset', offset)
    if (market) queryParams.append('market', market)
    const queryString = queryParams.toString()

    const spotifyApiUrl = `${SPOTIFY_API_BASE}/artists/${artistId}/albums?${queryString}`
    const spotifyApiResponse = await axios.get(spotifyApiUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    res.json(spotifyApiResponse.data)
  } catch (error) {
    /* ... handle error ... */
  }
})

// Rota para top tracks: /api/spotify/artists/:artistId/top-tracks
router.get('/:artistId/top-tracks', async (req, res) => {
  // ESTA É A ROTA AGORA PREENCHIDA
  const accessToken = req.spotifyAccessToken // Já disponível do middleware
  const { artistId } = req.params
  const { market = 'US' } = req.query // Define 'US' como padrão se não for fornecido

  if (!artistId) {
    return res.status(400).json({ error: 'Missing artist ID in request parameters.' })
  }
  if (!accessToken) {
    console.error('No Spotify access token available for top tracks.')
    return res.status(401).json({ error: 'No Spotify access token provided. Please log in.' })
  }
  // Não é necessário verificar 'market' aqui se já tem um default
  // if (!market) { /* ... */ }

  try {
    const spotifyApiUrl = `${SPOTIFY_API_BASE}/artists/${artistId}/top-tracks?market=${market}` // CORRIGIDA a URL base e o 'artistId'

    console.log('[Backend - TopTracks] Chamando Spotify API com URL:', spotifyApiUrl) // DEBUG

    const spotifyApiResponse = await axios.get(spotifyApiUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    console.log('[Backend - TopTracks] Resposta do Spotify (data):', spotifyApiResponse.data) // DEBUG

    // O frontend espera response.data.tracks, então enviar spotifyApiResponse.data está correto
    res.json(spotifyApiResponse.data)
  } catch (error) {
    console.error(
      `[Backend - TopTracks] Erro ao buscar top tracks para artista ${artistId} (market: ${market}) do Spotify API:`,
      error.response ? error.response.data : error.message
    )
    res.status(error.response ? error.response.status : 500).json({
      error: `Failed to fetch top tracks for ID ${artistId} from Spotify.`,
      details: error.response ? error.response.data : error.message,
    })
  }
})

// Rota para artistas semelhantes: /api/spotify/artists/:artistId/similar
router.get('/:artistId/similar', async (req, res) => {
  /* ... similar logic ... */
})

module.exports = router
