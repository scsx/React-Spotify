const express = require('express')
const axios = require('axios')

const router = express.Router()

const GENIUS_CLIENT_ID = process.env.GENIUS_CLIENT_ID
const GENIUS_CLIENT_SECRET = process.env.GENIUS_CLIENT_SECRET
const GENIUS_REDIRECT_URI = process.env.GENIUS_REDIRECT_URI

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

module.exports = router
