const express = require('express')
const router = express.Router()
const axios = require('axios')

const DISCOGS_TOKEN = process.env.DISCOGS_TOKEN
const DISCOGS_BASE_URL = 'https://api.discogs.com'

const discogsHeaders = {
  Authorization: `Discogs token=${DISCOGS_TOKEN}`,
  'User-Agent': 'React-Spotify/1.0',
}

// Get band members by artist name
router.get('/artist/members', async (req, res) => {
  const { artistName } = req.query

  if (!artistName) {
    return res.status(400).json({ error: 'Artist name parameter is required.' })
  }

  try {
    // Search for the artist
    const searchResponse = await axios.get(`${DISCOGS_BASE_URL}/database/search`, {
      params: {
        q: artistName,
        type: 'artist',
      },
      headers: discogsHeaders,
    })

    if (!searchResponse.data.results || searchResponse.data.results.length === 0) {
      return res.status(404).json({ error: 'Artist not found on Discogs.' })
    }

    const artistResult = searchResponse.data.results[0]
    const artistResourceUrl = artistResult.resource_url

    // Get detailed artist info with members
    const artistResponse = await axios.get(artistResourceUrl, {
      headers: discogsHeaders,
    })

    const members = artistResponse.data.members || []

    res.json({
      artist: artistResponse.data.name,
      id: artistResponse.data.id,
      members: members,
      totalMembers: members.length,
      url: artistResponse.data.urls?.[0] || null,
    })
  } catch (error) {
    console.error(`Error fetching Discogs artist members for "${artistName}":`, error.message)
    if (error.response && error.response.data) {
      return res.status(error.response.status || 500).json({
        error: 'Failed to fetch artist from Discogs API.',
        details: error.response.data.message || error.message,
      })
    }
    res.status(500).json({ error: 'Internal server error.' })
  }
})

module.exports = router
