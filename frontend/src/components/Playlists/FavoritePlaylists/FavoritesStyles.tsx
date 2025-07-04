import React, { useMemo } from 'react'

import { TFavoritesStyleBreakdown } from '@/types/General'
import { TSpotifyPlaylist } from '@/types/SpotifyPlaylist'

import Text from '@/components/Text'

interface FavoritesStylesProps {
  playlists: (TSpotifyPlaylist & { style: string })[]
}

const FavStylesColors = [
  { pop: 'bg-blue-600' },
  { electronic: 'bg-cyan-800' },
  { world: 'bg-yellow-500' },
  { rock: 'bg-rose-800' },
  { classical: 'bg-cyan-700' },
]

const styleColorMap: { [key: string]: string } = FavStylesColors.reduce((acc, current) => {
  const key = Object.keys(current)[0]
  const value = Object.values(current)[0]
  return { ...acc, [key]: value }
}, {})

const FavoritesStyles: React.FC<FavoritesStylesProps> = ({ playlists }) => {
  const breakdown = useMemo(() => {
    if (!playlists || playlists.length === 0) {
      return []
    }

    const styleTrackCounts: { [key: string]: number } = {}
    let grandTotalTracks = 0

    playlists.forEach((playlist) => {
      // O estilo já está na playlist, e o total de faixas também
      if (playlist.style && playlist.tracks && typeof playlist.tracks.total === 'number') {
        const style = playlist.style
        const trackCount = playlist.tracks.total

        styleTrackCounts[style] = (styleTrackCounts[style] || 0) + trackCount
        grandTotalTracks += trackCount
      }
    })

    const calculatedBreakdown: TFavoritesStyleBreakdown[] = Object.keys(styleTrackCounts).map(
      (style) => {
        const totalTracksForStyle = styleTrackCounts[style]
        const percentage = grandTotalTracks > 0 ? (totalTracksForStyle / grandTotalTracks) * 100 : 0
        return {
          style,
          percentage: parseFloat(percentage.toFixed(1)),
          totalTracks: totalTracksForStyle,
        }
      }
    )

    calculatedBreakdown.sort((a, b) => b.percentage - a.percentage)

    return calculatedBreakdown
  }, [playlists])

  if (breakdown.length === 0) {
    return <div>Nenhum dado de estilo disponível.</div>
  }

  return (
    <div className="w-[90%] mx-auto pt-8 mb-16">
      {/* Bar */}
      <div className="flex w-full h-2">
        {breakdown.map((item) => {
          const bgColorClass = styleColorMap[item.style] || 'bg-gray-500'
          return (
            <div
              key={item.style}
              className={`${bgColorClass} border-r border-gray-700 last:border-r-0`}
              style={{ width: `${item.percentage}%` }}
              title={`${item.style}: ${item.totalTracks} faixas (${item.percentage}%)`}
            ></div>
          )
        })}
      </div>
      {/* Caption */}
      <div className="flex flex-wrap justify-center mt-4 gap-x-8">
        {breakdown.map((item) => {
          const bgColorClass = styleColorMap[item.style] || 'bg-gray-500'
          return (
            <div key={item.style} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-sm ${bgColorClass}`}></div>
              <Text variant='paragraph' as='span'>
                {item.style.charAt(0).toUpperCase() + item.style.slice(1)}: {item.percentage}%
              </Text>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FavoritesStyles
