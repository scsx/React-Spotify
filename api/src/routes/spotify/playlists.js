// api/src/routes/spotify/playlists.js
const express = require('express')
const router = express.Router()
const axios = require('axios')
// Re-incluímos esta importação, pois iremos usá-la diretamente em cada rota.
const { getAccessTokenFromSession } = require('../../utils/sessionHelpers')

// --- Importante: Defina a URL base da API do Spotify ---
// É ALTAMENTE RECOMENDADO usar uma variável de ambiente para isto (ex: process.env.SPOTIFY_API_BASE_URL)
// Por agora, vamos usar a string literal correta.
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'

// --- MIDDLEWARE LOCAL (OPCIONAL, para logs e token) ---
// Se quiser logs detalhados e ter o accessToken no req.spotifyAccessToken para todas as rotas neste router.
// Alternativamente, pode continuar a chamar getAccessTokenFromSession(req) em cada rota individualmente.
router.use(async (req, res, next) => {
  // console.log('\n--- REQUEST PARA PLAYLISTS ROUTER ---');
  // console.log('Path da Requisição:', req.path);
  // console.log('Session ID (Playlists Router):', req.sessionID);

  const accessToken = getAccessTokenFromSession(req)
  if (!accessToken) {
    console.error(`ERRO: Token não disponível para ${req.path}.`)
    return res.status(401).json({ error: 'No Spotify access token provided. Please log in.' })
  }
  req.spotifyAccessToken = accessToken // Adiciona o token à requisição
  // console.log('Token na sessão (primeiros 10 chars):', accessToken.substring(0, 10) + '...');
  // console.log('-----------------------------------------\n');
  next()
})

// --- 1. GET /playlists (Frontend: /playlists) - Todas as Playlists do Utilizador (paginada) ---
// Endpoint: /api/spotify/playlists
router.get('/', async (req, res) => {
  // O accessToken agora é obtido do middleware acima
  const accessToken = req.spotifyAccessToken
  const limit = req.query.limit || 40 // Padrão 40, como solicitado
  const offset = req.query.offset || 0

  try {
    const response = await axios.get(`${SPOTIFY_API_BASE}/me/playlists`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { limit, offset },
    })
    res.json(response.data)
  } catch (error) {
    console.error(
      'Error fetching all user playlists from Spotify API:',
      error.response?.data || error.message
    )
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch all user playlists from Spotify.',
      details: error.response?.data || error.message,
    })
  }
})

// --- 2. GET /playlists/favorites (Frontend: /playlists/favorites) ---
// Endpoint: /api/spotify/playlists/favorites
router.get('/favorites', async (req, res) => {
  // O accessToken agora é obtido do middleware acima
  const accessToken = req.spotifyAccessToken

  try {
    // Busca um número razoável de playlists para filtrar
    // A API do Spotify não tem um endpoint direto para "favoritas", então filtramos no backend.
    const allPlaylistsResponse = await axios.get(`${SPOTIFY_API_BASE}/me/playlists?limit=50`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const allPlaylists = allPlaylistsResponse.data.items

    // --- Lógica de filtragem para "favoritas" ---
    // Adapte esta lógica conforme a sua definição de "favoritas"
    // Exemplo: filtrar por nomes que contenham "Favorite" ou por IDs pré-definidos no backend.
    const favoritePlaylists = allPlaylists.filter((p) => p.name.toLowerCase().includes('favorite')) // Exemplo simples

    res.json({ items: favoritePlaylists, total: favoritePlaylists.length })
  } catch (error) {
    console.error(
      'Error fetching favorite playlists from Spotify API:',
      error.response?.data || error.message
    )
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch favorite playlists from Spotify.',
      details: error.response?.data || error.message,
    })
  }
})

// --- 3. GET /playlists/your-top-songs & 4. GET /playlists/by-year ---
// Endpoint: /api/spotify/playlists/your-top-songs?term=your%20top%20songs
// Endpoint: /api/spotify/playlists/by-year?term=2023
router.get('/:filterType(your-top-songs|by-year)', async (req, res) => {
  // O accessToken agora é obtido do middleware acima
  const accessToken = req.spotifyAccessToken
  const filterType = req.params.filterType // 'your-top-songs' ou 'by-year'
  const searchTerm = req.query.term // O termo real a filtrar (ex: 'your top songs', '2023')

  if (!searchTerm) {
    return res.status(400).json({ error: 'Search term is required for this filter.' })
  }

  try {
    // Busca todas as playlists (ou um número razoável para a filtragem)
    const allPlaylistsResponse = await axios.get(`${SPOTIFY_API_BASE}/me/playlists?limit=50`, {
      // Ajuste o limit se o utilizador tiver muitas
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const allPlaylists = allPlaylistsResponse.data.items

    // Filtra pelo termo de busca
    const filteredPlaylists = allPlaylists.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    res.json({ items: filteredPlaylists, total: filteredPlaylists.length })
  } catch (error) {
    console.error(
      `Error fetching playlists filtered by ${filterType} from Spotify API:`,
      error.response?.data || error.message
    )
    res.status(error.response?.status || 500).json({
      error: `Failed to fetch playlists filtered by ${filterType} from Spotify.`,
      details: error.response?.data || error.message,
    })
  }
})

// --- 5. GET /playlists/:playlistId (Frontend: /playlists/discovery-weekly, /playlists/shazam, ou qualquer ID) ---
// Endpoint: /api/spotify/playlists/:playlistId (onde :playlistId pode ser um ID real ou 'discovery-weekly', 'shazam')
router.get('/:playlistId', async (req, res) => {
  // O accessToken agora é obtido do middleware acima
  const accessToken = req.spotifyAccessToken
  let { playlistId } = req.params // Captura o ID da playlist da URL

  // Mapeia IDs especiais para IDs reais do Spotify se necessário.
  // É recomendado que estes IDs estejam em variáveis de ambiente ou num ficheiro de config.
  if (playlistId === 'discovery-weekly') {
    playlistId = process.env.SPOTIFY_DISCOVERY_WEEKLY_ID // <--- **MUDE ISTO PARA A SUA VAR ENV!**
  } else if (playlistId === 'shazam') {
    playlistId = process.env.SPOTIFY_SHAZAM_ID // <--- **MUDE ISTO PARA A SUA VAR ENV!**
  }

  if (!playlistId) {
    return res.status(400).json({ error: 'Playlist ID is required or could not be mapped.' })
  }

  try {
    const spotifyApiUrl = `${SPOTIFY_API_BASE}/playlists/${playlistId}`
    const spotifyApiResponse = await axios.get(spotifyApiUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
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
