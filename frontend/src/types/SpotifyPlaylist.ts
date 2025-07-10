import { TSpotifyTrack } from "@/types/SpotifyTrack"

export interface TSpotifyPlaylist {
  collaborative: boolean
  description: string | null
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  images: Array<{
    height: number | null
    url: string
    width: number | null
  }>
  name: string
  owner: {
    display_name: string
    external_urls: {
      spotify: string
    }
    href: string
    id: string
    type: string
    uri: string
  }
  public: boolean
  snapshot_id: string
  tracks: {
    href: string
    previous: string
    next: string
    items: TSpotifyTrack[]
    total: number
    limit: number
    offset: number
  }
  type: string
  uri: string
}