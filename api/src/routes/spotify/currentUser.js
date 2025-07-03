// api/src/routes/spotify/currentUser.js
const express = require('express')
const axios = require('axios')
const router = express.Router()

/**
 * Rota para obter os detalhes do perfil do usuário atualmente logado no Spotify.
 * Esta rota é acessada como GET /api/spotify/me (devido à montagem no index.js)
 */
router.get('/', async (req, res) => {
  const accessToken = req.session.access_token

  if (!accessToken) {
    console.warn('Backend: /api/spotify/me - Tentativa de acesso sem access_token na sessão.')
    return res
      .status(401)
      .json({ message: 'Não autenticado. Token de acesso não encontrado na sessão.' })
  }

  try {
    const spotifyMeResponse = await axios.get('https://api.spotify.com/v1/me', {
      // URL CORRETA DA API DO SPOTIFY para 'me'
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    res.status(200).json({
      message: 'Dados do usuário Spotify obtidos com sucesso.',
      user: spotifyMeResponse.data,
    })
    console.log(
      'Backend: Dados do usuário Spotify obtidos e enviados para o frontend via /api/spotify/me.'
    )
  } catch (error) {
    console.error(
      'Erro ao obter dados do usuário Spotify da API externa (Spotify):',
      error.response ? error.response.data : error.message
    )

    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      req.session.destroy((err) => {
        if (err) console.error('Erro ao destruir sessão após token inválido:', err)
      })
      res.clearCookie('connect.sid', {
        domain: 'spotify-clone.local',
        path: '/',
        secure: true,
        sameSite: 'None',
      })
      return res
        .status(401)
        .json({
          message: 'Token Spotify expirado ou inválido. Por favor, autentique-se novamente.',
        })
    }

    res.status(500).json({ message: 'Erro interno ao obter dados do Spotify.' })
  }
})

module.exports = router
