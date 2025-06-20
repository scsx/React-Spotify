require('dotenv').config() // Carrega as variáveis de ambiente do .env
const express = require('express')
const axios = require('axios')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3001 // Porta para desenvolvimento local. Vercel gerencia a porta em produção.

// Configura o CORS para permitir requisições do seu frontend
// Em produção no Vercel, o origin será o URL do seu frontend.
// Para desenvolvimento, 'http://localhost:5173' é o padrão do Vite.
// É uma boa prática restringir isso em produção.
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Apenas permita requisições do seu frontend
  })
)

// Variável de ambiente segura para a chave da Last.FM
const LASTFM_API_KEY = process.env.LASTFM_KEY

// Endpoint para obter informações do artista da Last.FM
app.get('/api/lastfm-artist-info', async (req, res) => {
  const artistName = req.query.artist // Obtém o nome do artista do parâmetro de query

  if (!artistName) {
    return res.status(400).json({ error: 'Artist name parameter is required.' })
  }

  if (!LASTFM_API_KEY) {
    console.error('LASTFM_KEY is not defined in environment variables.')
    return res.status(500).json({ error: 'Server configuration error: API key missing.' })
  }

  try {
    const lastFmUrl = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(
      artistName
    )}&api_key=${LASTFM_API_KEY}&format=json`
    const response = await axios.get(lastFmUrl)
    res.json(response.data) // Retorna os dados da Last.FM para o frontend
  } catch (error) {
    console.error('Error fetching Last.FM data:', error.message)
    // Tenta extrair a mensagem de erro da API Last.FM se disponível
    if (error.response && error.response.data) {
      return res
        .status(error.response.status || 500)
        .json({ error: error.response.data.message || 'Failed to fetch data from Last.FM API.' })
    }
    res.status(500).json({ error: 'Internal server error.' })
  }
})

// Endpoint de teste simples
app.get('/api/test', (req, res) => {
  res.send('Hello from Express API! The current time is ' + new Date().toLocaleTimeString())
})

// Para o Vercel, é necessário exportar 'app'
module.exports = app

// KEEP: dev only.
app.listen(PORT, () => {
  console.log(`Express API running at http://localhost:${PORT}`)
  console.log(`Test with: http://localhost:${PORT}/api/test`)
  console.log(
    `Test Last.FM info with: http://localhost:${PORT}/api/lastfm-artist-info?artist=Radiohead`
  )
})
