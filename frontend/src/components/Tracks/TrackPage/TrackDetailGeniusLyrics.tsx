import { useEffect, useState } from 'react'

import { TGeniusLyricsResult, TSpotifyTrackInput } from '@/types/Genius'

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

        console.log(lyricsBase)
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

  if (error === 'login')
    return (
      <button
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
    )

  if (error === 'failed') return <div>Lyrics unavailable</div>
  if (!lyricsBase) return <div>Loading lyrics…</div>

  return <pre>{lyricsBase.lyrics}</pre>
}

export default TrackDetailGeniusLyrics
