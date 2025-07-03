import { useEffect, useState } from 'react'

// Importa a função que criamos!
import { TSpotifyPlaylist } from '@/types/SpotifyPlaylist'

// Tipo para a playlist do Spotify
import CardPlaylist from '@/components/Playlists/CardPlaylist'
import Text from '@/components/Text'
// Para um estado de carregamento
import { Button } from '@/components/ui/button'
// Assumindo que CardPlaylist está em '@/components/Playlists/CardPlaylist'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { getSpotifyPlaylistsById } from '@/services/spotify/getSpotifyPlaylistsById'

import { SPOTIFY_FAVORITE_PLAYLISTS } from '@/lib/constants'

// Ajusta o caminho se for diferente

// Define um tipo para a playlist combinada com o estilo
interface FavoritePlaylistWithStyle extends TSpotifyPlaylist {
  style: string // Adiciona a propriedade 'style'
}

const FavoritePlaylists = () => {
  const [favoritePlaylists, setFavoritePlaylists] = useState<FavoritePlaylistWithStyle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFavoritePlaylists = async () => {
      setLoading(true)
      setError(null)
      try {
        const playlistIds = SPOTIFY_FAVORITE_PLAYLISTS.map((p) => p.id)
        const fetchedSpotifyPlaylists = await getSpotifyPlaylistsById(playlistIds)

        // Mapeia os dados obtidos da API de volta para as tuas constantes
        // para adicionar a propriedade 'style'.
        const combinedPlaylists = SPOTIFY_FAVORITE_PLAYLISTS.map((favP) => {
          const matchingSpotifyPlaylist = fetchedSpotifyPlaylists.find(
            (fetchedP) => fetchedP.id === favP.id
          )
          // Se encontrou, combina. Caso contrário, ainda inclui os dados básicos da constante.
          return matchingSpotifyPlaylist
            ? { ...matchingSpotifyPlaylist, style: favP.style }
            : {
                ...favP,
                images: [],
                tracks: { total: 0 },
                description: 'Não foi possível carregar detalhes.',
                external_urls: { spotify: '' },
              } // Fallback básico
        })

        setFavoritePlaylists(combinedPlaylists as any) // TODO: remove any
      } catch (err: any) {
        console.error('Failed to fetch favorite playlists:', err)
        setError('Falha ao carregar as playlists favoritas. Por favor, tente novamente mais tarde.')
      } finally {
        setLoading(false)
      }
    }

    fetchFavoritePlaylists()
  }, [])

  // Lógica para a barra de % por estilo (será implementada a seguir)
  const calculateStylePercentages = () => {
    const styleCounts: { [key: string]: number } = {}
    favoritePlaylists.forEach((playlist) => {
      styleCounts[playlist.style] = (styleCounts[playlist.style] || 0) + 1
    })

    const total = favoritePlaylists.length
    if (total === 0) return {}

    const percentages: { [key: string]: number } = {}
    for (const style in styleCounts) {
      percentages[style] = (styleCounts[style] / total) * 100
    }
    return percentages
  }

  const stylePercentages = calculateStylePercentages()

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Text variant="h2">{error}</Text>
        <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>{' '}
        {/* Recarrega a página para tentar de novo */}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Text variant="h1" className="mb-6">
          Playlists Favoritas
        </Text>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: SPOTIFY_FAVORITE_PLAYLISTS.length }).map((_, index) => (
            <Card key={index} className="flex flex-col items-center p-4">
              {' '}
              {/* Usa a Card do Shadcn para o skeleton */}
              <Skeleton className="w-full h-[150px] aspect-square rounded-md mb-4" />
              <Skeleton className="w-3/4 h-6 rounded-md mb-2" />
              <Skeleton className="w-1/2 h-4 rounded-md" />
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (favoritePlaylists.length === 0) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Text variant="h2">Nenhuma playlist favorita encontrada.</Text>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Text variant="h1" className="mb-6">
        Playlists Favoritas
      </Text>

      {/* Barra de % por estilo */}
      <div className="mb-8 p-4 bg-secondary rounded-lg shadow-md">
        <Text variant="h3" className="mb-4 text-secondary-foreground">
          Distribuição por Estilo
        </Text>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {Object.entries(stylePercentages).map(([style, percentage]) => (
            <div key={style} className="flex items-center">
              <Text className="font-medium mr-2 text-secondary-foreground">
                {style.charAt(0).toUpperCase() + style.slice(1)}:
              </Text>
              <Text className="text-secondary-foreground">{percentage.toFixed(1)}%</Text>
            </div>
          ))}
        </div>
      </div>

      {/* Grid de Playlists Favoritas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {favoritePlaylists.map((playlist) => (
          // Passa a prop 'light' para truncar o título, conforme discutimos
          <CardPlaylist key={playlist.id} playlist={playlist} light />
        ))}
      </div>
    </div>
  )
}

export default FavoritePlaylists
