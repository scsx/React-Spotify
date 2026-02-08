export type TLastFmTrack = {
  name: string
  duration: string
  mbid: string
  url: string
  playcount?: string
  match?: number
  streamable?: {
    '#text': string
    fulltrack: string
  }
  image?: Array<{
    '#text': string
    size: string
  }>
  artist: {
    name: string
    mbid: string
    url: string
  }
}
