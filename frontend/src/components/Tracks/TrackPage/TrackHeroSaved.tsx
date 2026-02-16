import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { IoMdHeart } from 'react-icons/io'
import { IoArrowBack } from 'react-icons/io5'
import { twMerge } from 'tailwind-merge'

import Hyperlink from '@/components/shared/Hyperlink'
import Text from '@/components/shared/Text'

import { getSpotifyTrack } from '@/services/spotify/getSpotifyTrack'
import { getSpotifyUserHasSavedTrack } from '@/services/spotify/getSpotifyUserHasSavedTrack'

import { db } from '@/lib/index-db'

const TrackHeroSaved = () => {
  const { trackId } = useParams<{ trackId: string }>()
  const [saveStatus, setSaveStatus] = useState<{
    isSaved: boolean
    source: 'spotify' | 'local' | null
  } | null>(null)
  const [playlistsWithTrack, setPlaylistsWithTrack] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    if (!trackId) return

    const checkSaved = async () => {
      try {
        // 1 Check if it's saved in Spotify library
        const saved = await getSpotifyUserHasSavedTrack(trackId)

        if (saved) {
          setSaveStatus({ isSaved: true, source: 'spotify' })
          return
        }

        // 2 Fallback: check if track exists in local Skiley data by name + artist.
        // This is because Spotify can mess up by having different id's for a song.
        const spotifyTrack = await getSpotifyTrack(trackId)
        const trackName = spotifyTrack.name.toLowerCase()
        const mainArtist = spotifyTrack.artists[0]?.name.toLowerCase()

        // Find in playlists of favorite songs.
        const allJobs = await db.libraryJobs.toArray()
        let foundInLocal = false

        for (const job of allJobs) {
          if (foundInLocal) break
          for (const playlist of job.data.playlists) {
            const matchingTrack = playlist.tracks?.some((track) => {
              const spotifyTrackName = track.name?.toLowerCase() === trackName
              const spotifyArtistMatch = track.artists?.some(
                (artist) => artist.name?.toLowerCase() === mainArtist
              )
              return spotifyTrackName && spotifyArtistMatch
            })

            if (matchingTrack) {
              setSaveStatus({ isSaved: true, source: 'local' })
              foundInLocal = true
              break
            }
          }
        }

        if (!foundInLocal) {
          setSaveStatus({ isSaved: false, source: null })
        }
      } catch (error) {
        setSaveStatus(null)
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
        console.log(error)
      }
    }

    findTrackInPlaylists()
  }, [trackId])

  const labelLinkClasses =
    'text-sm whitespace-nowrap bg-blue-500 text-white py-1 px-3 rounded-[6px] hover:bg-blue-700 hover:text-white'

  return (
    <div className='flex items-center'>
      <ul className="grow flex items-center space-x-2">
        <Text as="li">
          <Hyperlink
            className="flex items-center gap-x-2 h-[25px] text-sm bg-white text-black dark:bg-black dark:text-white py-1 px-3 rounded-[6px] hover:no-underline hover:bg-gray-300 dark:hover:bg-gray-700"
            href="/tracks"
          >
            <IoArrowBack /> All tracks
          </Hyperlink>
        </Text>

        {saveStatus?.isSaved && (
          <Text as="li">
            <Hyperlink
              variant="title"
              className={twMerge('flex items-center gap-x-2 h-[25px]', labelLinkClasses)}
              href="/tracks"
            >
              <IoMdHeart className="leading-none" /> Saved {saveStatus.source === 'local' && '(1)'}
            </Hyperlink>
          </Text>
        )}

        {playlistsWithTrack.map((playlist) => (
          <Text as="li" key={playlist.id}>
            <Hyperlink
              variant="title"
              className={twMerge(
                labelLinkClasses,
                'bg-white text-blue-700 border border-blue-500 hover:bg-blue-700 hover:border-blue-700'
              )}
              href={`/playlists/${playlist.id}`}
            >
              {playlist.name}
            </Hyperlink>
          </Text>
        ))}
      </ul>
      <Text className="mt-2 ml-3">
        (1) Check <Hyperlink href="/dev-notes#messy-ids">dev notes</Hyperlink>
      </Text>
    </div>
  )
}

export default TrackHeroSaved
