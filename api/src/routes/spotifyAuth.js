const express = require('express')
const axios = require('axios')
const router = express.Router()

// Import utility functions for PKCE (Proof Key for Code Exchange)
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
  const code = req.query.code || null // Authorization code from Spotify
  const state = req.query.state || null // State received from Spotify
  const storedState = req.session.state || null // State stored in session
  const code_verifier = req.session.code_verifier || null // Code verifier stored in session

  // Validate the state parameter to prevent CSRF attacks and ensure code_verifier exists
  if (state === null || state !== storedState || code_verifier === null) {
    console.error('Spotify Callback Error: State mismatch or code_verifier missing!')
    // Redirect to frontend with an error hash if validation fails
    const redirectUrl = '/#' + new URLSearchParams({ error: 'state_mismatch' }).toString()
    res.redirect(redirectUrl)
    req.session.destroy() // Destroy session to prevent further issues
    return
  }

  // Clean up session variables after successful state validation
  delete req.session.state
  delete req.session.code_verifier

  // Configuration for the token exchange request to Spotify
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token', // Spotify token endpoint
    method: 'post',
    data: new URLSearchParams({
      grant_type: 'authorization_code', // Exchange authorization code for tokens
      code: code, // The authorization code received from Spotify
      redirect_uri: REDIRECT_URI, // Must match the one used in the /login step
      client_id: CLIENT_ID,
      code_verifier: code_verifier, // PKCE code verifier
    }).toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      // Basic authorization header for client credentials
      Authorization: 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
    },
  }

  try {
    // Make the POST request to Spotify's token endpoint
    const response = await axios(authOptions)
    // Destructure the received tokens and expiration time
    const { access_token, refresh_token, expires_in, token_type } = response.data

    // --- SUCCESSFUL TOKEN EXCHANGE ---
    // Store access_token and refresh_token in the backend session
    // The refresh_token is crucial for obtaining new access tokens without re-authenticating the user.
    // For production, refresh_token should ideally be stored securely (e.g., in a database)
    // rather than just in the session, for persistent access across server restarts.
    req.session.access_token = access_token
    req.session.refresh_token = refresh_token
    req.session.expires_in = expires_in
    req.session.token_type = token_type

    // Construct the success URL to redirect back to the frontend
    const successRedirectUrl =
      `${FRONTEND_SPOTIFY_LOGIN_SUCCESS_URL}?` +
      new URLSearchParams({
        access_token: access_token,
        expires_in: expires_in, // Include expires_in for frontend to manage token expiry
        // Do NOT send refresh_token to the frontend in production!
        // For development/debugging, you might uncomment this, but remove for deployment:
        // refresh_token: refresh_token
      }).toString()

    // Redirect the user's browser to the frontend success URL
    res.redirect(successRedirectUrl)
  } catch (error) {
    // Handle errors during the token exchange process
    console.error(
      'Spotify Token Exchange Error:',
      error.response ? error.response.data : error.message
    )
    // Redirect to frontend with an error hash if token exchange fails
    res.redirect(
      '/#' +
        new URLSearchParams({
          error: 'token_exchange_failed',
        }).toString()
    )
  }
})

module.exports = router
