const express = require('express')
const router = express.Router()
const axios = require('axios')

// Import the helper function to get the access token from the session
const { getAccessTokenFromSession } = require('../../utils/sessionHelpers')

/**
 * /api/spotify/artists/:artistId
 * Proxies Spotify Get Artist API requests.
 * Fetches details for a specific artist by Spotify ID.
 */
router.get('/:artistId', async (req, res) => {
  const accessToken = getAccessTokenFromSession(req)
  const { artistId } = req.params // Extract artistId from URL parameters

  // Basic validation
  if (!artistId) {
    return res.status(400).json({ error: 'Missing artist ID in request parameters.' })
  }

  if (!accessToken) {
    console.error('No Spotify access token available for /artists/:artistId.')
    return res.status(401).json({ error: 'No Spotify access token provided. Please log in.' })
  }

  try {
    const spotifyApiResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    // Send Spotify's response back to the frontend
    res.json(spotifyApiResponse.data)
  } catch (error) {
    console.error(
      `Error fetching artist details for ID ${artistId} from Spotify API:`,
      error.response ? error.response.data : error.message
    )
    // Forward Spotify API's error status and data if available
    res.status(error.response ? error.response.status : 500).json({
      error: `Failed to fetch artist details for ID ${artistId} from Spotify.`,
      details: error.response ? error.response.data : error.message,
    })
  }
})

module.exports = router
