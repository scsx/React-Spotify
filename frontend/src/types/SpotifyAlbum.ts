import { TSpotifyArtist } from './SpotifyArtist'
import { TSpotifyImage } from './SpotifyImage'
import { TSpotifyTrack } from './SpotifyTrack'

export interface TSpotifyAlbum {
  album_type: string
  total_tracks: number
  available_markets: string[]
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  images: TSpotifyImage[]
  name: string
  release_date: string
  release_date_precision: string
  restrictions: {
    reason: string
  }
  type: string
  uri: string
  artists: TSpotifyArtist[]
  tracks: {
    href: string
    limit: number
    next: string
    offset: number
    previous: string
    total: number
    items: TSpotifyTrack[]
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
