import { useState, useEffect } from 'react'
//import { useToken } from '../contexts/TokenContext'
import { useParams } from 'react-router-dom'

import { SpotifyArtist } from '@/types/SpotifyArtist'
import { getArtist } from '@/services/SpotifyGetArtist'

import Albums from '@/components/AlbumsAll'
import HeadingOne from '@/components/HeadingOne'

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
    <div className='container flex flex-col flex-1'>
      {artist && (
        <>
          <div
            className='w-2/4 rounded-md absolute h-full bg-contain bg-no-repeat z-0'
            style={{
              backgroundImage: `url(${artist.images[0].url})`
            }}></div>
          <div className='relative z-10'>
            <HeadingOne text={artist.name} />
            <p>{artist.followers.total.toLocaleString()} followers</p>
            <div className='flex w-full'>
              <div className='w-1/2'>
                Genres
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat pariatur ex non
                  consectetur reiciendis excepturi odit voluptatibus quasi voluptatem eligendi!
                  Quibusdam labore ipsum architecto reiciendis animi veritatis dolorem, vero quidem?
                </p>
              </div>
              <div className='w-1/2'>
                <Albums />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Artist
