import { useEffect, useMemo, useState } from 'react'

import { TSkileyLikedSong } from '@/types/SkileyTrack'
import { TSpotifyArtist } from '@/types/SpotifyArtist'

import AdvancedTracklist from '@/components/Tracks/AdvancedTracklist/AdvancedTracklist'
import AdvancedTracklistDetail from '@/components/Tracks/AdvancedTracklist/AdvancedTracklistDetail'
import AdvancedTracklistSearch from '@/components/Tracks/AdvancedTracklist/AdvancedTracklistSearch'
import ErrorDisplay from '@/components/shared/ErrorDisplay'
import GenericPagination from '@/components/shared/GenericPagination'
import Loading from '@/components/shared/Loading'

import { getLocalSkileyTracks } from '@/services/skiley/getLocalSkileyTracks'
import { getSpotifyArtist } from '@/services/spotify/getSpotifyArtist'
import { getSpotifyTrack } from '@/services/spotify/getSpotifyTrack'

import { normalizeString } from '@/lib/normalise-string'

const LikedSongs = () => {
  const [data, setData] = useState<TSkileyLikedSong[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTrack, setSelectedTrack] = useState<TSkileyLikedSong | null>(null)
  const [selectedTrackImage, setSelectedTrackImage] = useState<string | null>(null)
  const [selectedTrackArtist, setSelectedTrackArtist] = useState<TSpotifyArtist | null>(null)

  const [searchTerm, setSearchTerm] = useState('')

  const pageSize = 50

  // TODO: useMemo where possible.

  // Fetch local songs.
  useEffect(() => {
    const fetchLikedSongs = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const tracks = await getLocalSkileyTracks()
        setData(tracks)

        if (tracks.length > 0) {
          setSelectedTrack(tracks[0])
        }
      } catch (e: unknown) {
        console.error('Error fetching liked songs data:', e)
        if (e instanceof Error) {
          setError(e.message)
        } else {
          setError('Failed to fetch data.')
        }
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
      return
    }

    const trackId = selectedTrack.trackUrl.split('/').pop()

    if (!trackId) {
      setSelectedTrackImage(null)
      console.warn('Track ID not found for:', selectedTrack.trackName)
      return
    }

    const fetchTrackData = async () => {
      try {
        const trackData = await getSpotifyTrack(trackId)

        // Artista
        const artistId = trackData?.artists?.[0]?.id

        if (artistId) {
          const artistData = await getSpotifyArtist(artistId)
          setSelectedTrackArtist(artistData)
        } else {
          setSelectedTrackArtist(null)
        }

        // Imagem do álbum (vem dentro da track)
        if (trackData?.album?.images?.length > 0) {
          setSelectedTrackImage(trackData.album.images[0].url)
        } else {
          setSelectedTrackImage(null)
        }
      } catch (e) {
        console.error('Failed to fetch Spotify track data:', e)
        setSelectedTrackImage(null)
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
    <div className="flex space-x-12">
      <div className="w-2/3">
        <AdvancedTracklistSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          totalItems={songCount}
        />

        {songCount > 0 && (
          <div className="relative mt-8">
            <AdvancedTracklist
              tracks={paginatedTracks}
              selectedTrack={selectedTrack}
              onSelectTrack={handleSelectTrack}
              startIndex={startIndex}
            />

            {totalPages > 1 && (
              <GenericPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onPrevious={() => setCurrentPage((p) => Math.max(1, p - 1))}
                onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                isPreviousDisabled={currentPage === 1}
                isNextDisabled={currentPage === totalPages}
              />
            )}
          </div>
        )}
      </div>
      <div className="w-1/3">
        <AdvancedTracklistDetail
          track={selectedTrack}
          artist={selectedTrackArtist}
          albumImageUrl={selectedTrackImage}
        />
      </div>
    </div>
  )
}

export default LikedSongs
