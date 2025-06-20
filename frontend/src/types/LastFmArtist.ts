import { LastFmSimilarArtist } from './LastFmSimilarArtist'
import { LastFmTag } from './LastFmTag'

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
  similar: LastFmSimilarArtist[]
  tags: LastFmTag[]
  bio: {
    published: string
    summary: string
    content: string
  }
}
