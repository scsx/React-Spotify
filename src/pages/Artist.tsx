import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { SpotifyArtist } from '@/types/SpotifyArtist'
import { getArtist } from '@/services/SpotifyGetArtist'

import Albums from '@/components/AlbumsAll'
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
          console.log(fetchedArtist)
          setArtist(fetchedArtist)
        }
      } catch (error) {
        console.error('Error fetching country details:', error)
      }
    }

    fetchData()
  }, [artistId])

  return (
    <div className='container flex flex-col flex-1'>
      {artist && (
        <>
          {/* <div
            className='w-2/6 rounded-md absolute h-full bg-contain bg-no-repeat z-0'
            style={{
              backgroundImage: `url(${artist.images[0].url})`
            }}></div> */}
          <div className='relative'>
            <HeadingOne text={artist.name} />
            
            <div className='grid grid-cols-4 gap-8'>
              <div className='col-span-2'>
                <Albums />
              </div>
              <div className='col-span-2 pt-16'>
                <div className='grid grid-cols-3 gap-8'>
                  <div className='col-start-2 col-end-4'>
                    <AspectRatio ratio={1 / 1}>
                      <img className='rounded-sm' src={`${artist.images[0].url}`} alt='' />
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
