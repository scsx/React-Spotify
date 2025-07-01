import React, { useCallback, useEffect, useState } from 'react'

import { TSpotifyPlaylist } from '@/types/SpotifyPlaylist'

import CardPlaylist from '@/components/Playlists/CardPlaylist'
import Text from '@/components/Text'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
// Importa os componentes de paginação do shadcn/ui
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'

// Removida CardHeader, CardTitle se não usadas diretamente

import { getSpotifyUserPlaylists } from '@/services/spotify/getSpotifyUserPlaylists'

// Para esqueletos de carregamento

const PLAYLISTS_LIMIT = 20 // Um limite menor pode ser melhor para paginação visual

const UserPlaylists: React.FC = () => {
  const [playlists, setPlaylists] = useState<TSpotifyPlaylist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1) // Novo estado para a página atual
  const [totalPlaylists, setTotalPlaylists] = useState<number | null>(null) // Total de playlists do Spotify

  const totalPages = totalPlaylists ? Math.ceil(totalPlaylists / PLAYLISTS_LIMIT) : 1

  const fetchPlaylists = useCallback(
    async (page: number) => {
      setLoading(true)
      setError(null) // Limpa o erro ao tentar carregar uma nova página
      const offset = (page - 1) * PLAYLISTS_LIMIT // Calcula o offset com base na página

      try {
        const data = await getSpotifyUserPlaylists({ limit: PLAYLISTS_LIMIT, offset: offset })

        console.log(`Fetched playlists for page ${page}:`, data)

        // Substitui as playlists existentes pelas novas da página
        setPlaylists(data.items)

        // Define o total de playlists se ainda não tiver sido definido
        if (totalPlaylists === null) {
          setTotalPlaylists(data.total)
        }
      } catch (err: any) {
        console.error('Failed to fetch user playlists:', err)
        setError('Falha ao carregar playlists. Por favor, tente novamente mais tarde.')
        setPlaylists([]) // Limpa as playlists em caso de erro
      } finally {
        setLoading(false)
      }
    },
    [totalPlaylists]
  ) // totalPlaylists na dependência para garantir que é atualizado na primeira chamada

  useEffect(() => {
    // Carrega as playlists para a página atual sempre que currentPage muda
    fetchPlaylists(currentPage)
  }, [currentPage, fetchPlaylists])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page)
    }
  }

  const handlePreviousPage = () => {
    handlePageChange(currentPage - 1)
  }

  const handleNextPage = () => {
    handlePageChange(currentPage + 1)
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Text variant="h2">{error}</Text>
        <Button
          onClick={() => {
            setPlaylists([])
            setCurrentPage(1) // Reinicia para a primeira página
            setTotalPlaylists(null)
            setError(null)
          }}
        >
          Tentar Novamente
        </Button>
      </div>
    )
  }

  // Estado de carregamento com esqueletos
  if (loading) {
    return (
      <div className="container mx-auto py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: PLAYLISTS_LIMIT }).map((_, index) => (
          <Card key={index} className="flex flex-col items-center p-4">
            <Skeleton className="w-full h-[150px] rounded-md mb-4" />
            <Skeleton className="w-3/4 h-6 rounded-md mb-2" />
            <Skeleton className="w-1/2 h-4 rounded-md" />
          </Card>
        ))}
      </div>
    )
  }

  // Se não encontrou playlists após o carregamento
  if (playlists.length === 0 && !loading && !error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Text variant="h2">Nenhuma playlist encontrada.</Text>
        <Text variant="paragraph">Parece que não tens playlists no Spotify.</Text>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {playlists.map((playlist) => (
          <CardPlaylist key={playlist.id} playlist={playlist} />
        ))}
      </div>

      {/* Componentes de Paginação */}
      {totalPlaylists &&
        totalPlaylists > PLAYLISTS_LIMIT && ( // Mostra paginação apenas se houver mais de uma página
          <div className="flex justify-center mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={handlePreviousPage} disabled={currentPage === 1} />
                </PaginationItem>

                {/* Lógica para mostrar alguns números de página ao redor da página atual */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
                  // Exibe apenas um subconjunto de páginas para evitar muitos botões
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => handlePageChange(pageNumber)}
                          isActive={pageNumber === currentPage}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  }
                  // Adiciona reticências se houver lacunas grandes
                  if (
                    (pageNumber === currentPage - 3 && currentPage > 3) ||
                    (pageNumber === currentPage + 3 && currentPage < totalPages - 2)
                  ) {
                    return <PaginationItem key={pageNumber}>...</PaginationItem>
                  }
                  return null
                })}

                <PaginationItem>
                  <PaginationNext onClick={handleNextPage} disabled={currentPage === totalPages} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
    </div>
  )
}

export default UserPlaylists
