export type TTheme = 'dark' | 'light'

export type TGenericPagination = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onPrevious: () => void
  onNext: () => void
  isPreviousDisabled?: boolean
  isNextDisabled?: boolean
}

export type TFavoritesStyleBreakdown = {
  style: string
  percentage: number
  totalTracks: number
}

export type TErrorDisplay = {
  title?: string
  message: string
  details?: string
}
