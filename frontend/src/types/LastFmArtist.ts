import { TLastFmSimilarArtist } from './LastFmSimilarArtist'
import { TLastFmTag } from './LastFmTag'

export type TLastFmArtist = {
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
  similar: {
    artist: TLastFmSimilarArtist[]
  }
  tags: {
    tag: TLastFmTag[]
  }
  bio: {
    published: string
    summary: string
    content: string
  }
}

export type TLastFmArtistGetInfoResponse = {
  artist: TLastFmArtist
}

export type TLastFmArtistGetInfoError = {
  error: number
  message: string
}
