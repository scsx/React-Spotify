import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { IoMdHeart } from 'react-icons/io'
import { twMerge } from 'tailwind-merge'

import Hyperlink from '@/components/shared/Hyperlink'
import Text from '@/components/shared/Text'

import { getSpotifyUserHasSavedTrack } from '@/services/spotify/getSpotifyUserHasSavedTrack'

import { db } from '@/lib/index-db'

const TrackHeroSaved = () => {
  const { trackId } = useParams<{ trackId: string }>()
  const [isSavedInLikedSongs, setIsSavedInLikedSongs] = useState<boolean | null>(null)
  const [playlistsWithTrack, setPlaylistsWithTrack] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    if (!trackId) return

    const checkSaved = async () => {
      try {
        const saved = await getSpotifyUserHasSavedTrack(trackId)
        setIsSavedInLikedSongs(saved)
      } catch {
        setIsSavedInLikedSongs(null)
      }
    }

    checkSaved()
  }, [trackId])

  useEffect(() => {
    if (!trackId) return

    const findTrackInPlaylists = async () => {
      try {
        const allJobs = await db.libraryJobs.toArray()
        const playlists: { id: string; name: string }[] = []

        allJobs.forEach((job) => {
          job.data.playlists.forEach((playlist) => {
            const hasTrack = playlist.tracks?.some((track) => track.id === trackId)
            if (hasTrack) {
              playlists.push({ id: playlist.id, name: playlist.name })
            }
          })
        })

        setPlaylistsWithTrack(playlists)
      } catch (error) {
        console.error('Error finding track in playlists:', error)
      }
    }

    findTrackInPlaylists()
  }, [trackId])

  const labelLinkClasses =
    'text-xs whitespace-nowrap bg-blue-500 text-white py-1 px-3 rounded-[6px] hover:bg-blue-700 hover:text-white'

  return (
    <ul className="flex flex-col items-end space-y-2">
      {isSavedInLikedSongs && (
        <Text as="li">
          <Hyperlink
            variant="title"
            className={twMerge('flex items-center gap-2', labelLinkClasses)}
            href="/tracks"
          >
            <IoMdHeart /> Saved
          </Hyperlink>
        </Text>
      )}

      {playlistsWithTrack.map((playlist) => (
        <Text as="li" key={playlist.id}>
          <Hyperlink
            variant="title"
            className={labelLinkClasses}
            href={`/playlists/${playlist.id}`}
          >
            {playlist.name}
          </Hyperlink>
        </Text>
      ))}

      <Text as="li" className="!mt-4">
        <Hyperlink
          className="text-xs bg-white text-black dark:bg-black dark:text-white py-1 px-3 rounded-[6px] hover:no-underline hover:bg-gray-300 dark:hover:bg-gray-700"
          href="/tracks"
        >
          Back to tracks
        </Hyperlink>
      </Text>
    </ul>
  )
}

export default TrackHeroSaved
