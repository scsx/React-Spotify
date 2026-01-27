import { TSkileyLikedSong } from '@/types/SkileyTrack'
import { GrCircleQuestion } from 'react-icons/gr'
import { MdOutlineInfo } from 'react-icons/md'
import { twMerge } from 'tailwind-merge'

import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'

type AdvancedTracklistDetailProps = {
  track: TSkileyLikedSong | null
  albumImageUrl: string | null
  isAvailableInPT: boolean | null
}

// TODO: passar features e outros dados para a pagina de detalhes da track.

const AdvancedTracklistDetail = ({
  track,
  albumImageUrl,
  isAvailableInPT,
}: AdvancedTracklistDetailProps) => {
  if (!track) return null

  const features: { key: keyof TSkileyLikedSong; label: string }[] = [
    { key: 'trackFeatureAcousticness', label: 'Acousticness' },
    { key: 'trackFeatureDanceability', label: 'Danceability' },
    { key: 'trackFeatureEnergy', label: 'Energy' },
    { key: 'trackFeatureInstrumentalness', label: 'Instrumentalness' },
    { key: 'trackFeatureKey', label: 'Key' },
    { key: 'trackFeatureLiveness', label: 'Liveness' },
    { key: 'trackFeatureLoudness', label: 'Loudness' },
    { key: 'trackFeatureSpeechiness', label: 'Speechiness' },
    { key: 'trackFeatureTempo', label: 'Tempo' },
    { key: 'trackFeatureTimeSignature', label: 'Time Signature' },
    { key: 'trackFeatureValence', label: 'Valence' },
    { key: 'trackPopularity', label: 'Popularity' },
  ]

  const getSpotifyIdFromUrl = (url: string) => {
    if (!url) return ''
    const parts = url.split('/')
    return parts[parts.length - 1] || ''
  }

  const linkRows = [
    {
      label: 'Track',
      site: `/tracks/${getSpotifyIdFromUrl(track.trackUrl)}`,
      web: track.trackUrl,
      app: track.trackUri,
    },
    {
      label: 'Album',
      site: `/albums/${getSpotifyIdFromUrl(track.albumUrl)}`,
      web: track.albumUrl,
      app: track.albumUri,
    },
    {
      label: 'Artist',
      site: `/artists/${getSpotifyIdFromUrl(track.artistUrl)}`,
      web: track.artistUrl,
      app: track.artistUri,
    },
  ]

  const boxClass = 'pt-4 px-6 pb-2 mb-4 border bg-background dark:bg-black'

  return (
    <div className="mt-4 sticky top-24">
      <div className={boxClass}>
        <Text variant="h6" className="mb-2">
          Track
        </Text>
        <Text className="mb-6 leading-none text-xl">{track.trackName}</Text>
        <Text className="mb-2">
          <Hyperlink href={`/tracks/${getSpotifyIdFromUrl(track.trackUrl)}`}>See track details</Hyperlink>
        </Text>
      </div>

      <div className={boxClass}>
        {/* <Text variant="h6" className="mb-2">
        Links
      </Text>
      <table className="w-full table-auto">
        <tbody>
          {linkRows.map(({ label, site, web, app }) => {
            const isTrackRow = label === 'Track'
            const linkClass = twMerge(isTrackRow && !isAvailableInPT && 'text-red-500')

            return (
              <tr key={label}>
                <td>
                  <Text>{label}</Text>
                </td>
                <td>
                  <Text>
                    <Hyperlink href={site}>site</Hyperlink>
                  </Text>
                </td>
                <td>
                  <Text>
                    <Hyperlink href={web} className={linkClass} external>
                      web
                    </Hyperlink>
                  </Text>
                </td>
                <td>
                  <Text>
                    <Hyperlink href={app} className={linkClass} external>
                      app
                    </Hyperlink>
                  </Text>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <Text className="text-xs mt-2 mb-8 flex items-center" color="muted">
        <MdOutlineInfo className="mr-2 text-lg" /> Red = not available in PT
      </Text> */}

        <Text variant="h6" className="mb-4">
          Album
        </Text>

        {albumImageUrl ? (
          <img
            src={albumImageUrl}
            alt={`Capa do álbum ${track.albumName}`}
            className="w-full aspect-square mb-2"
          />
        ) : (
          <div className="w-full aspect-square bg-gray-700 rounded-lg mb-2 flex items-center justify-center">
            <Text className="text-gray-400 text-sm">No image</Text>
          </div>
        )}

        <Text className="mb-2 mt-4 !leading-tight text-lg">{track.albumName}</Text>
        <Text className="mb-2 leading-none" color="muted">
          {track.albumRecordLabel}, {track.albumReleaseDate}
        </Text>

        {/* <Text variant="h6" className="mt-8 mb-4 flex items-center justify-between">
          <span>Features</span>
          <Hyperlink href="/playlists/liked-songs/feature-stats" className="text-lg" variant="icon">
            <GrCircleQuestion />
          </Hyperlink>
        </Text>
        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
          {features.map(({ key, label }) => (
            <div key={key}>
              <Text color="muted">{label}</Text>
              <Text>{track[key]}</Text>
            </div>
          ))}
        </div> */}
      </div>

      <div className={boxClass}>
        <Text variant="h6" className="mb-2">
          About
        </Text>
        <Text className='mb-2'>
          These tracks are loaded locally from a file exported via{' '}
          <Hyperlink href="https://skiley.net/playlists" external>
            skiley.net
          </Hyperlink>
          . See the <Hyperlink href="/dev-notes#skiley">dev notes</Hyperlink> for more details.
        </Text>
      </div>
    </div>
  )
}

export default AdvancedTracklistDetail
