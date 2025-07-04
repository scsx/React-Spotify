import React from 'react'

import { TGenericPagination } from '@/types/General'
import { twMerge } from 'tailwind-merge'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const GenericPagination: React.FC<TGenericPagination> = ({
  currentPage,
  totalPages,
  onPageChange,
  onPrevious,
  onNext,
}) => {
  // Lógica para determinar quais números de página exibir
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5 // Por exemplo, 5 botões de página visíveis (incluindo 1 e totalPages)
    const halfRange = Math.floor(maxPagesToShow / 2)

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Sempre inclui a primeira página
      pages.push(1)

      // Lógica para as reticências e páginas centrais
      if (currentPage > halfRange + 1) {
        pages.push('...') // Reticências no início
      }

      for (
        let i = Math.max(2, currentPage - halfRange);
        i <= Math.min(totalPages - 1, currentPage + halfRange);
        i++
      ) {
        pages.push(i)
      }

      if (currentPage < totalPages - halfRange) {
        pages.push('...') // Reticências no final
      }

      // Sempre inclui a última página, se não for a primeira e não estiver já no range
      if (!pages.includes(totalPages)) {
        pages.push(totalPages)
      }
    }
    return pages
  }

  const pagesToRender = getPageNumbers()

  return (
    <Pagination className="mt-8">
      {' '}
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={onPrevious} className="cursor-pointer hover:bg-primary" />
        </PaginationItem>

        {pagesToRender.map((pageNumber, index) =>
          typeof pageNumber === 'string' ? (
            <PaginationItem key={`ellipsis-${index}`}>...</PaginationItem>
          ) : (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                onClick={() => onPageChange(pageNumber)}
                isActive={pageNumber === currentPage}
                className={twMerge(
                  'cursor-pointer',
                  'hover:bg-primary',
                  pageNumber === currentPage && 'bg-primary text-primary-foreground'
                )}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext onClick={onNext} className="cursor-pointer hover:bg-primary" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default GenericPagination
