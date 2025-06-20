import { SpotifyImage } from './SpotifyImage'

export interface SpotifyArtist {
  external_urls: {
    spotify: string
  }
  followers: {
    href: string
    total: number
  }
  genres: string[]
  href: string
  id: string
  images: SpotifyImage[]
  name: string
  popularity: number
  type: string
  uri: string
}
