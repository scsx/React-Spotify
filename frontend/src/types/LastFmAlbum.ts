import { TLastFmTag } from '@/types/LastFmTag'
import { TLastFmTrack } from '@/types/LastFmTrack'

export type TLastFmAlbumInfo = {
  name: string
  artist: string
  id: string
  mbid: string
  url: string
  releasedate: string

  image:
    | Array<{
        '#text': string
        size: 'small' | 'medium' | 'large' | 'extralarge'
      }>
    | string

  listeners: string
  playcount: string

  wiki?: {
    published: string
    summary: string
    content: string
  }

  tags: {
    tag: TLastFmTag[]
  }

  tracks: TLastFmTrack[]
}

export interface TLastFmAlbumGetInfoResponse {
  album: TLastFmAlbumInfo
}

export interface TLastFmAlbumGetInfoError {
  error: number
  message: string

  details?: string | number
}
