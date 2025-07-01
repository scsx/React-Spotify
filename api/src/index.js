require('dotenv').config()
const express = require('express')
const cors = require('cors')
const session = require('express-session')
const https = require('https')
const fs = require('fs')

const lastFmRoutes = require('./routes/lastfm')
const spotifyAuthRoutes = require('./routes/spotifyAuth')
// Spotify routes: --- order matters ---
const spotifyCurrentlyPlayingRoute = require('./routes/spotify/currentlyPlaying')
const spotifySearchRoute = require('./routes/spotify/search')
const spotifyArtistRoute = require('./routes/spotify/artist')
const spotifySimilarArtistsRoute = require('./routes/spotify/similarArtists')
const spotifyTopTracksRoute = require('./routes/spotify/topTracks')
const spotifyArtistAlbumsRoute = require('./routes/spotify/artistAlbums')
const spotifyPlaylistRoute = require('./routes/spotify/playlist') // playlists/:playlistId
const spotifyUserPlaylistsRoute = require('./routes/spotify/userPlaylists') // me/playlists
const spotifyCurrentUserRoute = require('./routes/spotify/currentUser')

const app = express()
const PORT = process.env.PORT || 3001

// --- Certificates SSL/TLS ---
const privateKey = fs.readFileSync('./certs/localhost+1-key.pem', 'utf8')
const certificate = fs.readFileSync('./certs/localhost+1.pem', 'utf8')
const credentials = { key: privateKey, cert: certificate }

// --- Middlewares ---

// CORS.
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'https://localhost:5173',
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
      secure: true, // https in dev and prod.
      httpOnly: true, // Impedir acesso via JavaScript no navegador
      maxAge: 1000 * 60 * 60 * 24, // 24 horas
      sameSite: 'None',
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
app.use('/api/spotify', spotifySimilarArtistsRoute)
app.use('/api/spotify', spotifyTopTracksRoute)
app.use('/api/spotify', spotifyArtistAlbumsRoute)
app.use('/api/spotify', spotifyUserPlaylistsRoute)
app.use('/api/spotify', spotifyPlaylistRoute)
app.use('/api/spotify', spotifyCurrentUserRoute)

// Test Endpoint
app.get('/api/test', (req, res) => {
  res.send('Hello from Express API! The current time is ' + new Date().toLocaleTimeString())
})

// Adiciona uma rota de fallback para o frontend em caso de erro no backend para a raiz
// Isto é para lidar com o 404 que estavas a ver para http://localhost:3001/
app.get('/', (req, res) => {
  res.redirect(process.env.FRONTEND_URL || 'https://localhost:5173')
})

if (process.env.NODE_ENV === 'production') {
  // Em produção (na Vercel, etc.), a plataforma lida com o HTTPS e o app.listen.
  // Apenas exportamos a app para a Vercel a correr.
  module.exports = app
} else {
  // Em desenvolvimento local, usamos HTTPS com os nossos certificados mkcert.
  const privateKey = fs.readFileSync('./certs/localhost+1-key.pem', 'utf8')
  const certificate = fs.readFileSync('./certs/localhost+1.pem', 'utf8')
  const credentials = { key: privateKey, cert: certificate }

  const httpsServer = https.createServer(credentials, app)

  httpsServer.listen(PORT, () => {
    console.log(`Express API running at https://localhost:${PORT}`)
    console.log(`Test with: https://localhost:${PORT}/api/test`)
    console.log(
      `Test Last.FM info with: https://localhost:${PORT}/localhost:${PORT}/api/lastfm/artist.getinfo?artist=Radiohead`
    )
  })
  module.exports = app // É bom exportar a app mesmo em dev para testes/outros usos
}
