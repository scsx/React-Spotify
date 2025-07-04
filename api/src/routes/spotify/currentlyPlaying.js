const express = require('express')
const router = express.Router()
const axios = require('axios')

const { getAccessTokenFromSession } = require('../../utils/sessionHelpers')

router.get('/currently-playing', async (req, res) => {
  const accessToken = getAccessTokenFromSession(req)
  const market = req.query.market || 'US'

  if (!accessToken) {
    console.error('No Spotify access token available for /currently-playing.')
    return res.status(401).json({ error: 'No Spotify access token provided. Please log in.' })
  }

  try {
    const response = await axios.get(`https://api.spotify.com/v1/me/player/currently-playing`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: { market: market },
    })
    res.json(response.data)
  } catch (error) {
    console.error(
      'Error fetching currently playing song from Spotify API:',
      error.response ? error.response.data : error.message
    )
    res.status(error.response ? error.response.status : 500).json({
      error: 'Failed to fetch currently playing song from Spotify.',
      details: error.response ? error.response.data : error.message,
    })
  }
})

module.exports = router
