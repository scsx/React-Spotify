export type TDiscogsMember = {
  id: number
  name: string
  resource_url: string
  active?: boolean
  thumbnail_url?: string
}

export type TDiscogsBandMembersResponse = {
  artist: string
  id: number
  members: TDiscogsMember[]
  totalMembers: number
  url: string | null
}

export type TDiscogsBandMembersError = {
  error: string
  details?: string
}
