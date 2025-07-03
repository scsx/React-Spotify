// api/src/index.js
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const session = require('express-session')
const https = require('https')
const fs = require('fs')

// --- Importação de Rotas ---
const lastFmRoutes = require('./routes/lastfm') // <-- IMPORTANTE: Last.fm routes
const spotifyAuthRoutes = require('./routes/spotifyAuth') // <-- IMPORTANTE: Spotify Auth (login, callback, logout)
// Garanta que estes ficheiros de rota estão corretos para as URIs que pretende usar
const spotifyCollectionsRoute = require('./routes/spotify/spotifyCollectionsRoute')
const spotifyPlaylistDetailsRoute = require('./routes/spotify/playlist')
const spotifyCurrentlyPlayingRoute = require('./routes/spotify/currentlyPlaying')
const spotifySearchRoute = require('./routes/spotify/search')
const spotifyArtistRoute = require('./routes/spotify/artist')
const spotifySimilarArtistsRoute = require('./routes/spotify/similarArtists')
const spotifyTopTracksRoute = require('./routes/spotify/topTracks')
const spotifyArtistAlbumsRoute = require('./routes/spotify/artistAlbums')
const spotifyCurrentUserRoute = require('./routes/spotify/currentUser') // <-- IMPORTANTE: Spotify Current User (o /me)

const app = express()
const API_PORT = process.env.PORT || 3001
const API_HOST = 'spotify-clone.local'

// --- Certificates SSL/TLS ---
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
app.use(
  cors({
    origin: process.env.FRONTEND_SPOTIFY_LOGIN_SUCCESS_URL.replace(/\/$/, ''),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new LokiStore(lokiStoreOptions),
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 24 horas
      sameSite: 'None',
      domain: 'spotify-clone.local',
    },
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// --- Definição de Rotas ---

// LastFM routes.
app.use('/api/lastfm', lastFmRoutes)

// Spotify auth route.
app.use('/auth/spotify', spotifyAuthRoutes)

// Spotify API routes.
const spotifyApiRouter = express.Router()

// Monta a rota para obter o perfil do utilizador.
// Esta é a correção para o 404 de /api/spotify/me
spotifyApiRouter.use('/me', spotifyCurrentUserRoute) // <-- ESTA É A LINHA CRÍTICA CORRIGIDA

// Monte as outras rotas da API do Spotify
spotifyApiRouter.use('/playlists', spotifyPlaylistDetailsRoute) // Se o endpoint é /api/spotify/playlists/:id
spotifyApiRouter.use('/collections', spotifyCollectionsRoute) // Se o endpoint é /api/spotify/collections
spotifyApiRouter.use('/player', spotifyCurrentlyPlayingRoute) // Ex: Se a rota interna é '/currently-playing'
spotifyApiRouter.use('/search', spotifySearchRoute)
spotifyApiRouter.use('/artist', spotifyArtistRoute)
spotifyApiRouter.use('/artist/similar', spotifySimilarArtistsRoute)
spotifyApiRouter.use('/artist/top-tracks', spotifyTopTracksRoute)
spotifyApiRouter.use('/artist/albums', spotifyArtistAlbumsRoute)


// Finalmente, monte o spotifyApiRouter no caminho '/api/spotify' da sua aplicação principal
app.use('/api/spotify', spotifyApiRouter)

// Test Endpoint
app.get('/api/test', (req, res) => {
  res.send('Hello from Express API! The current time is ' + new Date().toLocaleTimeString())
})

// Adiciona uma rota de fallback para o frontend em caso de erro no backend para a raiz
app.get('/', (req, res) => {
  res.redirect(process.env.FRONTEND_SPOTIFY_LOGIN_SUCCESS_URL)
})

// --- Início do Servidor ---
if (process.env.NODE_ENV === 'production') {
  // TODO: do something or remove.
} else {
  const httpsServer = https.createServer(credentials, app)
  httpsServer.listen(API_PORT, API_HOST, () => {
    console.log(`Express API running at https://${API_HOST}:${API_PORT}`)
    console.log(`Test with: https://${API_HOST}:${API_PORT}/api/test`)
    console.log(
      `Test Last.FM info with: https://${API_HOST}:${API_PORT}/api/lastfm/artist.getinfo?artist=Radiohead`
    )
  })
}

// module.exports = app // Remova esta linha se não estiver a exportar o app para testes