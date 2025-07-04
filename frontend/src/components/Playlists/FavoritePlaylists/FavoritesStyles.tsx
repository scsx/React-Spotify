// frontend/src/components/Playlists/FavoritePlaylists/FavoritesStyles.tsx
import React, { useMemo } from 'react'

// Remove useEffect, useState
import { TSpotifyPlaylist } from '@/types/SpotifyPlaylist'

// Para tipar a prop 'playlists'
import Text from '@/components/Text'

// Não precisa mais importar getSpotifyPlaylistsById ou SPOTIFY_FAVORITE_PLAYLISTS aqui
// import { getSpotifyPlaylistsById } from '@/services/spotify/getSpotifyPlaylistsById'
// import { SPOTIFY_FAVORITE_PLAYLISTS } from '@/lib/constants'

// Tipo para o resultado do cálculo
interface StyleBreakdown {
  style: string
  percentage: number
  totalTracks: number
}

// NOVO: Definir as props que este componente vai receber
interface FavoritesStylesProps {
  playlists: (TSpotifyPlaylist & { style: string })[] // A lista de playlists já combinada com 'style'
}

const FavoritesStyles: React.FC<FavoritesStylesProps> = ({ playlists }) => {
  // Remove loading, error, e useEffect
  // const [breakdown, setBreakdown] = useState<StyleBreakdown[]>([])
  // const [loading, setLoading] = useState<boolean>(true)
  // const [error, setError] = useState<string | null>(null)

  // O cálculo agora é feito diretamente a partir da prop 'playlists'
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

    const calculatedBreakdown: StyleBreakdown[] = Object.keys(styleTrackCounts).map((style) => {
      const totalTracksForStyle = styleTrackCounts[style]
      const percentage = grandTotalTracks > 0 ? (totalTracksForStyle / grandTotalTracks) * 100 : 0
      return {
        style,
        percentage: parseFloat(percentage.toFixed(1)), // Arredonda para 1 casa decimal
        totalTracks: totalTracksForStyle,
      }
    })

    calculatedBreakdown.sort((a, b) => b.percentage - a.percentage)

    return calculatedBreakdown
  }, [playlists])


  if (breakdown.length === 0) {
    return <div className="playlist-breakdown-empty">Nenhum dado de estilo disponível.</div>
  }

  return (
    <div className="playlist-style-breakdown">
      <div className="style-list">
        {breakdown.map((item) => (
          <div key={item.style} className="style-item">
            <span className="style-name">{item.style}:</span>
            <span className="style-percentage">{item.percentage}%</span>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${item.percentage}%` }}
                title={`${item.totalTracks} faixas`} // Tooltip com o número total de faixas
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FavoritesStyles
