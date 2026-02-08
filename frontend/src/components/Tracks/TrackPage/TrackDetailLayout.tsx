import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { TSkileyLikedSong } from '@/types/SkileyTrack'
import { TSpotifyArtist } from '@/types/SpotifyArtist'
import { TSpotifyTrack } from '@/types/SpotifyTrack'
import { GiSoundWaves } from 'react-icons/gi'

import TrackAudioFeatures from '@/components/Tracks/TrackPage/TrackAudioFeatures/TrackAudioFeatures'
import TrackDetailGeniusLyrics from '@/components/Tracks/TrackPage/TrackDetailGeniusLyrics'
import TrackDetailSimilarTracks from '@/components/Tracks/TrackPage/TrackDetailSimilarTracks'
import TrackHero from '@/components/Tracks/TrackPage/TrackHero'
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

  return (
    <div className="relative w-full">
      {track && artists[0] && <TrackHero track={track} artists={artists} />}

      <div className="container relative z-10 pt-24">
        <div className="flex space-x-16">
          <div className="w-1/3 pt-4">
            <Text variant="h2" className="mb-4">
              Album
            </Text>
            <div>
              {track ? (
                <>
                  <img src={track.album.images[0]?.url} alt={track.album.name} />
                  <Text variant="h4" className="mt-4">
                    {track.album.name}
                  </Text>
                  {track.album.release_date && <Text>{track.album.release_date}</Text>}
                </>
              ) : (
                <Text color="muted">Loading album info...</Text>
              )}
            </div>
          </div>

          <div className="w-1/3 pt-4">
            {skileyTrack && (
              <div className="mb-16">
                <Text variant="h2" className="mb-4">
                  Audio Features
                </Text>
                <TrackAudioFeatures track={skileyTrack} />
              </div>
            )}

            {!skileyTrack && <TrackDetailSimilarTracks track={track} limit={8} />}

            {skileyTrack && <TrackDetailSimilarTracks track={track} />}

            {!skileyTrack && (
              <div className="mb-16">
                <Text variant="h2" className="mb-4">
                  Audio Features
                </Text>
                <>
                  <Text variant="h6" className="mt-2 mb-4 flex items-center gap-2">
                    <GiSoundWaves className="text-3xl" /> No audio features available.
                  </Text>
                  <Text color="muted">
                    Spotify's audio features endpoints were officially deprecated and restricted in
                    late 2024 due to LLM training.
                  </Text>
                </>
              </div>
            )}
          </div>
          <div className="w-1/3">
            <TrackDetailGeniusLyrics
              track={{
                id: track.id,
                name: track.name,
                artists: track.artists.map((a) => ({ id: a.id, name: a.name })),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrackDetailLayout
