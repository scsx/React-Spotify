//Retrieves the Spotify access token from the current session.
const getAccessTokenFromSession = (req) => {
  // Ensure req.session exists and contains the access_token
  return req.session && req.session.access_token ? req.session.access_token : null
}

// Retrieves the Spotify refresh token from the current session.
const getRefreshTokenFromSession = (req) => {
  // Ensure req.session exists and contains the refresh_token
  return req.session && req.session.refresh_token ? req.session.refresh_token : null
}

module.exports = {
  getAccessTokenFromSession,
  getRefreshTokenFromSession,
}
