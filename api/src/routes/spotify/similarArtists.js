const { SPOTIFY_API_BASE } = require('../../utils/constants-api')

const express = require('express')
const router = express.Router()
const axios = require('axios')

const { requireSpotifyAccessToken } = require('../../utils/spotifyAuthMiddleware')

// Middleware para garantir que o token de acesso do Spotify está presente
router.use(requireSpotifyAccessToken)

/**
 * /api/spotify/artists/:artistId/similar-artists
 * Simula a funcionalidade "Related Artists" do Spotify pesquisando por artistas
 * com géneros semelhantes.
 */
router.get('/:artistId', async (req, res) => {
  const accessToken = req.spotifyAccessToken
  const { artistId } = req.params
  const { limit = 9 } = req.query

  if (!artistId) {
    return res.status(400).json({ error: 'Missing artist ID in request parameters.' })
  }
  if (!accessToken) {
    console.error('No Spotify access token available for similar artists (simulated).')
    return res.status(401).json({ error: 'No Spotify access token provided. Please log in.' })
  }

  try {
    // Passo 1: Obter detalhes do artista original para recuperar os seus géneros.
    const artistDetailsUrl = `${SPOTIFY_API_BASE}/artists/${artistId}`

    const artistDetailsResponse = await axios.get(artistDetailsUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    const originalArtist = artistDetailsResponse.data

    if (!originalArtist || !originalArtist.genres || originalArtist.genres.length === 0) {
      return res.json({ artists: [] }) // Retorna um array vazio se não houver géneros
    }

    // Passo 2: Pesquisar por artistas usando os géneros recuperados.
    const genresForQuery = originalArtist.genres.slice(0, 3).join(',')
    const searchUrl = `${SPOTIFY_API_BASE}/search?q=${encodeURIComponent(genresForQuery)}&type=artist&limit=${limit}`

    const searchResponse = await axios.get(searchUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    let foundArtists = searchResponse.data.artists.items

    // Passo 3: Filtrar o artista original dos resultados da pesquisa para evitar auto-referência.
    foundArtists = foundArtists.filter((artist) => artist.id !== artistId)

    // Retorna a lista limitada de artistas semelhantes.
    res.json({ artists: foundArtists.slice(0, limit) })
  } catch (error) {
    console.error(
      `[Backend - SimilarArtists] Erro ao buscar artistas semelhantes (simulados) para o ID ${artistId}:`,
      error.response ? error.response.data : error.message
    )
    res.status(error.response?.status || 500).json({
      error: `Failed to fetch similar artists (simulated) for ID ${artistId}.`,
      details: error.response ? error.response.data : error.message,
    })
  }
})

module.exports = router
