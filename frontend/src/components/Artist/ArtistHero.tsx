import React, { useEffect, useRef, useState } from 'react'

import { TSpotifyArtist } from '@/types/SpotifyArtist'
import { IoMdHeart } from 'react-icons/io'
import { twMerge } from 'tailwind-merge'

import Hyperlink from '@/components/shared/Hyperlink'
import Text from '@/components/shared/Text'
import { Progress } from '@/components/ui/progress'

type TArtistHeroProps = {
  artist: TSpotifyArtist
  isFollowed: boolean
}

const ArtistHero: React.FC<TArtistHeroProps> = ({ artist, isFollowed = false }): JSX.Element => {
  // refs and logic to check what div is longer, to do rounded corners.
  const titleRef = useRef<HTMLDivElement>(null)
  const followersRef = useRef<HTMLDivElement>(null)
  const [widerDiv, setWiderDiv] = useState<'title' | 'followers' | 'equal' | null>(null)

  useEffect(() => {
    if (titleRef.current && followersRef.current) {
      const width1 = titleRef.current.offsetWidth
      const width2 = followersRef.current.offsetWidth

      if (width1 > width2) {
        setWiderDiv('title')
      } else if (width2 > width1) {
        setWiderDiv('followers')
      } else {
        setWiderDiv('equal')
      }
    }
  }, [artist])

  const heroImage = artist.images?.[0]?.url

  return (
    <>
      <div
        className="w-full -mt-40 absolute h-96 bg-cover blur-sm bg-center bg-no-repeat z-0"
        style={
          heroImage
            ? { backgroundImage: `url(${heroImage})` }
            : {
                background: 'linear-gradient(90deg, #555 20%, #888 50%, #555 80%)',
                backgroundSize: '400% 100%',
              }
        }
      />
      <div className="w-full -mt-4 absolute top-96 h-8 z-0 bg-white dark:bg-background transition duration-500"></div>
      <div className="relative container">
        {isFollowed && (
          <Text className="absolute top-0 right-8">
            <Hyperlink
              href="/artists/following"
              className="text-blue-500 flex items-center gap-x-1 text-lg"
            >
              <IoMdHeart /> Following
            </Hyperlink>
          </Text>
        )}

        <div
          className={twMerge(
            '-mt-4 bg-white dark:bg-black inline-block p-4 rounded-tl-sm rounded-tr-sm rounded-bl-none',
            widerDiv === 'title' ? 'rounded-br-sm' : 'rounded-br-none'
          )}
          ref={titleRef}
        >
          <Text variant="h1">{artist.name}</Text>
          <Progress value={artist.popularity} className="h-1 mt-4 mx-auto" />
        </div>
        <div className="mb-6">
          <div
            className={twMerge(
              'inline-block bg-white dark:bg-black py-2 px-4 rounded-bl-sm rounded-br-sm rounded-tr-sm',
              widerDiv === 'followers' ? 'rounded-tr-sm' : 'rounded-tr-none'
            )}
            ref={followersRef}
          >
            <div className="flex items-center">
              <div>{artist.followers.total.toLocaleString()} followers </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ArtistHero
