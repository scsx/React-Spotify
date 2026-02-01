import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { TSkileyLikedSong } from '@/types/SkileyTrack'
import { TSpotifyArtist } from '@/types/SpotifyArtist'
import { TSpotifyTrack } from '@/types/SpotifyTrack'
import { GiSoundWaves } from 'react-icons/gi'

import CardArtistLight from '@/components/Artist/CardArtistLight'
import TrackAudioFeatures from '@/components/Tracks/TrackPage/TrackAudioFeatures/TrackAudioFeatures'
import TrackDetailGeniusLyrics from '@/components/Tracks/TrackPage/TrackDetailGeniusLyrics'
import TrackVersusUser from '@/components/Tracks/TrackPage/TrackVersusUser'
import Text from '@/components/shared/Text'

import { getLocalSkileyTrackById } from '@/services/skiley/getLocalSkileyTrackById'
import { getSpotifyArtist } from '@/services/spotify/getSpotifyArtist'
import { getSpotifyTrack } from '@/services/spotify/getSpotifyTrack'

const TrackDetailLayout = (): JSX.Element | null => {
  const { trackId } = useParams<{ trackId: string }>()
  const [track, setTrack] = useState<TSpotifyTrack | null>(null)
  const [skileyTrack, setSkileyTrack] = useState<TSkileyLikedSong | null>(null)
  const [artists, setArtists] = useState<TSpotifyArtist[]>([])

  useEffect(() => {
    if (!trackId) return

    const fetchTrack = async () => {
      try {
        const trackData = await getSpotifyTrack(trackId)
        setTrack(trackData)

        const artistIds = trackData.artists.map((a) => a.id)

        const artistsData = await Promise.all(artistIds.map((id) => getSpotifyArtist(id)))

        setArtists(artistsData)
      } catch (error) {
        console.error('Erro ao carregar detalhes da track:', error)
      }
    }

    fetchTrack()
  }, [trackId])

  useEffect(() => {
    if (!trackId) return

    const loadLocalTrack = async () => {
      const localTrack = await getLocalSkileyTrackById(trackId)
      setSkileyTrack(localTrack)
    }

    loadLocalTrack()
  }, [trackId])

  if (!track) return null

  const hasExtraInfo = track.name.includes('(')
  const mainTitle = hasExtraInfo ? track.name.split('(')[0] : track.name
  const extraTitle = hasExtraInfo ? `(${track.name.split('(')[1].slice(0, -1)})` : null

  return (
    <>
      {hasExtraInfo ? (
        <>
          <Text variant="h1" className="block mb-1">
            {mainTitle}
          </Text>
          <Text variant="h3" className="mb-2">
            {extraTitle}
          </Text>
        </>
      ) : (
        <Text variant="h1" className="mb-2">
          {mainTitle}
        </Text>
      )}

      <div className="flex space-x-12 mt-16">
        <div className="w-1/2">

          {/* <Text className="mt-16">TODO:</Text>
          <ul>
            <li>Similar tracks</li>
            <li>Cover</li>
            <li>Scrobbles</li>
          </ul> */}

          {/* <pre className="p-8 bg-gray-500 dark:bg-gray-800 text-white rounded-br-md rounded-bl-md rounded-tr-md whitespace-pre-wrap break-words">
            {JSON.stringify(track)}
            <br />
            <br />
            <br />
            {JSON.stringify(skileyTrack)}
          </pre>
 */}

          <TrackDetailGeniusLyrics
            track={{
              id: track.id,
              name: track.name,
              artists: track.artists.map((a) => ({ id: a.id, name: a.name })),
            }}
          />
        </div>

        <div className="w-1/2">
          <div className="grid grid-cols-2 gap-4">
            {artists.map((artist) => (
              <CardArtistLight key={artist.id} artist={artist} />
            ))}
          </div>

          <div className="mb-16">
            <TrackVersusUser />
          </div>
          <div className="mb-16">
            <Text variant="h2" className="mb-4">
              Audio Features
            </Text>
            {skileyTrack ? (
              <TrackAudioFeatures track={skileyTrack} />
            ) : (
              <>
                <Text variant="h6" className="mt-2 mb-4 flex items-center gap-2">
                  <GiSoundWaves className="text-3xl" /> No audio features available.
                </Text>
                <Text color="muted">
                  Spotify's audio features endpoints were officially deprecated and restricted in
                  late 2024 due to LLM training.
                </Text>
              </>
            )}
          </div>
          <div className="mb-16">
            <Text variant="h2" className="mb-4">
              Album
            </Text>
          </div>
        </div>
      </div>
    </>
  )
}

export default TrackDetailLayout
