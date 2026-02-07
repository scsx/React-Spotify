import { useEffect, useState } from 'react'

import { TGeniusLyricsResult, TSpotifyTrackInput } from '@/types/Genius'
import { SiGenius } from 'react-icons/si'

import Hyperlink from '@/components/shared/Hyperlink'
import Text from '@/components/shared/Text'

import { getGeniusLyrics } from '@/services/genius/getGeniusLyrics'

type TTrackDetailGeniusLyricsProps = {
  track: TSpotifyTrackInput
}

const TrackDetailGeniusLyrics = ({ track }: TTrackDetailGeniusLyricsProps): JSX.Element | null => {
  const [lyricsBase, setLyricsBase] = useState<TGeniusLyricsResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getGeniusLyrics(track)
        setLyricsBase(res)
        setError(null)
      } catch (e: unknown) {
        if (e instanceof Error && e.message.includes('401')) {
          setError('login')
        } else {
          setError('failed')
        }
      }
    }

    load()
  }, [track.id])

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data === 'GENIUS_AUTH_SUCCESS') {
        setError(null)
        setLyricsBase(null)
        getGeniusLyrics(track).then(setLyricsBase)
        console.log(lyricsBase)
      }
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [track.id])

  return (
    <div>
      <Text
        variant="h2"
        className="inline-flex items-baseline bg-gray-500 dark:bg-gray-800 text-white rounded-t-md px-8 pb-0 pt-4"
      >
        Lyrics from{' '}
        <span className="flex items-baseline text-yellow-genius">
          <SiGenius className="ml-4 mr-2 text-xl" /> Genius
        </span>
      </Text>

      <div className="bg-gray-500 dark:bg-gray-800 text-white rounded-br-md rounded-bl-md rounded-tr-md px-8 pt-12 pb-4">
        {error === 'login' && (
          <button
            className="border border-gray-600 rounded-md py-1 px-4"
            onClick={() =>
              window.open(
                'https://spotify-clone.local:3001/api/genius/auth/genius',
                'geniusLogin',
                'width=600,height=800'
              )
            }
          >
            Connect Genius to see lyrics
          </button>
        )}

        {error === 'failed' && (
          <Text className="text-inherit font-normal italic" variant="h4">
            Lyrics unavailable (error)
          </Text>
        )}

        {!error && !lyricsBase && (
          <Text className="text-inherit font-normal italic" variant="h4">
            Loading lyrics...
          </Text>
        )}

        {!error && lyricsBase && (
          <>
            {lyricsBase.lyrics ? (
              <pre className="text-sm whitespace-pre-wrap break-words">{lyricsBase.lyrics}</pre>
            ) : (
              <Text className="text-inherit font-normal" variant="h4">
                Lyrics not found.
              </Text>
            )}

            {lyricsBase.url && (
              <Text variant="h5" className="mt-4">
                <Hyperlink
                  href={lyricsBase.url}
                  external
                  className="text-white hover:text-yellow-genius"
                >
                  {lyricsBase.url}
                </Hyperlink>
              </Text>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default TrackDetailGeniusLyrics
