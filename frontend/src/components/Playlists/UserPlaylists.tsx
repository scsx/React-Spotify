import React, { useCallback, useEffect, useState } from 'react'

import { TSpotifyPlaylist } from '@/types/SpotifyPlaylist'

import GenericPagination from '@/components/GenericPagination'
import CardPlaylist from '@/components/Playlists/CardPlaylist'
import Text from '@/components/Text'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { getSpotifyUserPlaylists } from '@/services/spotify/getSpotifyUserPlaylists'

const PLAYLISTS_LIMIT = 40

const UserPlaylists: React.FC = () => {
  const [playlists, setPlaylists] = useState<TSpotifyPlaylist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPlaylists, setTotalPlaylists] = useState<number | null>(null)

  const totalPages = totalPlaylists ? Math.ceil(totalPlaylists / PLAYLISTS_LIMIT) : 1

  const fetchPlaylists = useCallback(
    async (page: number) => {
      setLoading(true)
      setError(null)
      const offset = (page - 1) * PLAYLISTS_LIMIT

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
        setPlaylists([])
      } finally {
        setLoading(false)
      }
    },
    [totalPlaylists]
  )

  useEffect(() => {
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
            setCurrentPage(1)
            setTotalPlaylists(null)
            setError(null)
          }}
        >
          Tentar Novamente
        </Button>
      </div>
    )
  }

  // Loading with skeletons.
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

  // No playlists found.
  if (playlists.length === 0 && !loading && !error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Text variant="h2">Playlists not found.</Text>
        <Text variant="paragraph">You have no playlists on Spotify.</Text>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-5 gap-6">
        {playlists.map((playlist) => (
          <CardPlaylist key={playlist.id} playlist={playlist} light />
        ))}
      </div>

      {totalPlaylists && totalPlaylists > PLAYLISTS_LIMIT && (
        <GenericPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onPrevious={handlePreviousPage}
          onNext={handleNextPage}
        />
      )}
    </div>
  )
}

export default UserPlaylists
