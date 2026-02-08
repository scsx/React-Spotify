import { useEffect, useState } from 'react'

import {
  TLastFmSimilarTracksError,
  TLastFmSimilarTracksResponse,
} from '@/types/LastFmSimilarTracks'
import { TSpotifyTrack } from '@/types/SpotifyTrack'
import { FaLastfm } from 'react-icons/fa'

import Hyperlink from '@/components/shared/Hyperlink'
import Text from '@/components/shared/Text'

import { getLastFMSimilarTracks } from '@/services/lastfm/getLastFMSimilarTracks'

type TTrackDetailSimilarTracksProps = {
  track: TSpotifyTrack
  limit?: number
}

const TrackDetailSimilarTracks = ({
  track,
  limit = 5,
}: TTrackDetailSimilarTracksProps): JSX.Element => {
  const [similarTracks, setSimilarTracks] = useState<
    TLastFmSimilarTracksResponse | TLastFmSimilarTracksError | null
  >(null)

  useEffect(() => {
    if (!track) return

    const fetchSimilarTracks = async () => {
      try {
        const artistName = track.artists[0]?.name
        if (!artistName) return

        const data = await getLastFMSimilarTracks(artistName, track.name, limit)
        setSimilarTracks(data)
        console.log('Similar tracks fetched:', data)
      } catch (error) {
        console.error('Erro ao carregar similar tracks:', error)
      }
    }

    fetchSimilarTracks()
  }, [track, limit])

  return (
    <div className="mb-16">
      <Text variant="h2" className="mb-4 flex items-center gap-4">
        <span>Similar tracks</span>
        <FaLastfm className="text-red-500 text-3xl mt-1" />
      </Text>
      {similarTracks && !('error' in similarTracks) ? (
        similarTracks.similartracks?.track?.length ? (
          <div>
            {similarTracks.similartracks.track.map((track, index) => {
              const largeImage = track.image?.find(
                (img) => img.size === 'large' || img.size === 'extralarge'
              )
              const imageUrl = largeImage?.['#text'] || track.image?.[2]?.['#text']

              return (
                <div key={index} className="flex gap-4 py-3">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={track.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <Text variant="h5">{track.name}</Text>
                    <Text color="muted">
                      <Hyperlink variant="title" href={`/artists/?searchKey=${track.artist.name}`}>
                        {track.artist.name}
                      </Hyperlink>
                    </Text>
                    {track.playcount && (
                      <Text color="muted" className="text-xs">
                        {parseInt(track.playcount).toLocaleString()} plays
                      </Text>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <Text color="muted">No similar tracks found for this song.</Text>
        )
      ) : (
        <Text>Loading similar tracks...</Text>
      )}
    </div>
  )
}

export default TrackDetailSimilarTracks
