import React from 'react'

import { TSpotifyArtist } from '@/types/SpotifyArtist'

import Text from '@/components/Text'
import { Progress } from '@/components/ui/progress'

interface ArtistHeroProps {
  artist: TSpotifyArtist
}

const ArtistHero: React.FC<ArtistHeroProps> = ({ artist }): JSX.Element => {
  return (
    <>
      <div
        className="w-full -mt-40 absolute h-96 bg-cover blur-sm bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url(${artist.images[0].url})`,
        }}
      ></div>
      <div className="w-full -mt-4 absolute top-96 h-8 z-0 bg-white dark:bg-background transition duration-500"></div>
      <div className="relative container">
        <div className="-mt-4 bg-white dark:bg-black inline-block p-4 rounded-sm rounded-bl-none">
          <Text variant="h1">{artist.name}</Text>
          <Progress value={artist.popularity} className="h-1 mt-4 mx-auto" />
        </div>
        <div className="mb-6">
          <div className="inline-block bg-white dark:bg-black py-2 px-4 rounded-bl-sm rounded-br-sm">
            <div className="flex items-center">
              <div>{artist.followers.total.toLocaleString()} followers</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ArtistHero
