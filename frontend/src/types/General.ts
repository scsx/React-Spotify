export type TTheme = 'dark' | 'light'

export interface TGenericPagination {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onPrevious: () => void
  onNext: () => void
}

export interface TFavoritesStyleBreakdown {
  style: string
  percentage: number
  totalTracks: number
}
