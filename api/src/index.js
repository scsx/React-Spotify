// api/src/index.js
require('dotenv').config() // Carrega as variáveis de ambiente do .env
const express = require('express')
const cors = require('cors')
const lastFmRoutes = require('./routes/lastfm')

const app = express()
const PORT = process.env.PORT || 3001 // Porta para desenvolvimento local. Vercel gerencia a porta em produção.

// Configura o CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  })
)

// Monta todas as rotas Last.FM sob o prefixo '/api/lastfm'
// Ex: uma rota definida em lastfm.js como '/artist.getinfo' será acessível via '/api/lastfm/artist.getinfo'
app.use('/api/lastfm', lastFmRoutes)

// Endpoint de teste simples (manter para verificação)
app.get('/api/test', (req, res) => {
  res.send('Hello from Express API! The current time is ' + new Date().toLocaleTimeString())
})

// Para o Vercel, é necessário exportar 'app'
module.exports = app

// Dev only (Vercel ignores app.listen())
app.listen(PORT, () => {
  console.log(`Express API running at http://localhost:${PORT}`)
  console.log(`Test with: http://localhost:${PORT}/api/test`)
  console.log(
    `Test Last.FM info with: http://localhost:${PORT}/api/lastfm/artist.getinfo?artist=Radiohead`
  )
})
