export interface TSpotifyUser {
  display_name: string
  id: string
  email?: string // Requires the 'user-read-email' scope
  external_urls: { spotify: string }
  followers: { href: string | null; total: number }
  href: string
  images: Array<{ url: string; height: number | null; width: number | null }>
  product?: string // Requires the 'user-read-private' scope
  type: 'user'
  uri: string
  country?: string // Requires the 'user-read-private' scope
  explicit_content?: { filter_enabled: boolean; filter_locked: boolean }
}
