const express = require('express')
const axios = require('axios')

const router = express.Router()

const GENIUS_CLIENT_ID = process.env.GENIUS_CLIENT_ID
const GENIUS_CLIENT_SECRET = process.env.GENIUS_CLIENT_SECRET
const GENIUS_REDIRECT_URI = process.env.GENIUS_REDIRECT_URI

// AUTH.
router.get('/auth/genius', (req, res) => {
  const params = new URLSearchParams({
    client_id: GENIUS_CLIENT_ID,
    redirect_uri: GENIUS_REDIRECT_URI,
    response_type: 'code',
    scope: 'me',
  })

  res.redirect(`https://api.genius.com/oauth/authorize?${params}`)
})

router.get('/auth/genius/callback', async (req, res) => {
  const code = req.query.code

  try {
    const tokenRes = await axios.post(
      'https://api.genius.com/oauth/token',
      new URLSearchParams({
        client_id: GENIUS_CLIENT_ID,
        client_secret: GENIUS_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: GENIUS_REDIRECT_URI,
      }).toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    )

    req.session.genius = {
      accessToken: tokenRes.data.access_token,
    }

    res.redirect(process.env.FRONTEND_SPOTIFY_LOGIN_SUCCESS_URL)
  } catch (e) {
    console.error('Genius OAuth error', e.response?.data || e.message)
    res.status(500).json({ error: 'Genius auth failed' })
  }
})

// SEARCH.
router.get('/search', async (req, res) => {
  const q = req.query.q

  if (!q) return res.status(400).json({ error: 'Missing q' })
  if (!req.session.genius?.accessToken)
    return res.status(401).json({ error: 'Not authenticated with Genius' })

  const r = await axios.get('https://api.genius.com/search', {
    params: { q },
    headers: {
      Authorization: `Bearer ${req.session.genius.accessToken}`,
    },
  })

  res.json(r.data.response.hits)
})

// GET LYRICS BY ID.
router.get('/lyrics/:id', async (req, res) => {
  const songId = req.params.id

  const song = await axios.get(`https://api.genius.com/songs/${songId}`, {
    headers: {
      Authorization: `Bearer ${req.session.genius.accessToken}`,
    },
  })

  const url = song.data.response.song.url

  const html = await axios.get(url)
  const m = html.data.match(/<div[^>]*data-lyrics-container[^>]*>([\s\S]*?)<\/div>/g)

  const lyrics = m ? m.map((v) => v.replace(/<[^>]+>/g, '').trim()).join('\n') : null

  res.json({ lyrics, url })
})

module.exports = router
