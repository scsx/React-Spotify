import React, { useCallback, useEffect, useState } from 'react'

import { TSpotifyPlaylist } from '@/types/SpotifyPlaylist'

import Text from '@/components/Text'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { getSpotifyUserPlaylists } from '@/services/spotify/getSpotifyUserPlaylists'

const PLAYLISTS_LIMIT = 50

const UserPlaylists: React.FC = () => {
  const [playlists, setPlaylists] = useState<TSpotifyPlaylist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const fetchPlaylists = useCallback(async (currentOffset: number) => {
    setLoading(true)
    try {
      const data = await getSpotifyUserPlaylists({ limit: PLAYLISTS_LIMIT, offset: currentOffset })

      // Adiciona as novas playlists às existentes
      setPlaylists((prevPlaylists) => {
        // Filtra duplicados (caso a API do Spotify possa devolver o mesmo item em páginas diferentes, ou se houver um bug na paginação)
        const newItems = data.items.filter(
          (newItem) => !prevPlaylists.some((existingItem) => existingItem.id === newItem.id)
        )
        return [...prevPlaylists, ...newItems]
      })

      // Verifica se há mais playlists. Se o número de items devolvidos for menor que o limite, não há mais.
      setHasMore(data.items.length === PLAYLISTS_LIMIT)
    } catch (err: any) {
      console.error('Failed to fetch user playlists:', err)
      setError('Falha ao carregar playlists. Por favor, tente novamente mais tarde.')
      setHasMore(false) // Não há mais para tentar carregar em caso de erro
    } finally {
      setLoading(false)
    }
  }, []) // As dependências são vazias pois currentOffset é passado como argumento

  useEffect(() => {
    // Carrega as primeiras playlists ao montar o componente
    fetchPlaylists(0)
  }, [fetchPlaylists])

  const handleLoadMore = () => {
    // Incrementa o offset para carregar a próxima página
    setOffset((prevOffset) => prevOffset + PLAYLISTS_LIMIT)
  }

  // Este useEffect é acionado quando o offset muda para carregar mais playlists
  useEffect(() => {
    if (offset > 0) {
      // Garante que não carrega duas vezes a primeira página
      fetchPlaylists(offset)
    }
  }, [offset, fetchPlaylists])

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Text variant="h2">{error}</Text>
        <Button
          onClick={() => {
            setPlaylists([])
            setOffset(0)
            setError(null)
            setHasMore(true)
          }}
        >
          Tentar Novamente
        </Button>
      </div>
    )
  }

  if (playlists.length === 0 && loading) {
    // Esqueletos para o estado inicial de carregamento
    return (
      <div className="container mx-auto py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: PLAYLISTS_LIMIT }).map((_, index) => (
          <Card key={index} className="flex flex-col items-center p-4">
            <p>Card</p>
          </Card>
        ))}
      </div>
    )
  }

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-4">
        {playlists.map((playlist) => (
          <Card key={playlist.id} className="flex flex-col items-center text-center p-4">
            <CardHeader className="p-0 mb-4">
              {playlist.images && playlist.images.length > 0 ? (
                <img
                  src={playlist.images[0].url}
                  alt={playlist.name}
                  className="w-full h-auto object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-[200px] bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-md">
                  <Text>No Image</Text>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between w-full p-0">
              <CardTitle className="text-lg font-semibold">{playlist.name}</CardTitle>
              {playlist.description && (
                <Text className="text-gray-500">{playlist.description}</Text>
              )}
              <Text className="text-gray-500 mt-2">{playlist.tracks.total} songs</Text>
              <Button asChild>
                <a href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                  Open in Spotify
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button onClick={handleLoadMore} disabled={loading}>
            {loading ? 'Carregando mais...' : 'Carregar Mais'}
          </Button>
        </div>
      )}
    </div>
  )
}

export default UserPlaylists
