import { useEffect, useState } from 'react'

import { TSpotifyPlaylist } from '@/types/SpotifyPlaylist'

import Text from '@/components/Text'

import { getSpotifyPlaylistsByNames } from '@/services/spotify/getSpotifyPlaylistsByNames'

const ShazamPlaylist = () => {
  const [playlist, setPlaylist] = useState<TSpotifyPlaylist | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const term: string = 'shazam'

  useEffect(() => {
    const fetchDiscoveryWeekly = async () => {
      try {
        setLoading(true) // Começa a carregar, define loading como true
        setError(null) // Limpa qualquer erro anterior

        // Chama a nova função para buscar a playlist "Discover Weekly" pelo nome
        // Esta função já retorna os detalhes completos da playlist (incluindo as faixas).
        const result = await getSpotifyPlaylistsByNames([term])

        // Verifica se a playlist foi encontrada
        if (result.found.length > 0) {
          setPlaylist(result.found[0]) // Se encontrada, define a primeira playlist como a playlist do estado
        } else {
          // Se não encontrou, define uma mensagem de erro apropriada
          setError(
            `Playlist "Discover Weekly" não encontrada para este utilizador. ${result.message || ''}`
          )
        }
      } catch (err: any) {
        // Captura e define qualquer erro que ocorra durante a busca
        console.error('Erro ao carregar Discovery Weekly:', err)
        setError(
          err.message || 'Ocorreu um erro desconhecido ao carregar a playlist Discovery Weekly.'
        )
      } finally {
        setLoading(false) // Termina o carregamento, define loading como false
      }
    }

    fetchDiscoveryWeekly() // Invoca a função de busca
  }, [])

  if (loading) {
    return (
      <div className="container py-8">
        {/* Skeleton UI para feedback visual de carregamento */}
        <div className="bg-gray-800 rounded-lg p-6 mt-4 flex items-center space-x-4">
          <div className="w-32 h-32 bg-gray-700 rounded-md animate-pulse"></div>
          <div>
            <div className="h-6 w-48 bg-gray-700 rounded mb-2 animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <Text variant="h1">Erro</Text>
        <Text variant="paragraph">{error}</Text>
        <Text variant="paragraph" className="mt-2 text-gray-500">
          Certifique-se de que está logado na sua conta Spotify e que a playlist "Discover Weekly"
          existe na sua biblioteca.
        </Text>
      </div>
    )
  }

  if (!playlist) {
    return (
      <div className="container py-8">
        <Text variant="h2">Playlist {term} não encontrada.</Text>
        <Text variant="paragraph" className="mt-2 text-gray-500">
          Pode ser que a playlist não esteja disponível ou que não exista na sua conta Spotify.
        </Text>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <Text variant="h1" className="mb-6">
        Discovery Weekly
      </Text>

      <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        {playlist.images && playlist.images.length > 0 && (
          <img
            src={playlist.images[0].url}
            alt={playlist.name}
            className="w-48 h-48 sm:w-64 sm:h-64 object-cover rounded-md shadow-md"
          />
        )}
        <div className="text-center sm:text-left">
          <Text variant="h2" className="text-white mb-2">
            {playlist.name}
          </Text>
          <Text variant="paragraph" className="text-gray-400 mb-4">
            {playlist.description}
          </Text>
          <Text variant="paragraph" className="text-gray-500">
            Criada por: {playlist.owner?.display_name || 'Desconhecido'}
          </Text>
          <Text variant="paragraph" className="text-gray-500">
            Total de faixas: {playlist.tracks?.total || 0}
          </Text>
          {playlist.external_urls?.spotify && (
            <a
              href={playlist.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Abrir no Spotify
            </a>
          )}
        </div>
      </div>

      {/* Mostrar as músicas da playlist se a API retornar, que agora deve retornar! */}
      {playlist.tracks?.items && playlist.tracks.items.length > 0 && (
        <div className="mt-8">
          <Text variant="h3" className="mb-4 text-white">
            Músicas da Playlist
          </Text>
          <div className="space-y-2">
            {playlist.tracks.items.map((trackItem) => (
              <div
                key={trackItem.track.id}
                className="flex flex-col sm:flex-row sm:items-center p-3 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <div className="flex-shrink-0 mr-4">
                  {trackItem.track.album?.images && trackItem.track.album.images.length > 0 && (
                    <img
                      src={trackItem.track.album.images[0].url}
                      alt={trackItem.track.album.name}
                      className="w-12 h-12 rounded-sm object-cover"
                    />
                  )}
                </div>
                <div className="flex-grow">
                  <Text variant="paragraph" className="text-white font-medium">
                    {trackItem.track.name}
                  </Text>
                  <Text className="text-gray-400">
                    {trackItem.track.artists.map((artist) => artist.name).join(', ')} -{' '}
                    {trackItem.track.album?.name}
                  </Text>
                </div>
                {trackItem.track.external_urls?.spotify && (
                  <a
                    href={trackItem.track.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-0 sm:ml-4 mt-2 sm:mt-0 flex-shrink-0 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                  >
                    Ouvir
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ShazamPlaylist
