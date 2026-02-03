const { getAccessTokenFromSession } = require('./sessionHelpers')

const requireSpotifyAccessToken = (req, res, next) => {
  const accessToken = getAccessTokenFromSession(req)
  if (!accessToken) {
    return res.status(401).json({ error: 'No Spotify access token provided. Please log in.' })
  }
  req.spotifyAccessToken = accessToken
  next()
}

module.exports = { requireSpotifyAccessToken }
