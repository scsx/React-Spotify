// .env vars and link for the Implicit Grant Flow.
const VITE_SPOTIFY_CLIENT_ID = process.env.VITE_SPOTIFY_CLIENT_ID
const VITE_SPOTIFY_REDIRECT_URI = process.env.VITE_SPOTIFY_REDIRECT_URI
const VITE_SPOTIFY_AUTH_ENDPOINT = process.env.VITE_SPOTIFY_AUTH_ENDPOINT
const VITE_SPOTIFY_RESPONSE_TYPE = process.env.VITE_SPOTIFY_RESPONSE_TYPE

if (
  !VITE_SPOTIFY_CLIENT_ID ||
  !VITE_SPOTIFY_REDIRECT_URI ||
  !VITE_SPOTIFY_AUTH_ENDPOINT ||
  !VITE_SPOTIFY_RESPONSE_TYPE
) {
  throw new Error('Missing required environment variables for Spotify authentication.')
}

const authLink = `${VITE_SPOTIFY_AUTH_ENDPOINT}?client_id=${VITE_SPOTIFY_CLIENT_ID}&redirect_uri=${VITE_SPOTIFY_REDIRECT_URI}&response_type=${VITE_SPOTIFY_RESPONSE_TYPE}`

export default authLink
