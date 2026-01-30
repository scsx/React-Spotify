import React from 'react'

import { TSpotifyTrack } from '@/types/SpotifyTrack'

import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { formatTrackDuration } from '@/lib/format-track-duration'

interface TracklistProps {
  tracks: TSpotifyTrack[]
  availableInPT: boolean
}

const AlbumTracklist: React.FC<TracklistProps> = ({ tracks, availableInPT }) => {
  if (!tracks || tracks.length === 0) {
    return <div>No tracks found</div>
  }

  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px] text-center">#</TableHead>
          <TableHead className="w-1/2">Title</TableHead>
          <TableHead className="w-[35%]">Artists</TableHead>
          <TableHead className="text-right w-[100px]">Duration</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tracks.map((track) => (
          <TableRow key={track.id} className="cursor-pointer">
            <TableCell className="text-center">{track.track_number}</TableCell>

            <TableCell className="font-medium">
              <Hyperlink href={`/tracks/${track.id}`} variant="title">
                <Text className="leading-tight" color={availableInPT ? 'foreground' : 'muted'}>
                  {track.name}
                </Text>
              </Hyperlink>
            </TableCell>

            <TableCell>
              <Text className="leading-tight">
                {track.artists.map((artist, index, array) => (
                  <React.Fragment key={artist.id}>
                    <Hyperlink href={`/artists/${artist.id}`} variant="title">
                      {artist.name}
                    </Hyperlink>
                    {index < array.length - 1 && <span className="opacity-80">, </span>}
                  </React.Fragment>
                ))}
              </Text>
            </TableCell>

            <TableCell className="text-right">
              <Text className="leading-tight">{formatTrackDuration(track.duration_ms)}</Text>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default AlbumTracklist
