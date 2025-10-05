import React from 'react'

import { TSpotifyAlbum } from '@/types/SpotifyAlbum'
import { AiOutlineClockCircle } from 'react-icons/ai'
import { FaListUl } from 'react-icons/fa'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { FaSpotify } from 'react-icons/fa'
import { ImFire } from 'react-icons/im'

import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'

const formatTotalDuration = (album: TSpotifyAlbum) => {
  if (!album || !album.tracks || !album.tracks.items) {
    return 'N/D'
  }

  const totalDurationMs = album.tracks.items.reduce((sum, track) => sum + track.duration_ms, 0)

  const totalSeconds = Math.floor(totalDurationMs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  let result = ''
  if (hours > 0) {
    result += `${hours}h `
  }
  result += `${minutes}m`
  if (hours === 0 && minutes < 10) {
    result += ` ${String(seconds).padStart(2, '0')}s`
  }
  return result.trim()
}

const formatReleaseDate = (dateString: string) => {
  if (!dateString) return 'N/D'
  try {
    const [year, month, day] = dateString.split('-')
    return `${day}-${month}-${year}`
  } catch (e) {
    return dateString
  }
}

interface AlbumOverviewProps {
  album: TSpotifyAlbum
  availableInPT: boolean
}

const AlbumOverview: React.FC<AlbumOverviewProps> = ({ album, availableInPT }) => {
  const totalDuration = formatTotalDuration(album)
  const releaseDate = formatReleaseDate(album.release_date)

  return (
    <div className="flex items-center">
      <div className="flex items-center space-x-4 grow">
        <Text color="muted" className="whitespace-nowrap flex items-center gap-x-2">
          <FaListUl />
          {album.total_tracks} tracks
        </Text>
        <Text color="muted" className="whitespace-nowrap flex items-center gap-x-2">
          <AiOutlineClockCircle />
          {totalDuration}
        </Text>
        <Text color="muted" className="whitespace-nowrap flex items-center gap-x-2">
          <FaRegCalendarAlt />
          {releaseDate}
        </Text>
        <Text color="muted" className="whitespace-nowrap flex items-center gap-x-2">
          <ImFire title="Popularity" />
          {album.popularity}
        </Text>
      </div>
      
      <div className="flex gap-4">
        {!availableInPT && <Text className='text-red-700'>Unavailable in PT</Text>}
        <FaSpotify className="text-xl" />
        <Text>
          <Hyperlink href={album.external_urls.spotify} external variant="title">
            WEB
          </Hyperlink>
        </Text>
        <Text>
          <Hyperlink href={album.uri} external variant="title">
            APP
          </Hyperlink>
        </Text>
      </div>
    </div>
  )
}

export default AlbumOverview
