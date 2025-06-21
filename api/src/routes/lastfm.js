const express = require('express')
const router = express.Router()
const axios = require('axios')
const LASTFM_API_KEY = process.env.LASTFM_KEY

// Função utilitária (pode ficar aqui por enquanto)
async function callLastFmApi(method, params, res) {
  if (!LASTFM_API_KEY) {
    console.error('LASTFM_KEY is not defined in environment variables.')
    return res.status(500).json({ error: 'Server configuration error: API key missing.' })
  }
  try {
    const queryParams = new URLSearchParams({
      method: method,
      api_key: LASTFM_API_KEY,
      format: 'json',
      ...params,
    }).toString()
    const lastFmUrl = `http://ws.audioscrobbler.com/2.0/?${queryParams}`
    const response = await axios.get(lastFmUrl)
    res.json(response.data)
  } catch (error) {
    console.error(`Error fetching Last.FM data for method ${method}:`, error.message)
    if (error.response && error.response.data) {
      return res.status(error.response.status || 500).json({
        error: error.response.data.message || 'Failed to fetch data from Last.FM API.',
        details: error.response.data.error || 'Unknown error from Last.FM',
      })
    }
    res.status(500).json({ error: 'Internal server error.' })
  }
}

// LastFM routes following their names in API documentation (to lowercase).
router.get('/artist.getinfo', async (req, res) => {
  const artistName = req.query.artist
  if (!artistName) {
    return res.status(400).json({ error: 'Artist name parameter is required.' })
  }
  await callLastFmApi('artist.getinfo', { artist: artistName }, res)
})

router.get('/tag.getinfo', async (req, res) => {
  const tagName = req.query.tag
  if (!tagName) {
    return res.status(400).json({ error: 'Tag name parameter is required.' })
  }
  await callLastFmApi('tag.getinfo', { tag: tagName }, res)
})

module.exports = router
