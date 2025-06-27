const express = require('express')
const axios = require('axios')
const router = express.Router()

const { generateRandomString, sha256, base64encode } = require('../utils/authHelpers')

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI // Backend's callback URL
const SPOTIFY_SCOPES = process.env.SPOTIFY_SCOPES
const FRONTEND_SPOTIFY_LOGIN_SUCCESS_URL = process.env.FRONTEND_SPOTIFY_LOGIN_SUCCESS_URL // Frontend URL to redirect after successful login

// Initiate Spotify authorization flow
router.get('/login', (req, res) => {
  const state = generateRandomString(16)
  const code_verifier = generateRandomString(128)
  const code_challenge = base64encode(sha256(code_verifier))

  console.log('DEBUG: /login - state stored in session:', req.session.state)
  console.log('DEBUG: /login - code_verifier stored in session:', req.session.code_verifier)
  console.log('DEBUG: /login - session ID:', req.sessionID)

  req.session.code_verifier = code_verifier
  req.session.state = state

  const spotifyAuthUrl =
    'https://accounts.spotify.com/authorize?' +
    new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: SPOTIFY_SCOPES,
      redirect_uri: REDIRECT_URI,
      state: state,
      code_challenge_method: 'S256',
      code_challenge: code_challenge,
    }).toString()

  res.redirect(spotifyAuthUrl)
})

// Spotify callback endpoint after user authorization
router.get('/callback', async (req, res) => {
  const code = req.query.code || null
  const state = req.query.state || null
  const storedState = req.session.state || null
  const code_verifier = req.session.code_verifier || null

  console.log('DEBUG: /callback - received state from Spotify URL:', state)
  console.log('DEBUG: /callback - storedState from session:', storedState)
  console.log('DEBUG: /callback - code_verifier from session:', code_verifier)
  console.log('DEBUG: /callback - current session ID:', req.sessionID)
  console.log('DEBUG: /callback - Request headers for cookies:', req.headers.cookie)

  if (state === null || state !== storedState || code_verifier === null) {
    console.error('State mismatch or code_verifier missing!')
    const redirectUrl = '/#' + new URLSearchParams({ error: 'state_mismatch' }).toString()

    console.log('Backend Debug: Redirecionando para Frontend (ERRO - State Mismatch):', redirectUrl)
    res.redirect(redirectUrl)
    req.session.destroy()
    return
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
    const { access_token, refresh_token, expires_in } = response.data

    // --- SUCCESS ---
    // At this point, you have the access_token and refresh_token.
    // The refresh_token should be securely stored (e.g., in a database) for persistent access.
    // The access_token should be sent to the frontend.

    console.log('Access Token:', access_token)
    console.log('Refresh Token:', refresh_token) // Logged for development, do not expose in production logs
    const successRedirectUrl =
      `${FRONTEND_SPOTIFY_LOGIN_SUCCESS_URL}?` +
      new URLSearchParams({
        access_token: access_token,
        expires_in: expires_in, // É bom enviar expires_in para o frontend
        // refresh_token: refresh_token // Não enviar refresh_token para o frontend em produção!
      }).toString()

    console.log('Backend Debug: Redirecionando para Frontend (SUCESSO):', successRedirectUrl)
    res.redirect(successRedirectUrl)

    // Redirect to frontend.
    // For production, consider sending access_token via a secure HTTP-only cookie
    // or a dedicated API response, not directly in the URL fragment.
    // Refresh token should NEVER be sent to the frontend.
  } catch (error) {
    console.error(
      'Error during token exchange:',
      error.response ? error.response.data : error.message
    )
    res.redirect(
      '/#' +
        new URLSearchParams({
          error: 'token_exchange_failed',
        }).toString()
    )
  }
})

module.exports = router
