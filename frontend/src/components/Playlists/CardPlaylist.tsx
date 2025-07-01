import React from 'react'

import { TSpotifyPlaylist } from '@/types/SpotifyPlaylist'
import { FaSpotify } from 'react-icons/fa'
import { twMerge } from 'tailwind-merge'

import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'

interface CardPlaylistProps {
  playlist: TSpotifyPlaylist
  light?: boolean
}

const CardPlaylist: React.FC<CardPlaylistProps> = ({ playlist, light = false }) => {
  return (
    <Card className="flex flex-col items-center p-4 rounded">
      <CardHeader className="p-0 mb-4 w-full">
        {playlist.images && playlist.images.length > 0 ? (
          <img
            src={playlist.images[0].url}
            alt={playlist.name}
            className="w-full aspect-square object-cover rounded"
          />
        ) : (
          <div className="w-full aspect-square bg-gray-200 flex items-center justify-center rounded">
            <Text variant="paragraph">Sem Imagem</Text>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col w-full p-0">
        <Text
          variant="h3"
          as="h3"
          className={twMerge(light && 'whitespace-nowrap overflow-hidden text-ellipsis')}
        >
          <Hyperlink variant="title" href={`/playlists/${playlist.id}`}>
            {playlist.name}
          </Hyperlink>
        </Text>
        {!light && playlist.description && playlist.description.length > 0 && (
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
            {playlist.description}
          </CardDescription>
        )}
        <div className="flex w-full justify-between items-center">
          <Text color="muted">{playlist.tracks.total} songs</Text>
          <Hyperlink variant="icon" href={playlist.external_urls.spotify} external>
            <FaSpotify className="mx-2 text-muted-foreground hover:text-primary" />
          </Hyperlink>
        </div>
      </CardContent>
    </Card>
  )
}

export default CardPlaylist
