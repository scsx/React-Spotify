import { TSpotifyAlbum } from './SpotifyAlbum'
import { TSpotifyArtist } from './SpotifyArtist'

export interface TSpotifyTrack {
  album: TSpotifyAlbum
  artists: TSpotifyArtist[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: {
    isrc: string
    ean: string
    upc: string
  }
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  is_playable: boolean
  linked_from: Record<string, unknown>
  restrictions: {
    reason: string
  }
  name: string
  popularity: number
  preview_url: string
  track_number: number
  type: string
  uri: string
  is_local: boolean
}
