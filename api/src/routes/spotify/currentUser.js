const express = require('express')
const router = express.Router()
const axios = require('axios')
const { getAccessTokenFromSession } = require('../../utils/sessionHelpers')

router.get('/me', async (req, res) => {
  const accessToken = getAccessTokenFromSession(req)

  if (!accessToken) {
    return res.status(401).json({ error: 'No Spotify access token provided.' })
  }

  try {
    const spotifyApiResponse = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    res.json(spotifyApiResponse.data)
  } catch (error) {
    console.error(
      'Error fetching current user profile:',
      error.response ? error.response.data : error.message
    )
    res.status(error.response ? error.response.status : 500).json({
      error: 'Failed to fetch current user profile from Spotify.',
      details: error.response ? error.response.data : error.message,
    })
  }
})

module.exports = router
