import React from 'react'

import { TSpotifyPlaylist } from '@/types/SpotifyPlaylist'
import { twMerge } from 'tailwind-merge'

import FullPlaylistHeader from '@/components/Playlists/FullPlaylist/FullPlaylistHeader'
import Text from '@/components/Text'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

interface FullPlaylistProps {
  playlist: TSpotifyPlaylist
  showHeader?: boolean
}

const FullPlaylist: React.FC<FullPlaylistProps> = ({ playlist, showHeader = false }) => {
  return (
    <>
      {showHeader && <FullPlaylistHeader playlist={playlist} />}
      {playlist.tracks?.items && playlist.tracks.items.length > 0 && (
        <Card className={twMerge(showHeader && 'rounded-t-none')}>
          <CardContent className="p-0">
            <Table>
              <TableBody>
                {playlist.tracks.items.map((trackItem, index) => (
                  <TableRow
                    key={`${trackItem.track.id}-${index}`}
                    className="hover:bg-gray-700 transition-colors"
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="flex items-center space-x-3">
                      {trackItem.track.album?.images && trackItem.track.album.images.length > 0 && (
                        <img
                          src={trackItem.track.album.images[0].url}
                          alt={trackItem.track.album.name}
                          className="w-10 h-10 object-cover"
                        />
                      )}
                      <div>
                        <Text variant="paragraph" className="text-white font-medium">
                          {trackItem.track.name}
                        </Text>
                        <Text className="text-gray-400 text-sm">
                          {trackItem.track.artists.map((artist) => artist.name).join(', ')}
                        </Text>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-gray-400">
                      {trackItem.track.album?.name}
                    </TableCell>
                    <TableCell className="text-right">
                      {trackItem.track.external_urls?.spotify && (
                        <a
                          href={trackItem.track.external_urls.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                        >
                          Play
                        </a>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default FullPlaylist
