import { TSpotifyTrackInput } from '@/types/Genius'

import { normalizeString } from '@/lib/normalise-string'

type TNormalizedTrack = {
  originalTitle: string
  originalArtist: string
  normalizedTitle: string
  normalizedArtist: string
}

const JUNK_WORDS = /\b(remaster(ed)?|live|edit|version|mix|mono|stereo|deluxe|bonus|remix)\b/gi

export function normalizeTrackForGeniusSearch(track: TSpotifyTrackInput): TNormalizedTrack {
  const originalTitle = track.name
  const originalArtist = track.artists[0]?.name || ''

  const title: string = originalTitle
    .replace(/\(.*?\)/g, '')
    .replace(/\s-\s.*$/g, '')
    .replace(JUNK_WORDS, '')
    .replace(/\s+/g, ' ')
    .trim()

  const artist: string = originalArtist.replace(/\b(feat\.?|ft\.?|with)\b.*$/gi, '').trim()

  return {
    originalTitle,
    originalArtist,
    normalizedTitle: normalizeString(title),
    normalizedArtist: normalizeString(artist),
  }
}
