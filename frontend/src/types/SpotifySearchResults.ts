import { TSpotifyArtist } from './SpotifyArtist'
import { TSpotifyTrack } from './SpotifyTrack'

export interface TSpotifySearchResults {
  items: TSpotifyArtist[] | TSpotifyTrack[]
  nextPage: string
  prevPage: string
  total: number
}
