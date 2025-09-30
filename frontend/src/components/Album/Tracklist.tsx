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

const formatDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const formattedSeconds = String(seconds).padStart(2, '0')
  return `${minutes}:${formattedSeconds}`
}

interface TracklistProps {
  tracks: TSpotifyTrack[]
}

const Tracklist: React.FC<TracklistProps> = ({ tracks }) => {
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
              <Text>{track.name}</Text>
            </TableCell>

            <TableCell>
              <Text>{track.artists.map((artist) => artist.name).join(', ')}</Text>
            </TableCell>

            <TableCell className="text-right">
              <Text>{formatDuration(track.duration_ms)}</Text>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default Tracklist
