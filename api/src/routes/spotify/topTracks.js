const express = require('express')
const router = express.Router()
const axios = require('axios')

const { getAccessTokenFromSession } = require('../../utils/sessionHelpers')

/**
 * /api/spotify/artists/:artistId/top-tracks
 * Proxies Spotify "Get an Artist's Top Tracks" API requests.
 * Requires artistId and an optional 'market' query parameter (e.g., ?market=US).
 */
router.get('/artists/:artistId/top-tracks', async (req, res) => {
  const accessToken = getAccessTokenFromSession(req)
  const { artistId } = req.params
  // TODO: Change the market.
  // Spotify requires a market parameter for top tracks. Defaulting to 'US' if not provided.
  const { market = 'US' } = req.query

  if (!artistId) {
    return res.status(400).json({ error: 'Missing artist ID in request parameters.' })
  }

  if (!accessToken) {
    console.error('No Spotify access token available for /artists/:artistId/top-tracks.')
    return res.status(401).json({ error: 'No Spotify access token provided. Please log in.' })
  }

  if (!market) {
    return res
      .status(400)
      .json({ error: 'Missing market country code (e.g., US, PT) in query parameters.' })
  }

  try {
    // Endpoint: http://api.spotify.com/v1/me/player/currently-playing?market=$8{id}/top-tracks
    const spotifyApiUrl = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=${market}`

    const spotifyApiResponse = await axios.get(spotifyApiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    // Spotify API for top tracks returns an object with a 'tracks' array
    res.json(spotifyApiResponse.data)
  } catch (error) {
    console.error(
      `Error fetching top tracks for artist ID ${artistId} (market: ${market}) from Spotify API:`,
      error.response ? error.response.data : error.message
    )
    res.status(error.response ? error.response.status : 500).json({
      error: `Failed to fetch top tracks for ID ${artistId} from Spotify.`,
      details: error.response ? error.response.data : error.message,
    })
  }
})

module.exports = router
