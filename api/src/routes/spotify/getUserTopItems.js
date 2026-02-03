const { SPOTIFY_API_BASE } = require('../../utils/constants')
const { requireSpotifyAccessToken } = require('../../utils/spotifyAuthMiddleware')

const express = require('express')
const axios = require('axios')
const router = express.Router()

router.use(requireSpotifyAccessToken)

router.get('/:type', async (req, res) => {
  const accessToken = req.spotifyAccessToken
  const { type } = req.params
  const { time_range = 'medium_term', limit = 20, offset = 0 } = req.query

  if (!accessToken) {
    return res.status(401).json({ message: 'Unauthorized. Access token not found in session.' })
  }

  if (!['tracks', 'artists'].includes(type)) {
    return res.status(400).json({ message: 'Invalid type. Use tracks or artists.' })
  }

  try {
    const response = await axios.get(`${SPOTIFY_API_BASE}/me/top/${type}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        time_range,
        limit,
        offset,
      },
    })

    res.status(200).json(response.data)
  } catch (error) {
    console.error(
      'Error fetching Spotify top items:',
      error.response ? error.response.data : error.message
    )

    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      req.session.destroy(() => {})
      res.clearCookie('connect.sid', {
        domain: 'spotify-clone.local',
        path: '/',
        secure: true,
        sameSite: 'None',
      })
      return res.status(401).json({
        message: 'Spotify token expired or invalid. Please re-authenticate.',
      })
    }

    if (error.response && error.response.status === 429) {
      return res.status(429).json({
        message: 'Rate limit exceeded. Please try again later.',
      })
    }

    res.status(500).json({ message: 'Internal server error fetching top items.' })
  }
})

module.exports = router
