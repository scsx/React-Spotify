const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const router = express.Router()

// Variáveis de ambiente para autenticação Genius
const GENIUS_CLIENT_ID = process.env.GENIUS_CLIENT_ID
const GENIUS_CLIENT_SECRET = process.env.GENIUS_CLIENT_SECRET
const GENIUS_REDIRECT_URI = process.env.GENIUS_REDIRECT_URI

// Inicia fluxo de autenticação Genius (OAuth)
router.get('/auth/genius', (req, res) => {
  const params = new URLSearchParams({
    client_id: GENIUS_CLIENT_ID,
    redirect_uri: GENIUS_REDIRECT_URI,
    response_type: 'code',
    scope: 'me',
  })

  res.redirect(`https://api.genius.com/oauth/authorize?${params}`)
})

// Callback após autenticação – obtém access token e guarda na sessão
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

    // Guarda token na sessão
    req.session.genius = {
      accessToken: tokenRes.data.access_token,
    }

    // Fecha popup ou redireciona
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

// Pesquisa na API Genius (retorna hits)
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

// Obtém letras por ID da música (scrape da página Genius)
router.get('/lyrics/:id', async (req, res) => {
  if (!req.session.genius?.accessToken) {
    return res.status(401).json({ error: 'Not authenticated with Genius' })
  }

  try {
    // 1. Obter metadados da música para pegar a URL da página
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

    // 2. Scrape da página de letras
    const pageRes = await axios.get(pageUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
      },
      timeout: 15000,
    })

    const $ = cheerio.load(pageRes.data)

    // Remover headers e elementos não lyrics
    $(
      'div[data-lyrics-container="true"] .LyricsHeader__Container, button, svg, .Dropdown__Container'
    ).remove()

    // Extrair o HTML interno do container e converter para texto com quebras
    const lyricsHtml = $('div[data-lyrics-container="true"]').html() || ''

    let lyrics = lyricsHtml
      .replace(/<br\s*\/?>/gi, '\n') // substitui <br> por \n
      .replace(/<\/?[^>]+(>|$)/g, '') // remove todas as tags
      .replace(/\n\s*\n+/g, '\n') // remove linhas vazias extras
      .replace(/^\s+|\s+$/gm, '') // trim em cada linha
      .trim()

    // Destacar secções [Chorus], [Verse], etc.
    lyrics = lyrics.replace(/\[(Chorus|Verse|Outro|Intro|Bridge|Refrain|Interlude)\]/gi, '\n\n$&')

    // Fallback se o selector principal falhar
    if (!lyrics) {
      lyrics = $('div[class*="Lyrics__Container"]').text().trim()
    }

    if (!lyrics) {
      return res.status(404).json({ error: 'Lyrics not found in page' })
    }

    res.json({
      lyrics,
      url: pageUrl,
    })
  } catch (error) {
    const status = error.response?.status

    if (status === 401 || status === 403) {
      return res.status(401).json({ error: 'Genius token expired' })
    }

    if (status === 404) {
      return res.status(404).json({ error: 'Song not found' })
    }

    if (status === 429) {
      return res.status(429).json({ error: 'Rate limited by Genius' })
    }

    console.error('Lyrics error:', error.message)
    return res.status(500).json({ error: 'Failed to get lyrics' })
  }
})

module.exports = router
