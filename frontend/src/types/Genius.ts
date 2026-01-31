export type TSpotifyTrackInput = {
  id: string
  name: string
  artists: { id: string; name: string }[]
}

export type TGeniusSearchHit = {
  result: {
    id: number
    title: string
    primary_artist: {
      name: string
    }
    url: string
  }
}

export type TGeniusLyricsResult = {
  lyrics: string | null
  url: string | null
  geniusSongId: number | null
  matchedTitle: string | null
  matchedArtist: string | null
}
