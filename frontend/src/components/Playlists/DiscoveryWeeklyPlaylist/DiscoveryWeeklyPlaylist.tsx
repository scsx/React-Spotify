import { useEffect, useState } from 'react'

import { TSpotifyPlaylist } from '@/types/SpotifyPlaylist'

// Importe useState e useEffect
import Text from '@/components/Text'

// Importe o tipo de playlist

// Importe a função que busca playlists por ID
import { getSpotifyPlaylistsById } from '@/services/spotify/getSpotifyPlaylistsById'

// Importe a constante que contém o ID da Discovery Weekly

// Opcional: Se tiver um componente para exibir uma única playlist (como um CardPlaylist grande)
// import SinglePlaylistDisplay from '@/components/Playlists/SinglePlaylistDisplay'; // Exemplo

const DiscoveryWeeklyPlaylist = () => {
  const [playlist, setPlaylist] = useState<TSpotifyPlaylist | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)


  if (loading) {
    return (
      <div className="container py-8">
        <Text variant="h1">A carregar Discovery Weekly...</Text>
        {/* Opcional: Adicionar um skeleton específico para uma playlist */}
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
      </div>
    )
  }

  if (!playlist) {
    return (
      <div className="container py-8">
        <Text variant="h1">Playlist não disponível.</Text>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <Text variant="h1" className="mb-6">
        Discovery Weekly
      </Text>

      {/* Aqui você pode renderizar os detalhes da playlist 'playlist' */}
      {/* Exemplo de exibição simples, você pode usar um componente mais complexo */}
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

      {/* Opcional: Mostrar as músicas da playlist se a API retornar */}
      {/* Se a API do Spotify para uma única playlist incluir as faixas, pode mapeá-las aqui */}
      {/* {playlist.tracks?.items && playlist.tracks.items.length > 0 && (
        <div className="mt-8">
          <Text variant="h3" className="mb-4">Músicas da Playlist</Text>
          {playlist.tracks.items.map((trackItem) => (
            <div key={trackItem.track.id} className="flex items-center p-2 border-b border-gray-700">
              <Text variant="paragraph" className="mr-4">{trackItem.track.name}</Text>
              <Text variant="paragraph" className="text-gray-400">
                {trackItem.track.artists.map(artist => artist.name).join(', ')}
              </Text>
            </div>
          ))}
        </div>
      )} */}
    </div>
  )
}

export default DiscoveryWeeklyPlaylist
