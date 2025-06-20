import { SpotifyArtist } from './SpotifyArtist'
import { SpotifyImage } from './SpotifyImage'
import { SpotifyTrack } from './SpotifyTrack'

export interface SpotifyAlbum {
  album_type: string
  total_tracks: number
  available_markets: string[]
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  images: SpotifyImage[]
  name: string
  release_date: string
  release_date_precision: string
  restrictions: {
    reason: string
  }
  type: string
  uri: string
  artists: SpotifyArtist[]
  tracks: {
    href: string
    limit: number
    next: string
    offset: number
    previous: string
    total: number
    items: SpotifyTrack[]
  }
  copyrights: {
    text: string
    type: string
  }[]
  external_ids: {
    isrc: string
    ean: string
    upc: string
  }
  genres: string[]
  label: string
  popularity: number
}
