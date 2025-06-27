require('dotenv').config()
const express = require('express')
const cors = require('cors')
const session = require('express-session')
const lastFmRoutes = require('./routes/lastfm')
const spotifyAuthRoutes = require('./routes/spotifyAuth')

const app = express()
const PORT = process.env.PORT || 3001

// --- Middlewares ---

// CORS.
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
)

// Configure express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // true in production for HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// LastFM routes.
app.use('/api/lastfm', lastFmRoutes)

// Spotify auth routes.
app.use('/auth/spotify', spotifyAuthRoutes)

// Test Endpoint
app.get('/api/test', (req, res) => {
  res.send('Hello from Express API! The current time is ' + new Date().toLocaleTimeString())
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
