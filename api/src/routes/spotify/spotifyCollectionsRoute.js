// ./routes/spotify/spotifyCollectionsRoute.js
const express = require('express')
const router = express.Router()
const axios = require('axios')
const { getAccessTokenFromSession } = require('../../utils/sessionHelpers')

// Middleware para todas as rotas neste router: Garante que o token de acesso está na sessão
router.use(async (req, res, next) => {
  console.log('\n--- REQUEST PARA ... ROUTE ---')
  console.log('Path da Requisição:', req.path)
  console.log('Session ID (... Route):', req.sessionID)
  console.log(
    'Token na sessão (primeiros 10 chars):',
    req.session.access_token ? req.session.access_token.substring(0, 10) + '...' : 'NÃO ENCONTRADO'
  )
  console.log('-------------------------------------\n')

  const accessToken = getAccessTokenFromSession(req)

  if (!accessToken) {
    console.error(`ERRO: Token não disponível para ${req.path}. Retornando 401.`)
    // EM VEZ DE REDIRECIONAR, RETORNE UM ERRO 401
    return res.status(401).json({ error: 'No Spotify access token provided. Please log in.' })
  }
  req.spotifyAccessToken = accessToken
  next()
})

/**
 * GET /api/spotify/playlists/me/playlists
 * Busca as playlists paginadas do utilizador logado (como o FE já chama).
 */
router.get('/me/playlists', async (req, res) => {
  console.log('--- /api/spotify/playlists/me/playlists ---')
  const accessToken = req.spotifyAccessToken
  const { limit, offset } = req.query

  try {
    const queryParams = new URLSearchParams()
    if (limit) queryParams.append('limit', limit)
    if (offset) queryParams.append('offset', offset)
    const queryString = queryParams.toString()

    const spotifyApiUrl = `https://api.spotify.com/v1/me/playlists${queryString ? `?${queryString}` : ''}` // URL real do Spotify

    const spotifyApiResponse = await axios.get(spotifyApiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    res.json(spotifyApiResponse.data)
  } catch (error) {
    console.error(
      `Error fetching user playlists from Spotify API:`,
      error.response ? error.response.data : error.message
    )
    res.status(error.response ? error.response.status : 500).json({
      error: `Failed to fetch user playlists from Spotify.`,
      details: error.response ? error.response.data : error.message,
    })
  }
})

/**
 * GET /api/spotify/playlists/favorites
 * Busca as playlists marcadas como "favoritas" (ex: com IDs fixos).
 * O frontend chama /api/spotify/playlists/favorites.
 */
router.get('/favorites', async (req, res) => {
  console.log('--- /api/spotify/playlists/favorites ---')
  const accessToken = req.spotifyAccessToken

  // TODO: REMOVE AND GET FROM PARAM.
  // TODO: REMOVE AND GET FROM PARAM.
  // TODO: REMOVE AND GET FROM PARAM.
  const SPOTIFY_FAVORITE_PLAYLISTS = [
    {
      name: '80s',
      id: '0hiwVtkB0sqhGqSWy74fHU',
      style: 'pop',
    },
    {
      name: 'Clássica',
      id: '6vkq13NujTnUF246xSFZcU',
      style: 'classical',
    },
    {
      name: 'Dance Floor',
      id: '6lIIR69uwo5u2o7Hiv7Mw7',
      style: 'electronic',
    },
    {
      name: 'Easy Stuff',
      id: '1Njwn17lPtwLN28P3my2fr',
      style: 'pop',
    },
    {
      name: 'Electronica Generalis',
      id: '0jarrgCbTDpm64zx2lFlsE',
      style: 'electronic',
    },
    {
      name: 'Landscapes',
      id: '0TMCEEgMgwQeTDS9F4pMQK',
      style: 'electronic',
    },
    {
      name: 'Light Rocks',
      id: '3T3UgNyFtX7607njDq4hME',
      style: 'rock',
    },
    {
      name: 'Metals',
      id: '72vNptEWViZpcr7GOLYD28',
      style: 'rock',
    },
    {
      name: 'Other Rocks',
      id: '1scJli8VnQh8iqdIJxEpKf',
      style: 'rock',
    },
    {
      name: 'PT',
      id: '2EYW8y7qAuZHrIBOaynspA',
      style: 'world',
    },
    {
      name: 'Rock to drive with a gun on hand fu** yeah',
      id: '1eLdHxs7QIJEW59TP30j36',
      style: 'rock',
    },
    {
      name: 'Slow Rocks',
      id: '2epyoENxIpHxajhu62Tiow',
      style: 'rock',
    },
    {
      name: 'TECHNO',
      id: '19FOSN1EmXCq67ALjNpkWD',
      style: 'electronic',
    },
    {
      name: 'Vintage & Classy',
      id: '2KMlwkr5yKkBXaxP4K2KXP',
      style: 'world',
    },
    {
      name: 'World',
      id: '5hr8RBJIP73hYOi5qyoDSz',
      style: 'world',
    },
  ]

  if (SPOTIFY_FAVORITE_PLAYLISTS.length === 0) {
    return res.status(200).json([]) // Retorna array vazio se não houver IDs definidos
  }

  try {
    // Faz várias chamadas paralelas à API do Spotify para cada ID
    const playlistRequests = SPOTIFY_FAVORITE_PLAYLISTS.map((id) =>
      axios.get(`https://api.spotify.com/v1/playlists/${id}`, {
        // URL real do Spotify
        headers: { Authorization: `Bearer ${accessToken}` },
      })
    )
    const responses = await Promise.all(playlistRequests)
    const playlists = responses.map((response) => response.data)
    res.json(playlists)
  } catch (error) {
    console.error(
      `Error fetching favorite playlists from Spotify API:`,
      error.response ? error.response.data : error.message
    )
    res.status(error.response ? error.response.status : 500).json({
      error: `Failed to fetch favorite playlists from Spotify.`,
      details: error.response ? error.response.data : error.message,
    })
  }
})

// TODO: Se tiver outras coleções como 'Your Top Songs', 'By Year', etc., adicione rotas aqui:
/*
router.get('/your-top-songs', async (req, res) => {
    console.log('--- /api/spotify/playlists/your-top-songs ---');
    const accessToken = req.spotifyAccessToken;
    // ... lógica para buscar 'Your Top Songs' ...
});

router.get('/by-year', async (req, res) => {
    console.log('--- /api/spotify/playlists/by-year ---');
    const accessToken = req.spotifyAccessToken;
    // ... lógica para buscar 'By Year' ...
});
*/

module.exports = router
