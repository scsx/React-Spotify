const express = require('express')
const router = express.Router()
const axios = require('axios')

const { getAccessTokenFromSession } = require('../../utils/sessionHelpers')

/**
 * /api/spotify/me/playlists
 */
router.get('/me/playlists', async (req, res) => {
  const accessToken = getAccessTokenFromSession(req)
  const { limit, offset } = req.query

  if (!accessToken) {
    console.error('No Spotify access token available for /me/playlists.')
    return res.status(401).json({ error: 'No Spotify access token provided. Please log in.' })
  }


  try {
    const queryParams = new URLSearchParams()
    if (limit) queryParams.append('limit', limit)
    if (offset) queryParams.append('offset', offset)

    const queryString = queryParams.toString()

    const spotifyApiUrl = `https://api.spotify.com/v1/me/playlists${queryString ? `?${queryString}` : ''}`

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

module.exports = router
