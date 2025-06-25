import { TSpotifyAlbum } from './SpotifyAlbum'
import { TSpotifyArtist } from './SpotifyArtist'
import { TSpotifyTrack } from './SpotifyTrack'

export interface TSpotifyPagingObject<T> {
  href: string
  items: T[]
  limit: number
  next: string | null
  offset: number
  previous: string | null
  total: number
}

export interface TSpotifySearchResults {
  tracks?: TSpotifyPagingObject<TSpotifyTrack>
  artists?: TSpotifyPagingObject<TSpotifyArtist>
  albums?: TSpotifyPagingObject<TSpotifyAlbum>
  // Non-existing so far.
  // playlists?: TSpotifyPagingObject<TSpotifyPlaylist>
  // shows?: TSpotifyPagingObject<TSpotifyShow>
  // episodes?: TSpotifyPagingObject<TSpotifyEpisode>
  //audiobooks?: TSpotifyPagingObject<TSpotifyAudiobook>
}
