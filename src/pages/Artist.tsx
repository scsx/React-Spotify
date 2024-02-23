import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { SpotifyArtist } from '@/types/SpotifyArtist'
import { getArtist } from '@/services/SpotifyGetArtist'

import Albums from '@/components/AlbumsAll'
import TopTracks from '@/components/TopTracks'
import RelatedArtists from '@/components/RelatedArtists'
import HeadingOne from '@/components/HeadingOne'

import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Badge } from '@/components/ui/badge'

const Artist = (): JSX.Element => {
  const { artistId } = useParams<string>()
  const [artist, setArtist] = useState<SpotifyArtist | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (artistId) {
          const fetchedArtist = await getArtist(artistId)
          setArtist(fetchedArtist)
          console.log(fetchedArtist)
        }
      } catch (error) {
        console.error('Error fetching country details:', error)
      }
    }

    fetchData()
  }, [artistId])

  return (
    <div className='flex flex-col flex-1'>
      {artist && (
        <>
          <div
            className='w-full -mt-40 absolute h-96 bg-cover blur-sm bg-center bg-no-repeat z-0'
            style={{
              backgroundImage: `url(${artist.images[0].url})`
            }}></div>
          <div className='w-full -mt-4 absolute top-96 h-8 z-0 bg-white dark:bg-background transition duration-500'></div>
          <div className='relative container'>
            <div className='bg-white dark:bg-black inline-block p-4 rounded-sm rounded-bl-none'>
              <HeadingOne
                text={artist.name}
                classes='text-3xl md:text-6xl font-semibold mb-0 tracking-wide'
              />
            </div>
            <div className='mb-6 '>
              <p className='bg-white dark:bg-black inline-block w-auto py-2 px-4 rounded-bl-sm rounded-br-sm'>
                {artist.followers.total.toLocaleString()} followers
              </p>
            </div>

            <div className='grid grid-cols-4 gap-16'>
              <div className='col-span-2'>
                <Albums />
              </div>
              <div className='col-span-2 pt-16'>
                <div className='grid grid-cols-3 gap-8 -mt-28'>
                  <div className='col-start-2 col-end-4'>
                    <AspectRatio ratio={1 / 1}>
                      <img
                        className='rounded-sm p-1 bg-white dark:bg-black'
                        src={`${artist.images[0].url}`}
                        alt=''
                      />
                    </AspectRatio>
                  </div>
                </div>
                <div>
                  <h3 className='mt-10 mb-4 text-1xl md:text-3xl'>Top Tracks</h3>
                  <TopTracks artistId={artist.id} />
                </div>
                <div>
                  <h3 className='mt-14 mb-4 text-1xl md:text-3xl'>Genres</h3>
                  {artist.genres.length > 0 &&
                    artist.genres.map((genre) => (
                      <Link key={genre} to={`/genre/${genre}`}>
                        <Badge
                          variant='outline'
                          className='text-sm mt-2 mr-2 font-normal bg-secondary hover:bg-primary dark:hover:text-white dark:text-muted-foreground'>
                          {genre}
                        </Badge>
                      </Link>
                    ))}
                </div>
                <div>
                  <h3 className='mt-14 mb-4 text-1xl md:text-3xl'>Related Artists</h3>
                  <RelatedArtists artistId={artist.id} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Artist
