import React from 'react'

import { TSpotifyAlbum } from '@/types/SpotifyAlbum'

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
}

const AlbumOverview: React.FC<AlbumOverviewProps> = ({ album }) => {
  const totalDuration = formatTotalDuration(album)
  const releaseDate = formatReleaseDate(album.release_date)

  return (
    <div className="flex items-center space-x-2">
      <Text color="muted" className="whitespace-nowrap">
        {album.total_tracks} tracks
      </Text>

      <Text color="muted" className="text-xl leading-none">
        •
      </Text>

      <Text color="muted" className="whitespace-nowrap">
        {totalDuration}
      </Text>

      <Text color="muted" className="text-xl leading-none">
        •
      </Text>

      <Text color="muted" className="whitespace-nowrap">
        {releaseDate}
      </Text>
    </div>
  )
}

export default AlbumOverview
