export type TDiscogsMember = {
  id: number
  name: string
  resource_url: string
  active?: boolean
  thumbnail_url?: string
}

export type TDiscogsArtistImage = {
  type: 'primary' | 'secondary' | string
  height: number
  width: number
  resource_url: string
  uri: string
  uri150: string
}

export type TDiscogsArtist = {
  id: number
  name: string
  profile: string | null
  images: TDiscogsArtistImage[]
  urls: string[]
  members: TDiscogsMember[]
  resource_url: string
}

export type TDiscogsBandMembersResponse = {
  artist: string
  id: number
  members: TDiscogsMember[]
  totalMembers: number
  url: string | null
}

export type TDiscogsError = {
  error: string
  details?: string
}
