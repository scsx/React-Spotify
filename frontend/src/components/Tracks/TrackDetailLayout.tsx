import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { TSpotifyTrack } from '@/types/SpotifyTrack'

import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'

import { getSpotifyTrack } from '@/services/spotify/getSpotifyTrack'

const TrackDetailLayout = (): JSX.Element | null => {
  const { trackId } = useParams<{ trackId: string }>()
  const [track, setTrack] = useState<TSpotifyTrack | null>(null)

  useEffect(() => {
    if (!trackId) return

    const fetchTrack = async () => {
      try {
        const trackData = await getSpotifyTrack(trackId)
        setTrack(trackData)
      } catch (error) {
        console.error('Erro ao carregar detalhes da track:', error)
      }
    }

    fetchTrack()
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

      <Text variant="h3" className="font-bold">
        {track.artists.map((artist, index, array) => (
          <span key={artist.id}>
            <Hyperlink href={`/artists/${artist.id}`} variant="icon">
              {artist.name}
            </Hyperlink>
            {index < array.length - 1 && ', '}
          </span>
        ))}
      </Text>

      <div className="flex space-x-12">
        <div className="w-3/4">
          <Text className="mt-16">TODO:</Text>
          <ul>
            <li>Similar tracks</li>
            <li>Audio features</li>
            <li>Cover</li>
            <li>Scrobbles</li>
          </ul>
        </div>

        <div className="w-1/4">
          <Text>TODO: Playlists containing this track</Text>
        </div>
      </div>
    </>
  )
}

export default TrackDetailLayout
