// api/src/routes/spotify/similarArtists.js

const express = require('express')
const router = express.Router()
const axios = require('axios')

// Importe o helper para obter o token de sessão, tal como no artist.js
const { getAccessTokenFromSession } = require('../../utils/sessionHelpers')

// Defina a base da API do Spotify aqui também, pois esta rota fará chamadas diretas ao Spotify
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1' // A SUA BASE DA API DO SPOTIFY

// Middleware para esta rota específica (ou pode ser global no index.js se preferir)
// Por consistência, vamos mantê-lo aqui, similar ao que acontece no artist.js
router.use(async (req, res, next) => {
  const accessToken = getAccessTokenFromSession(req)
  if (!accessToken) {
    console.error(`ERROR: Access token not available for ${req.path}.`)
    return res.status(401).json({ error: 'No Spotify access token provided. Please log in.' })
  }
  req.spotifyAccessToken = accessToken // Adiciona o token ao objeto request
  next()
})

/**
 * /api/spotify/artists/:artistId/similar-artists
 * Simula a funcionalidade "Related Artists" do Spotify pesquisando por artistas
 * com géneros semelhantes. Isso contorna o endpoint "Related Artists" descontinuado.
 * Requer artistId e um parâmetro de query opcional 'limit'.
 */
router.get('/:artistId/similar-artists', async (req, res) => {
  // Usamos req.spotifyAccessToken que vem do middleware acima
  const accessToken = req.spotifyAccessToken
  const { artistId } = req.params
  const { limit = 9 } = req.query // Limite padrão para artistas semelhantes

  if (!artistId) {
    return res.status(400).json({ error: 'Missing artist ID in request parameters.' })
  }
  // O middleware já verifica o accessToken, mas uma verificação extra não faz mal
  if (!accessToken) {
    console.error('No Spotify access token available for similar artists (simulated).')
    return res.status(401).json({ error: 'No Spotify access token provided. Please log in.' })
  }

  try {
    // Passo 1: Obter detalhes do artista original para recuperar os seus géneros.
    // Endpoint CORRIGIDO: Use SPOTIFY_API_BASE
    const artistDetailsUrl = `${SPOTIFY_API_BASE}/artists/${artistId}`
    console.log(
      `[Backend - SimilarArtists] A buscar detalhes do artista original de: ${artistDetailsUrl}`
    )

    const artistDetailsResponse = await axios.get(artistDetailsUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    const originalArtist = artistDetailsResponse.data

    if (!originalArtist || !originalArtist.genres || originalArtist.genres.length === 0) {
      console.log(
        `Artista ${artistId} não tem géneros. Não é possível encontrar artistas semelhantes.`
      )
      return res.json({ artists: [] }) // Retorna um array vazio se não houver géneros
    }

    // Passo 2: Pesquisar por artistas usando os géneros recuperados.
    // Endpoint CORRIGIDO: Use SPOTIFY_API_BASE para a pesquisa
    const genresForQuery = originalArtist.genres.slice(0, 3).join(',') // Pegar até 3 géneros
    // O endpoint de pesquisa do Spotify é /search
    const searchUrl = `${SPOTIFY_API_BASE}/search?q=${encodeURIComponent(genresForQuery)}&type=artist&limit=${limit}`
    console.log(`[Backend - SimilarArtists] A pesquisar artistas semelhantes com URL: ${searchUrl}`)

    const searchResponse = await axios.get(searchUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    let foundArtists = searchResponse.data.artists.items

    // Passo 3: Filtrar o artista original dos resultados da pesquisa para evitar auto-referência.
    foundArtists = foundArtists.filter((artist) => artist.id !== artistId)

    // Retorna a lista limitada de artistas semelhantes.
    console.log(
      `[Backend - SimilarArtists] Encontrados ${foundArtists.length} artistas semelhantes.`
    )
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
