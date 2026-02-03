const { SPOTIFY_API_BASE } = require('../../utils/constants-api')

const express = require('express')
const router = express.Router()
const axios = require('axios')

const { requireSpotifyAccessToken } = require('../../utils/spotifyAuthMiddleware')

router.use(requireSpotifyAccessToken)

/**
 * /api/spotify/search
 *Proxies Spotify Search API requests.
 * Requires 'q' (query), 'type' (item type), and optional 'limit', 'offset', etc.
 */
router.get('/', async (req, res) => {
  const accessToken = req.spotifyAccessToken
  const { q, type, limit, offset, market } = req.query // Extract query parameters

  // Basic validation for required parameters
  if (!q || !type) {
    return res.status(400).json({ error: 'Missing required query parameters: q (query) and type.' })
  }

  if (!accessToken) {
    console.error('No Spotify access token available for /search.')
    return res.status(401).json({ error: 'No Spotify access token provided. Please log in.' })
  }

  try {
    const parsedLimit = parseInt(limit, 10) || 20
    const parsedOffset = parseInt(offset, 10) || 0

    // Cap limit at Spotify's maximum (usually 50)
    const finalLimit = Math.min(parsedLimit, 20)

    // Build query parameters for Spotify API
    const spotifyQueryParams = new URLSearchParams({
      q: q,
      type: type,
      limit: String(finalLimit),
      offset: String(parsedOffset),
      ...(market && { market: market }),
    }).toString()

    // Make the GET request to Spotify's Search API
    const spotifyApiResponse = await axios.get(`${SPOTIFY_API_BASE}/search?${spotifyQueryParams}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    // Send Spotify's response back to the frontend
    res.json(spotifyApiResponse.data)
  } catch (error) {
    console.error(
      'Error fetching search results from Spotify API:',
      error.response ? error.response.data : error.message
    )
    // Forward Spotify API's error status and data if available
    res.status(error.response ? error.response.status : 500).json({
      error: 'Failed to fetch search results from Spotify.',
      details: error.response ? error.response.data : error.message,
    })
  }
})

module.exports = router
