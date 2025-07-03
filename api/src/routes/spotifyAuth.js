// api/src/routes/spotifyAuth.js
const express = require('express')
const axios = require('axios')
const router = express.Router()

// Import utility functions for PKCE (Proof Key for Code Exchange)
// Verifique se o caminho para authHelpers está correto.
// Se '../utils/authHelpers' não funcionar, tente './utils/authHelpers' ou ajuste conforme a estrutura real.
const { generateRandomString, sha256, base64encode } = require('../utils/authHelpers')

// Load environment variables
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI // Backend's callback URL, registered with Spotify
const SPOTIFY_SCOPES = process.env.SPOTIFY_SCOPES // Scopes requested from Spotify (e.g., 'user-read-private user-read-email')
const FRONTEND_SPOTIFY_LOGIN_SUCCESS_URL = process.env.FRONTEND_SPOTIFY_LOGIN_SUCCESS_URL // Frontend URL to redirect after successful login

/**
 * /auth/spotify/login
 * Initiates the Spotify authorization flow using PKCE.
 * Generates a state and code_verifier, stores them in the session, and redirects to Spotify's authorization page.
 */
router.get('/login', (req, res) => {
  // Generate random strings for state and code_verifier
  const state = generateRandomString(16)
  const code_verifier = generateRandomString(128)

  // Calculate code_challenge from code_verifier (S256 method)
  const code_challenge = base64encode(sha256(code_verifier))

  // Store state and code_verifier in the session for verification during the callback
  req.session.code_verifier = code_verifier
  req.session.state = state

  // Construct the Spotify authorization URL
  const spotifyAuthUrl =
    'https://accounts.spotify.com/authorize?' + // Spotify authorization endpoint
    new URLSearchParams({
      response_type: 'code', // Request an authorization code
      client_id: CLIENT_ID,
      scope: SPOTIFY_SCOPES,
      redirect_uri: REDIRECT_URI, // The backend's callback URI
      state: state, // State parameter for CSRF protection
      code_challenge_method: 'S256', // PKCE method
      code_challenge: code_challenge, // PKCE code challenge
    }).toString()

  // Redirect the user's browser to the Spotify authorization page
  res.redirect(spotifyAuthUrl)
})

/**
 * /auth/spotify/callback
 * Spotify callback endpoint after user authorization.
 * Handles the authorization code received from Spotify, exchanges it for access/refresh tokens,
 * stores tokens in the session, and redirects to the frontend.
 */
router.get('/callback', async (req, res) => {
  const code = req.query.code || null
  const state = req.query.state || null
  const storedState = req.session.state || null
  const code_verifier = req.session.code_verifier || null

  if (state === null || state !== storedState || code_verifier === null) {
    console.error('Spotify Callback Error: State mismatch or code_verifier missing!')
    return res.redirect(
      `${FRONTEND_SPOTIFY_LOGIN_SUCCESS_URL}?` +
        new URLSearchParams({ error: 'state_mismatch' }).toString()
    )
  }

  delete req.session.state
  delete req.session.code_verifier

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    method: 'post',
    data: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      code_verifier: code_verifier,
    }).toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
    },
  }

  try {
    const response = await axios(authOptions)
    const { access_token, refresh_token, expires_in, token_type } = response.data

    req.session.access_token = access_token
    req.session.refresh_token = refresh_token
    req.session.expires_in = expires_in
    req.session.token_type = token_type

    req.session.save((err) => {
      if (err) {
        console.error('Erro ao guardar a sessão após callback de autenticação:', err)
        return res.redirect(
          `${FRONTEND_SPOTIFY_LOGIN_SUCCESS_URL}?` +
            new URLSearchParams({ error: 'session_save_failed' }).toString()
        )
      }
      console.log('Sessão guardada com sucesso no callback de autenticação.')

      console.log('\n--- AUTH CALLBACK SUCESSO ---')
      console.log('Session ID (Auth Callback):', req.sessionID)
      console.log(
        'Token guardado na sessão (primeiros 10 chars):',
        req.session.access_token
          ? req.session.access_token.substring(0, 10) + '...'
          : 'NÃO ENCONTRADO'
      )
      console.log(
        'Refresh Token guardado na sessão (primeiros 10 chars):',
        req.session.refresh_token
          ? req.session.refresh_token.substring(0, 10) + '...'
          : 'NÃO ENCONTRADO'
      )
      console.log('-----------------------------\n')

      const successRedirectUrl =
        `${FRONTEND_SPOTIFY_LOGIN_SUCCESS_URL}?` +
        new URLSearchParams({
          expires_in: expires_in,
        }).toString()

      return res.redirect(successRedirectUrl)
    })
  } catch (error) {
    console.error(
      'Spotify Token Exchange Error:',
      error.response ? error.response.data : error.message
    )
    return res.redirect(
      `${FRONTEND_SPOTIFY_LOGIN_SUCCESS_URL}?` +
        new URLSearchParams({
          error: 'token_exchange_failed',
        }).toString()
    )
  }
})

// POST /auth/spotify/logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao destruir a sessão durante o logout:', err)
      res.clearCookie('connect.sid', {
        domain: 'spotify-clone.local',
        path: '/',
        secure: true,
        sameSite: 'None',
      })
      return res
        .status(500)
        .json({ message: 'Não foi possível fazer logout devido a um erro na sessão.' })
    }

    res.clearCookie('connect.sid', {
      domain: 'spotify-clone.local',
      path: '/',
      secure: true,
      sameSite: 'None',
    })

    res.status(200).json({ message: 'Deslogado com sucesso.' })
    console.log('Backend: Sessão destruída e cookie limpo.')
  })
})

module.exports = router