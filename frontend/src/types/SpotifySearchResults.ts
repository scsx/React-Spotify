import { SpotifyArtist } from "./SpotifyArtist"
import { SpotifyTrack } from "./SpotifyTrack"

export interface SpotifySearchResults {
  items: SpotifyArtist[] | SpotifyTrack[]
  nextPage: string
  prevPage: string
  total: number
}