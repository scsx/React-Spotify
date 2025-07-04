import { useEffect, useState } from 'react'

import { TSpotifyPlaylist } from '@/types/SpotifyPlaylist'

import CardPlaylist from '@/components/Playlists/CardPlaylist'
import FavoritesStyles from '@/components/Playlists/FavoritePlaylists/FavoritesStyles'
import Text from '@/components/Text'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { getSpotifyPlaylistsById } from '@/services/spotify/getSpotifyPlaylistsById'

import { SPOTIFY_FAVORITE_PLAYLISTS } from '@/lib/constants'

interface FavoritePlaylistWithStyle extends TSpotifyPlaylist {
  style: string
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
              }
        })

        setFavoritePlaylists(combinedPlaylists as any)
      } catch (err: any) {
        console.error('Failed to fetch favorite playlists:', err)
        setError('Falha ao carregar as playlists favoritas. Por favor, tente novamente mais tarde.')
      } finally {
        setLoading(false)
      }
    }

    fetchFavoritePlaylists()
  }, [])

  if (error) {
    return (
      <>
        <Text variant="h2">{error}</Text>
        <Button onClick={() => window.location.reload()}>Try again</Button>{' '}
      </>
    )
  }

  if (loading) {
    return (
      <>
        <div className="w-[90%] mx-auto pt-8 mb-16">
          <div className="flex w-full h-2 bg-slate-500"></div>
          <Text variant='paragraph' className='text-center mt-4'>Loading styles</Text>
        </div>

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
      </>
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
    <>
      <FavoritesStyles playlists={favoritePlaylists} />
      {/* Grid de Playlists Favoritas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {favoritePlaylists.map((playlist) => (
          <CardPlaylist key={playlist.id} playlist={playlist} />
        ))}
      </div>
    </>
  )
}

export default FavoritePlaylists
