import React from 'react'

import { TSpotifyPlaylist } from '@/types/SpotifyPlaylist'

import Text from '@/components/Text'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface CardPlaylistProps {
  playlist: TSpotifyPlaylist
}

const CardPlaylist: React.FC<CardPlaylistProps> = ({ playlist }) => {
  return (
    <Card className="flex flex-col items-center text-center p-4">
      <CardHeader className="p-0 mb-4">
        {playlist.images && playlist.images.length > 0 ? (
          <img
            src={playlist.images[0].url}
            alt={playlist.name}
            className="w-full h-auto object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-[150px] bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-md">
            <Text variant="paragraph">Sem Imagem</Text>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between w-full p-0">
        <CardTitle className="text-lg font-semibold mb-2">{playlist.name}</CardTitle>
        {/* CardDescription e CardFooter podem ser adicionados aqui se necessário */}
        {playlist.description && playlist.description.length > 0 && (
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
            {playlist.description}
          </CardDescription>
        )}
        <Text>{playlist.tracks.total} músicas</Text>
        <Button asChild className="mt-4 w-full">
          <a href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
            Abrir no Spotify
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}

export default CardPlaylist
