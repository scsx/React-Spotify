import { TGeniusLyricsResult, TGeniusSearchHit, TSpotifyTrackInput } from '@/types/Genius'

import { normalizeTrackForGeniusSearch } from '@/lib/normalize-track-for-genius-search'
import { pickBestGeniusMatch } from '@/lib/pick-best-genius-match'

export async function getGeniusLyrics(track: TSpotifyTrackInput): Promise<TGeniusLyricsResult> {
  // 1. Normalize spotify track name and artist.
  // E.g. "One More Time (Radio Edit) - 2000 Remaster" -> "One More Time"
  // E.g. "["Daft Punk", "Pharrell Williams", "Nile Rodgers"]" -> "daft punk"
  const normalized = normalizeTrackForGeniusSearch(track)

  // 2. Search genius.
  const query = `${normalized.normalizedTitle} ${normalized.normalizedArtist}`

  const searchRes = await fetch(`/api/genius/search?q=${encodeURIComponent(query)}`, {
    credentials: 'include',
  })

  if (searchRes.status === 401) {
    throw new Error('GENIUS_401')
  }

  if (!searchRes.ok) {
    throw new Error('GENIUS_FAILED')
  }

  const hits: TGeniusSearchHit[] = await searchRes.json()

  // 3. Score candidates (compare all the search results and pick the best one).
  const bestHit = pickBestGeniusMatch(hits, normalized.normalizedTitle, normalized.normalizedArtist)

  // 4. Fetch lyrics.
  if (!bestHit) {
    return {
      lyrics: null,
      url: null,
      geniusSongId: null,
      matchedTitle: null,
      matchedArtist: null,
    }
  }

  const lyricsRes = await fetch(`/api/genius/lyrics/${bestHit.result.id}`, {
    credentials: 'include',
  })

  if (lyricsRes.status === 401) {
    throw new Error('GENIUS_401')
  }

  if (lyricsRes.status === 404) {
    return {
      lyrics: null,
      url: null,
      geniusSongId: bestHit.result.id,
      matchedTitle: bestHit.result.title,
      matchedArtist: bestHit.result.primary_artist.name,
    }
  }

  if (!lyricsRes.ok) {
    throw new Error('GENIUS_FAILED')
  }

  const data = await lyricsRes.json()

  return {
    lyrics: data.lyrics,
    url: data.url,
    geniusSongId: bestHit.result.id,
    matchedTitle: bestHit.result.title,
    matchedArtist: bestHit.result.primary_artist.name,
  }
}
