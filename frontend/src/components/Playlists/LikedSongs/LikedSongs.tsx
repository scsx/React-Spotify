import { useEffect, useMemo, useState } from 'react'

import { TSkileyLikedSong } from '@/types/SkileyTrack'

import ErrorDisplay from '@/components/ErrorDisplay'
import GenericPagination from '@/components/GenericPagination'
import Loading from '@/components/Loading'
import AdvancedTracklist from '@/components/Playlists/AdvancedTracklist/AdvancedTracklist'
import AdvancedTracklistDetail from '@/components/Playlists/AdvancedTracklist/AdvancedTracklistDetail'
import AdvancedTracklistSearch from '@/components/Playlists/AdvancedTracklist/AdvancedTracklistSearch'
import LikedSongsSecNav from '@/components/Playlists/LikedSongs/LikedSongsSecNav'

import { getSpotifyTrack } from '@/services/spotify/getSpotifyTrack'

import { checkSpotifyContentAvailability } from '@/lib/check-spotify-content-availability'
import { normalizeString } from '@/lib/normalise-string'

const LikedSongs = () => {
  const [data, setData] = useState<TSkileyLikedSong[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTrack, setSelectedTrack] = useState<TSkileyLikedSong | null>(null)
  const [selectedTrackImage, setSelectedTrackImage] = useState<string | null>(null)
  const [selectedTrackAvailableInPT, setSelectedTrackAvailableInPT] = useState<boolean>(false)

  const [searchTerm, setSearchTerm] = useState('')

  const pageSize = 50
  const DATA_PATH = '/data/skiley/2025-10-02-skiley-liked-songs.json'

  // TODO: useMemo where possible.

  // Fetch local songs.
  useEffect(() => {
    const fetchLikedSongs = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(DATA_PATH)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const json = await response.json()
        setData(json)

        if (json.length > 0) {
          setSelectedTrack(json[0])
        }
      } catch (e: any) {
        console.error('Error fetching liked songs data:', e)
        setError(e.message || 'Failed to fetch data.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLikedSongs()
  }, [])

  // Fetch album image and availability when selectedTrack changes.
  useEffect(() => {
    if (!selectedTrack) {
      setSelectedTrackImage(null)
      setSelectedTrackAvailableInPT(false)
      return
    }

    const trackId = selectedTrack.trackUrl.split('/').pop()

    if (!trackId) {
      setSelectedTrackImage(null)
      setSelectedTrackAvailableInPT(false)
      console.warn('Track ID not found for:', selectedTrack.trackName)
      return
    }

    const fetchTrackData = async () => {
      try {
        const trackData = await getSpotifyTrack(trackId)

        // Imagem do álbum (vem dentro da track)
        if (trackData?.album?.images?.length > 0) {
          setSelectedTrackImage(trackData.album.images[0].url)
        } else {
          setSelectedTrackImage(null)
        }

        // Disponibilidade em PT
        const isAvailable = await checkSpotifyContentAvailability('track', trackId)
        setSelectedTrackAvailableInPT(isAvailable)
      } catch (e) {
        console.error('Failed to fetch Spotify track data:', e)
        setSelectedTrackImage(null)
        setSelectedTrackAvailableInPT(false)
      }
    }

    fetchTrackData()
  }, [selectedTrack])

  // Filter tracks based on search term
  const filteredTracks = useMemo(() => {
    setCurrentPage(1)
    if (!searchTerm) {
      return data
    }

    const normalizedTerm = normalizeString(searchTerm)

    return data.filter((track) => {
      const normalizedTrackName = normalizeString(track.trackName)
      const normalizedArtistName = normalizeString(track.artistName)
      const normalizedAlbumName = normalizeString(track.albumName)

      return (
        normalizedTrackName.includes(normalizedTerm) ||
        normalizedArtistName.includes(normalizedTerm) ||
        normalizedAlbumName.includes(normalizedTerm)
      )
    })
  }, [data, searchTerm])

  if (isLoading) return <Loading />
  if (error) return <ErrorDisplay message="error" />

  const songCount = filteredTracks.length
  const totalPages = Math.ceil(songCount / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedTracks = filteredTracks.slice(startIndex, startIndex + pageSize)
  const handleSelectTrack = (track: TSkileyLikedSong) => setSelectedTrack(track)

  return (
    <div>
      <div className="flex space-x-12">
        <div className="w-3/4">
          <AdvancedTracklistSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            totalItems={songCount}
          />
        </div>
        <div className="w-1/4">
          <LikedSongsSecNav />
        </div>
      </div>

      {songCount > 0 && (
        <div className="pt-2 flex space-x-12">
          <div className="relative w-3/4">
            <AdvancedTracklist
              tracks={paginatedTracks}
              selectedTrack={selectedTrack}
              onSelectTrack={handleSelectTrack}
              startIndex={startIndex}
            />
            <GenericPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onPrevious={() => setCurrentPage((p) => Math.max(1, p - 1))}
              onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            />
          </div>
          <div className="w-1/4">
            <AdvancedTracklistDetail
              track={selectedTrack}
              albumImageUrl={selectedTrackImage}
              isAvailableInPT={selectedTrackAvailableInPT}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default LikedSongs
