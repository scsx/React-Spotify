const express = require('express')
const router = express.Router()
const axios = require('axios')

const { getAccessTokenFromSession } = require('../../utils/sessionHelpers')

/**
 * /api/spotify/artists/:artistId/similar-artists
 * Simulates Spotify "Related Artists" functionality by searching for artists
 * with similar genres. This bypasses the deprecated "Related Artists" endpoint.
 * Requires artistId and optional 'limit' query parameter.
 */
router.get('/artists/:artistId/similar-artists', async (req, res) => {
  const accessToken = getAccessTokenFromSession(req)
  const { artistId } = req.params
  const { limit = 9 } = req.query // Default limit for similar artists, can be adjusted by frontend

  if (!artistId) {
    return res.status(400).json({ error: 'Missing artist ID in request parameters.' })
  }

  if (!accessToken) {
    console.error(
      'No Spotify access token available for /artists/:artistId/similar-artists (simulated).'
    )
    return res.status(401).json({ error: 'No Spotify access token provided. Please log in.' })
  }

  try {
    // Step 1: Get the original artist's details to retrieve their genres.
    // Endpoint: https://api.spotify.com/v1/artists/{id}
    const artistDetailsUrl = `https://api.spotify.com/v1/artists/${artistId}`
    const artistDetailsResponse = await axios.get(artistDetailsUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    const originalArtist = artistDetailsResponse.data

    if (!originalArtist || !originalArtist.genres || originalArtist.genres.length === 0) {
      console.log(`Artist ${artistId} has no genres. Cannot find similar artists.`)
      return res.json({ artists: [] })
    }

    // Step 2: Search for artists using the retrieved genres.
    // Endpoint: https://api.spotify.com/v1/search
    const genresForQuery = originalArtist.genres.slice(0, 3).join(',')
    const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(genresForQuery)}&type=artist&limit=${limit}`

    const searchResponse = await axios.get(searchUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    let foundArtists = searchResponse.data.artists.items

    // Step 3: Filter out the original artist from the search results to avoid self-referencing.
    foundArtists = foundArtists.filter((artist) => artist.id !== artistId)

    // Return the limited list of similar artists.
    res.json({ artists: foundArtists.slice(0, limit) })
  } catch (error) {
    console.error(
      `Error fetching similar artists (simulated) for ID ${artistId}:`,
      error.response ? error.response.data : error.message
    )
    res.status(error.response ? error.response.status : 500).json({
      error: `Failed to fetch similar artists (simulated) for ID ${artistId}.`,
      details: error.response ? error.response.data : error.message,
    })
  }
})

module.exports = router
