import React from 'react'

import { TSpotifyAlbum } from '@/types/SpotifyAlbum'
import { CiCalendarDate } from 'react-icons/ci'
import { CiBoxList } from 'react-icons/ci'

import Hyperlink from '@/components/shared/Hyperlink'
import Text from '@/components/shared/Text'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface AlbumCardProps {
  album: TSpotifyAlbum
  showArtist?: boolean
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album, showArtist = false }): JSX.Element => {
  return (
    <Hyperlink href={`/albums/${album.id}`} className="block !no-underline group">
      <Card className="flex flex-col [&_*]:no-underline group-hover:bg-black">
        <CardHeader className="p-0">
          <AspectRatio
            ratio={1 / 1}
            className="w-full rounded-tl-sm rounded-tr-sm overflow-hidden p-1"
          >
            <img
              src={album.images[0]?.url}
              className="object-cover w-full rounded-tl-sm rounded-tr-sm"
            />
          </AspectRatio>
        </CardHeader>
        <CardContent className="py-2 px-4 flex-1">
          <CardTitle>
            <div>
              {album.name.includes('(') ? (
                <>
                  <Text variant="h3" className="block mt-2">
                    {album.name.split('(')[0]}
                  </Text>
                  <Text>({album.name.split('(')[1].slice(0, -1)})</Text>
                </>
              ) : (
                <Text variant="h3" className="block mt-2">
                  {album.name}
                </Text>
              )}
            </div>
            {showArtist && album.artists && album.artists.length > 0 && (
              <Text variant="h5" className="mt-2">
                {album.artists.map((artist, index) => (
                  <React.Fragment key={artist.id}>
                    <Hyperlink href={`/artists/${artist.id}`} variant='icon'> {artist.name}</Hyperlink>
                    {index < album.artists.length - 1 && ', '}
                  </React.Fragment>
                ))}
              </Text>
            )}
          </CardTitle>
        </CardContent>
        <CardFooter className="flex px-4">
          <Text color="muted" className="flex flex-1 items-center -ml-1">
            <CiCalendarDate className="text-2xl mr-2" />
            {album.release_date}
          </Text>
          <Text color="muted" className="flex items-center pr-4">
            <CiBoxList className="text-xl mr-2" />
            {album.total_tracks}
          </Text>
        </CardFooter>
      </Card>
    </Hyperlink>
  )
}

export default AlbumCard
