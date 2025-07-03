require('dotenv').config()
const express = require('express')
const cors = require('cors')
const session = require('express-session')
const https = require('https')
const fs = require('fs')

const lastFmRoutes = require('./routes/lastfm')
const spotifyAuthRoutes = require('./routes/spotifyAuth')
// Spotify routes: --- order matters ---
// Garanta que estes ficheiros de rota estão corretos para as URIs que pretende usar
const spotifyCollectionsRoute = require('./routes/spotify/spotifyCollectionsRoute') // Anteriormente /api/spotify/me
const spotifyPlaylistDetailsRoute = require('./routes/spotify/playlist') // Anteriormente /api/spotify/playlists/:playlistId
// Spotify routes: --- order matters ---
const spotifyCurrentlyPlayingRoute = require('./routes/spotify/currentlyPlaying')
const spotifySearchRoute = require('./routes/spotify/search')
const spotifyArtistRoute = require('./routes/spotify/artist')
const spotifySimilarArtistsRoute = require('./routes/spotify/similarArtists')
const spotifyTopTracksRoute = require('./routes/spotify/topTracks')
const spotifyArtistAlbumsRoute = require('./routes/spotify/artistAlbums')
const spotifyCurrentUserRoute = require('./routes/spotify/currentUser')

const app = express()
const API_PORT = process.env.PORT || 3001 // Usar API_PORT para consistência
const API_HOST = 'spotify-clone.local' // *** NOVO HOST AQUI ***

// --- Certificates SSL/TLS ---
// Caminhos corretos para os certificados gerados com mkcert
const privateKey = fs.readFileSync('./certs/spotify-clone.local+1-key.pem', 'utf8')
const certificate = fs.readFileSync('./certs/spotify-clone.local+1.pem', 'utf8')
const credentials = { key: privateKey, cert: certificate }

const LokiStore = require('connect-loki')(session)
const lokiStoreOptions = {
  path: './sessions/loki.db',
  logErrors: true,
  ttl: 86400,
}

// --- Middlewares ---

// CORS.
app.use(
  cors({
    // Use a variável do .env que configuramos para o frontend
    origin: process.env.FRONTEND_SPOTIFY_LOGIN_SUCCESS_URL.replace(/\/$/, ''), // Remove barra final se existir
    credentials: true, // Muito importante para permitir o envio de cookies de sessão
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Adicione métodos HTTP que usa
    allowedHeaders: ['Content-Type', 'Authorization'], // Adicione cabeçalhos que permite
  })
)

// Configure express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // Alterado para false para evitar sessões vazias desnecessárias
    store: new LokiStore(lokiStoreOptions),
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

// Spotify routes. Order matters.
// Verifique se os seus ficheiros de rota estão corretamente mapeados para as URIs aqui
// Exemplo: se spotifyCollectionsRoute trata /me/playlists, o path deve ser /api/spotify/me
app.use('/api/spotify/me', spotifyCollectionsRoute) // Mudei para /api/spotify/me
app.use('/api/spotify/playlists', spotifyPlaylistDetailsRoute) // Mantive para playlists individuais

// 3. Other Spotify routes.
app.use('/api/spotify', spotifyCurrentlyPlayingRoute)
app.use('/api/spotify', spotifySearchRoute)
app.use('/api/spotify', spotifyArtistRoute)
app.use('/api/spotify', spotifySimilarArtistsRoute)
app.use('/api/spotify', spotifyTopTracksRoute)
app.use('/api/spotify', spotifyArtistAlbumsRoute)
app.use('/api/spotify', spotifyCurrentUserRoute)

// Test Endpoint
app.get('/api/test', (req, res) => {
  res.send('Hello from Express API! The current time is ' + new Date().toLocaleTimeString())
})

// Adiciona uma rota de fallback para o frontend em caso de erro no backend para a raiz
app.get('/', (req, res) => {
  // Use a mesma variável do .env que configuramos
  res.redirect(process.env.FRONTEND_SPOTIFY_LOGIN_SUCCESS_URL)
})

module.exports = app

if (process.env.NODE_ENV === 'production') {
  // TODO: do something or remove.
} else {
  // Em desenvolvimento local, usamos HTTPS com os nossos certificados mkcert.
  const httpsServer = https.createServer(credentials, app)

  // O servidor deve escutar no NOVO HOST: spotify-clone.local
  httpsServer.listen(API_PORT, API_HOST, () => {
    console.log(`Express API running at https://${API_HOST}:${API_PORT}`)
    console.log(`Test with: https://${API_HOST}:${API_PORT}/api/test`)
    console.log(
      `Test Last.FM info with: https://${API_HOST}:${API_PORT}/api/lastfm/artist.getinfo?artist=Radiohead`
    )
  })
}
