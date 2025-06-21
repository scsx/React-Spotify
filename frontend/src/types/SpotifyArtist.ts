import { TSpotifyImage } from './SpotifyImage'

export interface TSpotifyArtist {
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
  images: TSpotifyImage[]
  name: string
  popularity: number
  type: string
  uri: string
}
