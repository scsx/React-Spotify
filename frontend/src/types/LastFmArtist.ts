import { TLastFmSimilarArtist } from './LastFmSimilarArtist'
import { TLastFmTag } from './LastFmTag'

export interface TLastFmArtist {
  name: string
  mbid: string
  url: string
  image: {
    small: string
    medium: string
    large: string
  }
  streamable: string
  stats: {
    listeners: string
    plays: string
  }
  similar: TLastFmSimilarArtist[]
  tags: {
    tag: TLastFmTag[]
  }
  bio: {
    published: string
    summary: string
    content: string
  }
}

export interface TLastFmArtistGetInfoResponse {
  artist: TLastFmArtist
}

export interface TLastFmArtistGetInfoError {
  error: number
  message: string
}
