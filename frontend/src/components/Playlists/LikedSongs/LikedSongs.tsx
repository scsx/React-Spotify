import { useEffect, useState } from 'react'

import { TSkileyLikedSong } from '@/types/SkileyTrack'

import ErrorDisplay from '@/components/ErrorDisplay'
import GenericPagination from '@/components/GenericPagination'
import Hyperlink from '@/components/Hyperlink'
import Loading from '@/components/Loading'
import AdvancedTracklist from '@/components/Playlists/AdvancedTracklist/AdvancedTracklist'
import AdvancedTracklistDetail from '@/components/Playlists/AdvancedTracklist/AdvancedTracklistDetail'
import Text from '@/components/Text'

import { getSpotifyAlbum } from '@/services/spotify/getSpotifyAlbum'

const LikedSongs = () => {
  const [data, setData] = useState<TSkileyLikedSong[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTrack, setSelectedTrack] = useState<TSkileyLikedSong | null>(null)
  const [selectedTrackImage, setSelectedTrackImage] = useState<string | null>(null)

  const pageSize = 50
  const DATA_PATH = '/data/skiley/2025-10-02-skiley-liked-songs.json'

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

  // Fetch album image when selectedTrack changes.
  useEffect(() => {
    if (!selectedTrack) {
      setSelectedTrackImage(null)
      return
    }

    const albumId = selectedTrack.albumUrl.split('/').pop()

    if (!albumId) {
      setSelectedTrackImage(null)
      console.warn('Album ID not found for track:', selectedTrack.trackName)
      return
    }

    const fetchAlbumImage = async () => {
      try {
        const albumData = await getSpotifyAlbum(albumId)

        if (albumData && albumData.images && albumData.images.length > 0) {
          setSelectedTrackImage(albumData.images[0].url)
        } else {
          setSelectedTrackImage(null)
        }
      } catch (e) {
        console.error('Failed to fetch Spotify album image:', e)
        setSelectedTrackImage(null)
      }
    }

    fetchAlbumImage()
  }, [selectedTrack])

  if (isLoading) return <Loading />
  if (error) return <ErrorDisplay message="error" />

  const songCount = data.length
  const totalPages = Math.ceil(songCount / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedTracks = data.slice(startIndex, startIndex + pageSize)
  const handleSelectTrack = (track: TSkileyLikedSong) => setSelectedTrack(track)

  return (
    <div>
      {songCount > 0 && (
        <div className="pt-8 flex space-x-12">
          <div className="relative w-3/4">
            <AdvancedTracklist
              tracks={paginatedTracks}
              selectedTrack={selectedTrack}
              onSelectTrack={handleSelectTrack}
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
            <AdvancedTracklistDetail track={selectedTrack} albumImageUrl={selectedTrackImage} />
            <Text className="mt-4">
              Using{' '}
              <Hyperlink href="https://skiley.net/playlists" external>
                skiley.net
              </Hyperlink>
              . Check <Hyperlink href="/dev-notes#skiley">Dev Notes</Hyperlink>.
            </Text>
            <Text>Successfully loaded {songCount} songs.</Text>
          </div>
        </div>
      )}
    </div>
  )
}

export default LikedSongs
