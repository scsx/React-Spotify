const express = require('express')
const axios = require('axios')
const router = express.Router()

/**
 * Route to get the current user's Spotify profile details.
 * Accessed as GET /api/spotify/me (due to mounting in index.js)
 */
router.get('/', async (req, res) => {
  const accessToken = req.session.access_token

  if (!accessToken) {
    console.warn('Backend: /api/spotify/me - Access attempt without session access_token.')
    return res.status(401).json({ message: 'Unauthorized. Access token not found in session.' })
  }

  try {
    const spotifyMeResponse = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    res.status(200).json({
      message: 'Spotify user data successfully retrieved.',
      user: spotifyMeResponse.data,
    })
  } catch (error) {
    console.error(
      'Error fetching Spotify user data from external API (Spotify):',
      error.response ? error.response.data : error.message
    )

    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Destroy session and clear cookie if Spotify token is invalid/expired
      req.session.destroy((err) => {
        if (err) console.error('Error destroying session after invalid token:', err)
      })
      res.clearCookie('connect.sid', {
        domain: 'spotify-clone.local',
        path: '/',
        secure: true,
        sameSite: 'None',
      })
      return res.status(401).json({
        message: 'Spotify token expired or invalid. Please re-authenticate.',
      })
    }

    res.status(500).json({ message: 'Internal server error fetching Spotify data.' })
  }
})

/**
 * Route to get the current user's followed artists.
 * Accessed as GET /api/spotify/me/following.
 * Gets all artists with Throttling.
 */
router.get('/following', async (req, res) => {
  const accessToken = req.session.access_token

  if (!accessToken) {
    console.warn(
      'Backend: /api/spotify/me/following - Access attempt without session access_token.'
    )
    return res.status(401).json({ message: 'Unauthorized. Access token not found in session.' })
  }

  const limit = 50
  let after = null
  let allArtists = []
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  try {
    let totalArtists = 0

    do {
      const response = await axios.get('https://api.spotify.com/v1/me/following', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          type: 'artist',
          limit,
          after,
        },
      })

      const { artists } = response.data
      allArtists = [...allArtists, ...artists.items]
      after = artists.cursors ? artists.cursors.after : null
      totalArtists = artists.total

      // Throttling: 100ms
      if (after) {
        await delay(100)
      }
    } while (after && allArtists.length < totalArtists)

    res.status(200).json({
      message: 'Spotify followed artists successfully retrieved.',
      artists: {
        items: allArtists,
        total: allArtists.length,
        limit,
        cursors: { after: null },
      },
    })
  } catch (error) {
    console.error(
      'Error fetching Spotify followed artists from external API (Spotify):',
      error.response ? error.response.data : error.message
    )

    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      req.session.destroy((err) => {
        if (err) console.error('Error destroying session after invalid token:', err)
      })
      res.clearCookie('connect.sid', {
        domain: 'spotify-clone.local',
        path: '/',
        secure: true,
        sameSite: 'None',
      })
      return res.status(401).json({
        message: 'Spotify token expired or invalid. Please re-authenticate.',
      })
    }

    if (error.response && error.response.status === 429) {
      return res.status(429).json({
        message: 'Rate limit exceeded. Please try again later.',
      })
    }

    res.status(500).json({ message: 'Internal server error fetching Spotify followed artists.' })
  }
})

module.exports = router
