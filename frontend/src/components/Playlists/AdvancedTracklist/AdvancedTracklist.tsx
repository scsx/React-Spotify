import React from 'react'

import { TSkileyLikedSong } from '@/types/SkileyTrack'
import { AiOutlineClockCircle } from 'react-icons/ai'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { twMerge } from 'tailwind-merge'

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

import { formatSkileyDate } from '@/lib/format-skiley-date'
import { formatSkileyTrackDuration } from '@/lib/format-skiley-track-duration'

interface AdvancedTracklistProps {
  tracks: TSkileyLikedSong[]
  selectedTrack: TSkileyLikedSong | null
  onSelectTrack: (track: TSkileyLikedSong) => void
}

const AdvancedTracklist: React.FC<AdvancedTracklistProps> = ({
  tracks,
  selectedTrack,
  onSelectTrack,
}) => {
  if (!tracks || tracks.length === 0) {
    return <Text>No tracks found</Text>
  }

  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[30px] px-0 text-center">#</TableHead>
          <TableHead className="w-[35%]">Title</TableHead>
          <TableHead className="w-[35%]">Artist</TableHead>
          <TableHead>
            <FaRegCalendarAlt />
          </TableHead>
          <TableHead className="w-[50px] px-0 text-center">
            <AiOutlineClockCircle className="w-full text-right" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tracks.map((track, i) => {
          const isSelected = selectedTrack?.trackUri === track.trackUri

          return (
            <TableRow
              key={track.trackUri || i}
              onClick={() => onSelectTrack(track)}
              className={twMerge(
                'cursor-pointer transition-colors',
                isSelected
                  ? 'bg-primary hover:bg-primary'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-800'
              )}
            >
              <TableCell className="w-[30px] px-0 text-center">{i + 1}</TableCell>

              <TableCell className="font-medium">
                <Text className="leading-tight">{track.trackName}</Text>
              </TableCell>

              <TableCell>
                <Text className="leading-tight">
                  <Hyperlink href={track.artistUrl} external variant="title">
                    {track.artistName}
                  </Hyperlink>
                </Text>
              </TableCell>

              <TableCell>
                <Text className="leading-tight">
                  {formatSkileyDate(track.addedAt)}
                </Text>
              </TableCell>

              <TableCell className="w-[30px] px-0 text-center">
                <Text className="leading-tight">
                  {formatSkileyTrackDuration(track.trackDuration)}
                </Text>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default AdvancedTracklist
