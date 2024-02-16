import { SpotifyImage } from "./SpotifyImage"
import { SpotifyArtist } from "./SpotifyArtist"

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
}
