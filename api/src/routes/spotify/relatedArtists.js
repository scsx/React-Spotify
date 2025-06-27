const express = require('express')
const router = express.Router()
const axios = require('axios')

const { getAccessTokenFromSession } = require('../../utils/sessionHelpers')

/**
 * /api/spotify/artists/:artistId/related-artists
 * Final dev: http://localhost:3001/api/spotify/artists/22WZ7M8sxp5THdruNY3gXt/related-artists
 * Fetches related artists for a specific artist by their Spotify ID.
 */
router.get('/artists/:artistId/related-artists', async (req, res) => {
  // Note the '/artists' prefix here
  const accessToken = getAccessTokenFromSession(req)
  const { artistId } = req.params // Extract artistId from URL parameters

  // Basic validation
  if (!artistId) {
    return res.status(400).json({ error: 'Missing artist ID in request parameters.' })
  }

  if (!accessToken) {
    console.error('No Spotify access token available for /artists/:artistId/related-artists.')
    return res.status(401).json({ error: 'No Spotify access token provided. Please log in.' })
  }

  try {
    // Make the GET request to Spotify's Get an Artist's Related Artists API
    // The endpoint is https://api.spotify.com/v1/artists/{id}/related-artists
    const spotifyApiUrl = `https://api.spotify.com/v1/artists/${artistId}/related-artists`

    console.log('DEBUG: Calling Spotify API URL for Related Artists:', spotifyApiUrl)
    console.log('DEBUG: Using Access Token (first 10 chars):', accessToken.substring(0, 10) + '...')

    const spotifyApiResponse = await axios.get(
      spotifyApiUrl,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    res.json(spotifyApiResponse.data)
  } catch (error) {
    console.error(
      `Error fetching related artists for ID ${artistId} from Spotify API:`,
      error.response ? error.response.data : error.message
    )
    // Forward Spotify API's error status and data if available
    res.status(error.response ? error.response.status : 500).json({
      error: `Failed to fetch related artists for ID ${artistId} from Spotify.`,
      details: error.response ? error.response.data : error.message,
    })
  }
})

module.exports = router
