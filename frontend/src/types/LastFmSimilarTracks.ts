import { TLastFmTrack } from '@/types/LastFmTrack'

export type TLastFmSimilarTracksResponse = {
  similartracks: {
    track: TLastFmTrack[]
    '@attr'?: {
      artist: string
      track: string
    }
  }
}

export type TLastFmSimilarTracksError = {
  error: number
  message: string
  details?: string | number
}
