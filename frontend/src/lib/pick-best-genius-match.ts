import { TGeniusSearchHit } from '@/types/Genius'

import { normalizeString } from '@/lib/normalise-string'

const JUNK_WORDS = /\b(remaster(ed)?|live|edit|version|mix|mono|stereo|deluxe|bonus|remix)\b/gi

function cleanForCompare(str: string): string {
  return normalizeString(
    str
      .replace(/\(.*?\)/g, '')
      .replace(/\s-\s.*$/g, '')
      .replace(JUNK_WORDS, '')
      .replace(/\s+/g, ' ')
      .trim()
  )
}

function scoreHit(
  hit: TGeniusSearchHit,
  normalizedTitle: string,
  normalizedArtist: string
): number {
  const hitTitle = cleanForCompare(hit.result.title)
  const hitArtist = cleanForCompare(hit.result.primary_artist.name)

  let score = 0

  if (hitTitle === normalizedTitle) score += 5
  else if (hitTitle.includes(normalizedTitle)) score += 3

  if (hitArtist === normalizedArtist) score += 5
  else if (hitArtist.includes(normalizedArtist)) score += 3
  else score -= 5

  if (/(remix|live|cover|karaoke|version)/i.test(hit.result.title)) {
    score -= 10
  }

  return score
}

export function pickBestGeniusMatch(
  hits: TGeniusSearchHit[],
  normalizedTitle: string,
  normalizedArtist: string
): TGeniusSearchHit | null {
  const scored = hits
    .map((hit) => ({
      hit,
      score: scoreHit(hit, normalizedTitle, normalizedArtist),
    }))
    .sort((a, b) => b.score - a.score)

  return scored[0]?.score >= 5 ? scored[0].hit : null
}
