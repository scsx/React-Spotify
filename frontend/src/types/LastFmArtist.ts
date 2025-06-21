import { TLastFmSimilarArtist } from './LastFmSimilarArtist'
import { TLastFmTag } from './LastFmTag'

export interface LastFmArtist {
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
  tags: TLastFmTag[]
  bio: {
    published: string
    summary: string
    content: string
  }
}
