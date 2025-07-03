// ./routes/spotify/playlist.js
const express = require('express')
const router = express.Router()
const axios = require('axios')
// REMOVA esta linha se getAccessTokenFromSession não for mais usada diretamente aqui
// const { getAccessTokenFromSession } = require('../../utils/sessionHelpers')

// --- REMOVA ESTE BLOCO router.use COMPLETO ---
// Middleware para todas as rotas neste router: Garante que o token de acesso está na sessão
/*
router.use(async (req, res, next) => {
    console.log('\n--- REQUEST PARA PLAYLIST DETAILS ROUTE ---')
    console.log('Path da Requisição:', req.path)
    console.log('Session ID (Playlist Details Route):', req.sessionID)
    console.log(
        'Token na sessão (primeiros 10 chars):',
        req.session.access_token ? req.session.access_token.substring(0, 10) + '...' : 'NÃO ENCONTRADO'
    )
    console.log('-----------------------------------------\n')

    const accessToken = getAccessTokenFromSession(req)
    if (!accessToken) {
        console.error(`ERRO: Token não disponível para ${req.path}.`)
        return res.status(401).json({ error: 'No Spotify access token provided. Please log in.' })
    }
    req.spotifyAccessToken = accessToken // Adiciona o token à requisição
    next()
})
*/
// --- FIM DO BLOCO A REMOVER ---

/**
 * GET /api/spotify/playlist-details/:playlistId
 * Busca os detalhes de uma playlist específica por ID.
 * O frontend chamará /api/spotify/playlist-details/ALGUM_ID (incluindo 'discovery-weekly', 'shazam').
 */
router.get('/:playlistId', async (req, res) => {
  console.log('--- /api/spotify/playlist-details/:playlistId ---')
  // O accessToken agora virá diretamente de req.spotifyAccessToken, definido no middleware do index.js
  const accessToken = req.spotifyAccessToken
  let { playlistId } = req.params

  // Mapeia IDs especiais para IDs reais do Spotify
  if (playlistId === 'discovery-weekly') {
    playlistId = process.env.SPOTIFY_DISCOVERY_WEEKLY_ID //TODO: NOT ON .env
  } else if (playlistId === 'shazam') {
    playlistId = process.env.SPOTIFY_SHAZAM_ID //TODO: NOT ON .env
  }

  if (!playlistId) {
    return res.status(400).json({ error: 'Playlist ID is required or could not be mapped.' })
  }

  try {
    // CORREÇÃO: Certifique-se de que a URL da API do Spotify é HTTPS
    const spotifyApiUrl = `https://api.spotify.com/v1/playlists/${playlistId}`
    const spotifyApiResponse = await axios.get(spotifyApiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    res.json(spotifyApiResponse.data)
  } catch (error) {
    console.error(
      `Error fetching playlist ${playlistId} from Spotify API:`,
      error.response ? error.response.data : error.message
    )
    res.status(error.response ? error.response.status : 500).json({
      error: `Failed to fetch playlist details from Spotify.`,
      details: error.response ? error.response.data : error.message,
    })
  }
})

module.exports = router
