// .env vars and link for the Implicit Grant Flow.
const VITE_LASTFM_KEY = process.env.VITE_LASTFM_KEY

if (
  !VITE_LASTFM_KEY
) {
  throw new Error('Missing required environment variable for LastFM requests.')
}

const lastFMKey = VITE_LASTFM_KEY

export default lastFMKey
