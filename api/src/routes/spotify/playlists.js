const express = require('express')
const router = express.Router()
const axios = require('axios')
const { getAccessTokenFromSession } = require('../../utils/sessionHelpers')

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1' 

// --- MIDDLEWARE LOCAL (para logs e token) ---
router.use(async (req, res, next) => {
  const accessToken = getAccessTokenFromSession(req)
  if (!accessToken) {
    console.error(`ERRO: Token não disponível para ${req.path}.`)
    return res.status(401).json({ error: 'No Spotify access token provided. Please log in.' })
  }
  req.spotifyAccessToken = accessToken // Adiciona o token à requisição
  next()
})

// --- Função Auxiliar para Buscar Detalhes Completos da Playlist ---
// Esta função será reutilizada pelas rotas que precisam de detalhes completos
async function fetchFullPlaylistDetails(playlistId, accessToken) {
  try {
    const response = await axios.get(`${SPOTIFY_API_BASE}/playlists/${playlistId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return response.data
  } catch (error) {
    console.error(
      `Erro ao buscar detalhes completos da playlist ${playlistId} da Spotify API:`,
      error.response?.data || error.message
    )
    throw error // Re-lança o erro para ser tratado pela rota chamadora
  }
}

// --- 1. GET /playlists (Frontend: /playlists) - Todas as Playlists do Utilizador (paginada) ---
// Endpoint: /api/spotify/playlists
router.get('/', async (req, res) => {
  const accessToken = req.spotifyAccessToken
  const limit = req.query.limit || 40 // Padrão 40
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

// --- 2. GET /playlists/favorites (MODIFICADA para retornar detalhes completos) ---
// Endpoint: /api/spotify/playlists/favorites
router.get('/favorites', async (req, res) => {
  const accessToken = req.spotifyAccessToken

  try {
    const allUserPlaylists = []
    let offset = 0
    const limit = 50
    let hasMore = true

    while (hasMore) {
      const response = await axios.get(`${SPOTIFY_API_BASE}/me/playlists`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { limit, offset },
      })
      allUserPlaylists.push(...response.data.items)
      hasMore = response.data.next !== null
      offset += limit
    }

    const favoritePlaylistsBasic = allUserPlaylists.filter((p) =>
      p.name.toLowerCase().includes('favorite')
    )

    // --- Buscar detalhes completos para cada playlist favorita ---
    const fullFavoritePlaylists = []
    for (const basicPlaylist of favoritePlaylistsBasic) {
      try {
        const fullDetails = await fetchFullPlaylistDetails(basicPlaylist.id, accessToken)
        fullFavoritePlaylists.push(fullDetails)
      } catch (detailError) {
        console.warn(`Could not fetch full details for favorite playlist ID: ${basicPlaylist.id}`)
      }
    }

    res.json({ items: fullFavoritePlaylists, total: fullFavoritePlaylists.length })
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

// --- 3. GET /playlists/your-top-songs & 4. GET /playlists/by-year (MODIFICADAS para retornar detalhes completos) ---
// Endpoint: /api/spotify/playlists/your-top-songs?term=your%20top%20songs
// Endpoint: /api/spotify/playlists/by-year?term=2023
router.get('/:filterType(your-top-songs|by-year)', async (req, res) => {
  const accessToken = req.spotifyAccessToken
  const filterType = req.params.filterType
  const searchTerm = req.query.term

  if (!searchTerm) {
    return res.status(400).json({ error: 'Search term is required for this filter.' })
  }

  try {
    const allUserPlaylists = []
    let offset = 0
    const limit = 50
    let hasMore = true

    while (hasMore) {
      const response = await axios.get(`${SPOTIFY_API_BASE}/me/playlists`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { limit, offset },
      })
      allUserPlaylists.push(...response.data.items)
      hasMore = response.data.next !== null
      offset += limit
    }

    const filteredPlaylistsBasic = allUserPlaylists.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // --- NOVO: Buscar detalhes completos para cada playlist filtrada ---
    const fullFilteredPlaylists = []
    for (const basicPlaylist of filteredPlaylistsBasic) {
      try {
        const fullDetails = await fetchFullPlaylistDetails(basicPlaylist.id, accessToken)
        fullFilteredPlaylists.push(fullDetails)
      } catch (detailError) {
        console.warn(`Could not fetch full details for filtered playlist ID: ${basicPlaylist.id}`)
        // Opcional: Adicionar a playlist básica se os detalhes completos falharem
        // fullFilteredPlaylists.push(basicPlaylist);
      }
    }

    res.json({ items: fullFilteredPlaylists, total: fullFilteredPlaylists.length })
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

// --- POST /playlists/by-names
// Endpoint: /api/spotify/playlists/by-names
router.post('/by-names', async (req, res) => {
  const accessToken = req.spotifyAccessToken
  const targetPlaylistNames = req.body.names

  if (!Array.isArray(targetPlaylistNames) || targetPlaylistNames.length === 0) {
    return res
      .status(400)
      .json({ error: 'Array of playlist names is required in the request body.' })
  }

  const foundPlaylists = []
  const notFoundNames = []

  const limit = 50

  try {
    const allUserPlaylists = []
    let offset = 0
    let hasMore = true

    while (hasMore) {
      const response = await axios.get(`${SPOTIFY_API_BASE}/me/playlists`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { limit, offset },
      })
      allUserPlaylists.push(...response.data.items)
      hasMore = response.data.next !== null
      offset += limit
    }
    console.log(`[Backend] Total de playlists do utilizador carregadas: ${allUserPlaylists.length}`)

    for (const name of targetPlaylistNames) {
      const lowerCaseName = name.toLowerCase()

      const foundBasicPlaylist = allUserPlaylists.find(
        (p) => p.name && p.name.toLowerCase().includes(lowerCaseName)
      )

      if (foundBasicPlaylist) {
        try {
          console.log(
            `[Backend] Encontrou playlist "${name}" com ID: ${foundBasicPlaylist.id}. A buscar detalhes completos.`
          )
          const fullDetails = await fetchFullPlaylistDetails(foundBasicPlaylist.id, accessToken)
          foundPlaylists.push(fullDetails)
        } catch (detailError) {
          console.error(
            `[Backend] Erro ao buscar detalhes completos da playlist "${name}" (ID: ${foundBasicPlaylist.id}):`,
            detailError.response?.data || detailError.message
          )
          notFoundNames.push(name)
        }
      } else {
        console.log(`[Backend] Playlist "${name}" não encontrada para o utilizador.`)
        notFoundNames.push(name)
      }
    }

    if (notFoundNames.length > 0) {
      return res.json({
        found: foundPlaylists,
        notFound: notFoundNames,
        message: `Found ${foundPlaylists.length} playlists. ${notFoundNames.length} playlists not found.`,
      })
    } else {
      res.json({ found: foundPlaylists, notFound: [], message: 'All requested playlists found.' })
    }
  } catch (error) {
    console.error(
      `[Backend] Erro geral ao buscar playlists por nomes do Spotify API:`,
      error.response?.data || error.message
    )
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch playlists by name from Spotify.',
      details: error.response?.data || error.message,
    })
  } 
})

// --- GET /playlists/:playlistId
// Endpoint: /api/spotify/playlists/:playlistId
router.get('/:playlistId', async (req, res) => {
  const accessToken = req.spotifyAccessToken
  const { playlistId } = req.params

  if (!playlistId) {
    return res.status(400).json({ error: 'Playlist ID is required.' })
  }

  try {
    const fullDetails = await fetchFullPlaylistDetails(playlistId, accessToken)
    res.json(fullDetails)
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
