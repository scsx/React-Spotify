require('dotenv').config()
const express = require('express')
const cors = require('cors')
const session = require('express-session')
const lastFmRoutes = require('./routes/lastfm')
const spotifyAuthRoutes = require('./routes/spotifyAuth')
// Spotify routes
const spotifyCurrentlyPlayingRoute = require('./routes/spotify/currentlyPlaying')
const spotifySearchRoute = require('./routes/spotify/search')
const spotifyArtistRoute = require('./routes/spotify/artist')
const spotifyRelatedArtistsRoute = require('./routes/spotify/relatedArtists')

const app = express()
const PORT = process.env.PORT || 3001

// --- Middlewares ---

// CORS.
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true, // Muito importante para permitir o envio de cookies de sessão
  })
)

// Configure express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // true em produção para HTTPS
      httpOnly: true, // Impedir acesso via JavaScript no navegador
      maxAge: 1000 * 60 * 60 * 24, // 24 horas
      // --- Adição para resolver problemas em desenvolvimento ---
      // 'None' é para cross-site e requer 'secure: true' (HTTPS)
      // 'Lax' é um bom balanço para muitos casos cross-site em HTTP
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      // Se usares 'SameSite: 'None'' em produção, certifica-te de que o teu site está em HTTPS.
      // Em desenvolvimento (sem HTTPS), 'SameSite: 'Lax'' é geralmente a melhor opção.
    },
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// LastFM routes.
app.use('/api/lastfm', lastFmRoutes)

// Spotify auth route.
app.use('/auth/spotify', spotifyAuthRoutes)

// Spotify routes.
app.use('/api/spotify', spotifyCurrentlyPlayingRoute)
app.use('/api/spotify', spotifySearchRoute)
app.use('/api/spotify', spotifyArtistRoute)
app.use('/api/spotify', spotifyRelatedArtistsRoute)

// Test Endpoint
app.get('/api/test', (req, res) => {
  res.send('Hello from Express API! The current time is ' + new Date().toLocaleTimeString())
})

// Adiciona uma rota de fallback para o frontend em caso de erro no backend para a raiz
// Isto é para lidar com o 404 que estavas a ver para http://localhost:3001/
app.get('/', (req, res) => {
  res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173')
})

module.exports = app

// Dev only (Vercel ignora app.listen())
app.listen(PORT, () => {
  console.log(`Express API running at http://localhost:${PORT}`)
  console.log(`Test with: http://localhost:${PORT}/api/test`)
  console.log(
    `Test Last.FM info with: http://localhost:${PORT}/api/lastfm/artist.getinfo?artist=Radiohead`
  )
})
