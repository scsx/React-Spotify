const express = require('express')
const axios = require('axios')
const router = express.Router()

const { generateRandomString, sha256, base64encode } = require('../utils/authHelpers')

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI
const SPOTIFY_SCOPES = process.env.SPOTIFY_SCOPES
const FRONTEND_HOST = process.env.FRONTEND_HOST

// Function to close the login window on the frontend after successful login or error.
const sendPopupCloseScript = (res, error = null) => {
  let message = 'Login successful. You can close this window.'
  let script = 'window.close();'

  if (error) {
    message = `An error occurred: ${error}. Please try again.`
  }

  res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${error ? 'Login Error' : 'Spotify Login'}</title>
            <script>
                ${script}
            </script>
        </head>
        <body>
            <p>${message}</p>
        </body>
        </html>
    `)
}

/**
 * /auth/spotify/login
 * Initiates the Spotify authorization flow using PKCE.
 */
router.get('/login', (req, res) => {
  const state = generateRandomString(16)
  const code_verifier = generateRandomString(128)
  const code_challenge = base64encode(sha256(code_verifier))

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

/**
 * /auth/spotify/callback
 * Spotify callback endpoint after user authorization.
 */
router.get('/callback', async (req, res) => {
  const code = req.query.code || null
  const state = req.query.state || null
  const storedState = req.session.state || null
  const code_verifier = req.session.code_verifier || null

  if (state === null || state !== storedState || code_verifier === null) {
    console.error('Spotify Callback Error: State mismatch or code_verifier missing.')
    return sendPopupCloseScript(res, 'state_mismatch')
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
        console.error('Error saving session after authentication callback:', err)
        return sendPopupCloseScript(res, 'session_save_failed')
      }
      // console.log('Session saved successfully in authentication callback.') // Removed verbose log

      sendPopupCloseScript(res)
    })
  } catch (error) {
    console.error(
      'Spotify Token Exchange Error:',
      error.response ? error.response.data : error.message
    )
    sendPopupCloseScript(res, 'token_exchange_failed')
  }
})

/**
 * /auth/spotify/logout
 * Destroys the user session and clears authentication cookies.
 */
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session during logout:', err)
      // Ensure cookie is cleared even if session destroy fails for consistency
      res.clearCookie('connect.sid', {
        domain: FRONTEND_HOST,
        path: '/',
        secure: true,
        sameSite: 'None',
      })
      return res.status(500).json({ message: 'Could not log out due to a session error.' })
    }

    res.clearCookie('connect.sid', {
      domain: FRONTEND_HOST,
      path: '/',
      secure: true,
      sameSite: 'None',
    })

    res.status(200).json({ message: 'Successfully logged out.' })
    // console.log('Backend: Session destroyed and cookie cleared.') // Removed verbose log
  })
})

module.exports = router
