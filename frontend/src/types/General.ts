export type TTheme = 'dark' | 'light'

// Context: Token from localStorage.
export interface TSpotifyTokenData {
  accessToken: string
  expiresIn: number
  tokenType: string
  obtainedAt: number
}

// Context: Token to be provided.
export interface TTokenContextValue {
  tokenInfo: TSpotifyTokenData | null
  setToken: (token: TSpotifyTokenData | null) => void
  isValid: boolean
  authLink: string
  logout: () => void
}

export interface TGenericPagination {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onPrevious: () => void
  onNext: () => void
}
