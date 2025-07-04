require('dotenv').config()
const express = require('express')
const cors = require('cors')
const session = require('express-session')
const https = require('https')
const fs = require('fs')

// --- Importação de Rotas ---
const lastFmRoutes = require('./routes/lastfm')
const spotifyAuthRoutes = require('./routes/spotifyAuth')
// Garanta que estes ficheiros de rota estão corretos para as URIs que pretende usar
const spotifyPlaylistRoutes = require('./routes/spotify/playlists')
const spotifyCurrentlyPlayingRoute = require('./routes/spotify/currentlyPlaying')
const spotifySearchRoute = require('./routes/spotify/search')
const spotifyArtistRoute = require('./routes/spotify/artist')
const spotifyCurrentUserRoute = require('./routes/spotify/currentUser')
const spotifySimilarArtistsRoute = require('./routes/spotify/similarArtists')

const app = express()
const API_PORT = process.env.PORT || 3001
const FRONTEND_HOST = process.env.FRONTEND_HOST
const FRONTEND_SPOTIFY_LOGIN_SUCCESS_URL = process.env.FRONTEND_SPOTIFY_LOGIN_SUCCESS_URL

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
    origin: FRONTEND_SPOTIFY_LOGIN_SUCCESS_URL.replace(/\/$/, ''),
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
      domain: FRONTEND_HOST,
    },
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// --- ROUTES ---
// LastFM routes.
app.use('/api/lastfm', lastFmRoutes)

// Spotify auth route.
app.use('/auth/spotify', spotifyAuthRoutes)

const spotifyApiRouter = express.Router()

// User
spotifyApiRouter.use('/me', spotifyCurrentUserRoute)

// Other
spotifyApiRouter.use('/playlists', spotifyPlaylistRoutes)
spotifyApiRouter.use('/player', spotifyCurrentlyPlayingRoute)
spotifyApiRouter.use('/search', spotifySearchRoute)
spotifyApiRouter.use('/artists', spotifyArtistRoute)
spotifyApiRouter.use('/artists', spotifySimilarArtistsRoute)

// spotifyApiRouter
app.use('/api/spotify', spotifyApiRouter)

// Test Endpoint
app.get('/api/test', (req, res) => {
  res.send('Hello from Express API! The current time is ' + new Date().toLocaleTimeString())
})

// Adiciona uma rota de fallback para o frontend em caso de erro no backend para a raiz
app.get('/', (req, res) => {
  res.redirect(FRONTEND_SPOTIFY_LOGIN_SUCCESS_URL)
})

// --- Início do Servidor ---
if (process.env.NODE_ENV === 'production') {
  // TODO: do something or remove.
} else {
  const httpsServer = https.createServer(credentials, app)
  httpsServer.listen(API_PORT, FRONTEND_HOST, () => {
    console.log(`Express API running at https://${FRONTEND_HOST}:${API_PORT}`)
    console.log(`Test with: https://${FRONTEND_HOST}:${API_PORT}/api/test`)
    console.log(
      `Test Last.FM info with: https://${FRONTEND_HOST}:${API_PORT}/api/lastfm/artist.getinfo?artist=Radiohead`
    )
  })
}

// module.exports = app // Remova esta linha se não estiver a exportar o app para testes
