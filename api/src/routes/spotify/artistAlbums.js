const express = require('express')
const router = express.Router()
const axios = require('axios')

const { getAccessTokenFromSession } = require('../../utils/sessionHelpers')

/**
 * /api/spotify/artists/:artistId/albums
 * Proxies Spotify "Get an Artist's Albums" API requests.
 * Requires artistId and supports optional query parameters like 'include_groups', 'limit', 'offset', 'market'.
 */
router.get('/artists/:artistId/albums', async (req, res) => {
  const accessToken = getAccessTokenFromSession(req)
  const { artistId } = req.params
  // Extract query parameters like include_groups, limit, offset, market
  const { include_groups, limit, offset, market } = req.query

  if (!artistId) {
    return res.status(400).json({ error: 'Missing artist ID in request parameters.' })
  }

  if (!accessToken) {
    console.error('No Spotify access token available for /artists/:artistId/albums.')
    return res.status(401).json({ error: 'No Spotify access token provided. Please log in.' })
  }

  try {
    // Construct query string for Spotify API
    const queryParams = new URLSearchParams()
    if (include_groups) queryParams.append('include_groups', include_groups)
    if (limit) queryParams.append('limit', limit)
    if (offset) queryParams.append('offset', offset)
    if (market) queryParams.append('market', market)

    const queryString = queryParams.toString()

    // Make the GET request to Spotify's Get an Artist's Albums API
    const spotifyApiUrl = `https://api.spotify.com/v1/artists/${artistId}/albums?${queryString}`

    const spotifyApiResponse = await axios.get(spotifyApiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    res.json(spotifyApiResponse.data)
  } catch (error) {
    console.error(
      `Error fetching albums for artist ID ${artistId} from Spotify API:`,
      error.response ? error.response.data : error.message
    )
    res.status(error.response ? error.response.status : 500).json({
      error: `Failed to fetch albums for ID ${artistId} from Spotify.`,
      details: error.response ? error.response.data : error.message,
    })
  }
})

module.exports = router
