import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { SpotifyArtist } from '@/types/SpotifyArtist'
import { getArtist } from '@/services/SpotifyGetArtist'

import Albums from '@/components/AlbumsAll'
import TopTracks from '@/components/TopTracks'
import HeadingOne from '@/components/HeadingOne'

import { AspectRatio } from '@/components/ui/aspect-ratio'

const Artist = (): JSX.Element => {
  const { artistId } = useParams<string>()
  const [artist, setArtist] = useState<SpotifyArtist | null>(null)
  //const token = useToken()

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (artistId) {
          const fetchedArtist = await getArtist(artistId)
          setArtist(fetchedArtist)
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
            <div className='bg-white dark:bg-black inline-block p-4 rounded-sm mb-16'>
              <HeadingOne
                text={artist.name}
                classes='text-3xl md:text-6xl font-semibold mb-0 tracking-wide'
              />
            </div>

            <div className='grid grid-cols-4 gap-8'>
              <div className='col-span-2'>
                <Albums />
              </div>
              <div className='col-span-2 pt-16'>
                <div className='grid grid-cols-3 gap-8 -mt-20'>
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
                <p>{artist.followers.total.toLocaleString()} followers</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Artist
