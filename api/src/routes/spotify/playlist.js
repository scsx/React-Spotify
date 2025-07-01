const express = require('express')
const router = express.Router()
const axios = require('axios')

const { getAccessTokenFromSession } = require('../../utils/sessionHelpers')

router.get('/playlists/:playlistId', async (req, res) => {
  // TODO: DEV
  console.log('--- /playlists/:playlistId ---')
  console.log('Session ID:', req.sessionID)
  console.log('Session has spotifyAccessToken:', !!req.session.access_token)
  const accessToken = getAccessTokenFromSession(req)

  const { playlistId } = req.params

  if (!accessToken) {
    console.error(`No Spotify access token available for /playlists/${playlistId}.`)
    return res.status(401).json({ error: 'No Spotify access token provided. Please log in.' })
  }

  if (!playlistId) {
    return res.status(400).json({ error: 'Playlist ID is required.' })
  }

  try {
    const spotifyApiUrl = `https://api.spotify.com/v1/playlists/${playlistId}`

    const spotifyApiResponse = await axios.get(spotifyApiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    res.json(spotifyApiResponse.data)
  } catch (error) {
    console.error(
      `Error fetching playlist ${playlistId} from Spotify API:`,
      error.response ? error.response.data : error.message
    )
    res.status(error.response ? error.response.status : 500).json({
      error: `Failed to fetch playlist details from Spotify.`,
      details: error.response ? error.response.data : error.message,
    })
  }
})

module.exports = router
