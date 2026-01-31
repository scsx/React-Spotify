const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
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

    res.send(`
      <script>
        if (window.opener) {
          window.opener.postMessage("GENIUS_AUTH_SUCCESS", "*")
          window.close()
        } else {
          window.location = "${process.env.FRONTEND_SPOTIFY_LOGIN_SUCCESS_URL}"
        }
      </script>
    `)
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

// GET LYRICS BY ID. Scrappes the Genius page to get the lyrics.
router.get('/lyrics/:id', async (req, res) => {
  if (!req.session.genius?.accessToken) {
    return res.status(401).json({ error: 'Not authenticated with Genius' })
  }

  try {
    // 1. Obter a URL da página da música
    const songRes = await axios.get(`https://api.genius.com/songs/${req.params.id}`, {
      headers: {
        Authorization: `Bearer ${req.session.genius.accessToken}`,
      },
      timeout: 10000,
    })

    const song = songRes.data.response.song
    const pageUrl = song.url

    if (!pageUrl) {
      return res.status(404).json({ error: 'Song URL not found' })
    }

    // 2. Scrape das letras
    const pageRes = await axios.get(pageUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
      },
      timeout: 15000,
    })

    const $ = cheerio.load(pageRes.data)

    // Selector principal atual (2026)
    let lyrics = $('div[data-lyrics-container="true"]')
      .contents()
      .map((i, el) => {
        if (el.type === 'text') return $(el).text()
        if (el.tagName === 'br') return '\n'
        return ''
      })
      .get()
      .join('')
      .replace(/\n\s*\n/g, '\n')
      .trim()

    // Fallback se o principal falhar
    if (!lyrics) {
      lyrics = $('div[class*="Lyrics__Container"]').first().text().trim()
    }

    if (!lyrics) {
      return res.status(404).json({ error: 'Lyrics not found in page' })
    }

    res.json({
      lyrics,
      url: pageUrl,
    })
  } catch (error) {
    console.error('Lyrics error:', error.message || error)
    const status = error.response?.status
    if (status === 403 || status === 429) {
      return res.status(403).json({ error: 'Genius blocked request (anti-bot)' })
    }
    if (status === 404) {
      return res.status(404).json({ error: 'Song not found' })
    }
    res.status(500).json({ error: 'Failed to get lyrics' })
  }
})

module.exports = router
