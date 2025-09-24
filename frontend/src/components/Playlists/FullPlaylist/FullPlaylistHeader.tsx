import React from 'react'

import { TSpotifyPlaylist } from '@/types/SpotifyPlaylist'

import Text from '@/components/Text'
import { Card, CardContent } from '@/components/ui/card'

import { getFirstNameAndLastInitial } from '@/lib/get-first-name-and-last-initial'

interface FullPlaylistHeaderProps {
  playlist: TSpotifyPlaylist
}

const FullPlaylistHeader: React.FC<FullPlaylistHeaderProps> = ({ playlist }) => {
  return (
    <Card className="rounded-b-none">
      <CardContent className="flex p-4">
        {playlist.images && playlist.images.length > 0 && (
          <img
            src={playlist.images[0].url}
            alt={playlist.name}
            className="w-32 h-32 aspect-square rounded-sm"
          />
        )}
        <div className="pl-8">
          <Text variant="h2" as="h2" className="font-bold">
            {playlist.name}
          </Text>
          {playlist.description && (
            <Text variant="paragraph" color="muted">
              {playlist.description}
            </Text>
          )}

          <Text variant="paragraph" color="muted">
            Created by {getFirstNameAndLastInitial(playlist.owner?.display_name) || '??'}
          </Text>
          <Text variant="paragraph" color="muted">
            {playlist.tracks?.total || 0} tracks
          </Text>
          {playlist.external_urls?.spotify && (
            <a
              href={playlist.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Open in Spotify
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default FullPlaylistHeader
