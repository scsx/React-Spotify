const express = require('express')
const axios = require('axios')
const router = express.Router()

const { getAccessTokenFromSession } = require('../../utils/sessionHelpers')

// Middleware to ensure Spotify access token is present
router.use(async (req, res, next) => {
  const accessToken = getAccessTokenFromSession(req)
  if (!accessToken) {
    return res.status(401).json({ error: 'No Spotify access token provided. Please log in.' })
  }
  req.spotifyAccessToken = accessToken
  next()
})

// GET /new-releases (will be mounted under /api/spotify in main server)
router.get('/', async (req, res) => {
  const accessToken = req.spotifyAccessToken
  const { country, limit, offset } = req.query // Optional query parameters from frontend

  try {
    const queryParams = new URLSearchParams()
    if (country) queryParams.append('country', country)
    if (limit) queryParams.append('limit', limit)
    if (offset) queryParams.append('offset', offset)
    const queryString = queryParams.toString()

    // Actual Spotify API endpoint for New Releases
    const spotifyApiUrl = `https://api.spotify.com/v1/browse/new-releases?${queryString}`

    const spotifyApiResponse = await axios.get(spotifyApiUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    // Spotify API returns { albums: { items: [...] } } for new releases
    res.json({ items: spotifyApiResponse.data.albums.items })
  } catch (error) {
    console.error(
      '[Backend - NewReleases] Error fetching new releases from Spotify API:',
      error.message
    )
    if (axios.isAxiosError(error) && error.response) {
      // Forward Spotify API error details to frontend
      return res.status(error.response.status).json(error.response.data)
    }
    res.status(500).json({ message: 'Failed to fetch new releases.' })
  }
})

module.exports = router
