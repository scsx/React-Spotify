import { useEffect, useRef, useState } from 'react'

import { TSpotifyArtist } from '@/types/SpotifyArtist'
import { TSpotifyTrack } from '@/types/SpotifyTrack'
import { IoMdHeart } from 'react-icons/io'
import { twMerge } from 'tailwind-merge'

import Hyperlink from '@/components/shared/Hyperlink'
import Text from '@/components/shared/Text'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Progress } from '@/components/ui/progress'

type TTrackHeroProps = {
  track: TSpotifyTrack
  artists: TSpotifyArtist[]
}

const TrackHero = ({ track, artists }: TTrackHeroProps) => {
  const titleRef = useRef<HTMLDivElement>(null)
  const artistRef = useRef<HTMLDivElement>(null)
  const [widerDiv, setWiderDiv] = useState<'title' | 'artist' | 'equal' | null>(null)

  useEffect(() => {
    if (titleRef.current && artistRef.current) {
      const w1 = titleRef.current.offsetWidth
      const w2 = artistRef.current.offsetWidth

      if (w1 > w2) setWiderDiv('title')
      else if (w2 > w1) setWiderDiv('artist')
      else setWiderDiv('equal')
    }
  }, [track, artists])

  const heroImage = track.album.images?.[0]?.url
  const hasExtraInfo = track.name.includes('(')
  const mainTitle = hasExtraInfo ? track.name.split('(')[0] : track.name
  const extraTitle = hasExtraInfo ? `(${track.name.split('(')[1].slice(0, -1)})` : null
  const smallerTitle = mainTitle.length > 30

  return (
    <>
      <div className="relative h-96">
        <div
          className="w-full -mt-40 absolute h-96 bg-cover blur-sm bg-center bg-no-repeat z-0"
          style={heroImage ? { backgroundImage: `url(${heroImage})` } : undefined}
        />
        <div className="w-full absolute bottom-36 h-8 z-0 bg-white dark:bg-background transition duration-500"></div>
      </div>

      <div className="relative container z-10 -mt-96">
        <div
          className={twMerge(
            '-mt-4 max-w-[66.67%] bg-white dark:bg-black inline-block p-4 rounded-tl-sm rounded-tr-sm',
            widerDiv === 'title' ? 'rounded-br-sm' : 'rounded-br-none'
          )}
          ref={titleRef}
        >
          {hasExtraInfo ? (
            <>
              <Text
                variant="h1"
                as="h1"
                className={twMerge('block mb-1', smallerTitle && 'text-xl md:text-4xl')}
              >
                {mainTitle}
              </Text>
              <Text variant="h3" className="mb-2">
                {extraTitle}
              </Text>
            </>
          ) : (
            <Text
              variant="h1"
              as="h1"
              className={twMerge('mb-2', smallerTitle && 'text-xl md:text-4xl')}
            >
              {mainTitle}
            </Text>
          )}
          <Progress value={track.popularity} className="h-1 mt-4 mx-auto" />
        </div>

        <div className="mb-6">
          <div
            className={twMerge(
              'inline-flex items-center gap-8 bg-white dark:bg-black pt-2 pb-4 px-4 rounded-bl-sm rounded-br-sm',
              widerDiv === 'artist' ? 'rounded-tr-sm' : 'rounded-tr-none'
            )}
            ref={artistRef}
          >
            {artists.map((artist) => (
              <div key={artist.id} className="flex items-center gap-2">
                <div className="w-8 overflow-hidden rounded-full">
                  <AspectRatio ratio={1}>
                    <img
                      src={artist.images[0]?.url}
                      alt={artist.name}
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                </div>
                <Text variant="h4">
                  <Hyperlink href={`/artists/${artist.id}`} variant="title">
                    {artist.name}
                  </Hyperlink>
                </Text>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute top-0 right-8 bg-blue-500 text-white py-1 px-3 rounded-sm">
          <Text className='flex items-center gap-2'><IoMdHeart /> Saved in liked songs</Text>

        </div>
      </div>
    </>
  )
}

export default TrackHero
