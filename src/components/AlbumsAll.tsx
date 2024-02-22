import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { SpotifyAlbum } from '@/types/SpotifyAlbum'
import { getArtistAlbums } from '@/services/SpotifyGetArtistAlbums'
import Album from './Album'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const Albums = (): JSX.Element => {
  const { artistId } = useParams<string>()
  const [albums, setAlbums] = useState<SpotifyAlbum[] | []>([])
  //const token = useToken()

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (artistId) {
          const fetchedAlbums = await getArtistAlbums(artistId)
          console.log(fetchedAlbums)
          setAlbums(fetchedAlbums)
        }
      } catch (error) {
        console.error('Error fetching country details:', error)
      }
    }

    fetchData()
  }, [artistId])

  return (
    <>
      {albums.length > 0 ? (
        <Tabs defaultValue='albums' className='w-full'>
          <TabsList className='mb-4'>
            <TabsTrigger value='albums'>Albums</TabsTrigger>
            <TabsTrigger value='singles'>Singles</TabsTrigger>
          </TabsList>
          <TabsContent value='albums'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
              {albums
                .filter((album) => album.album_type === 'album')
                .map((album) => {
                  return <Album key={album.id} album={album} />
                })}
            </div>
          </TabsContent>
          <TabsContent value='singles'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
              {albums
                .filter((album) => album.album_type === 'single')
                .map((album) => {
                  return <Album key={album.id} album={album} />
                })}
            </div>
          </TabsContent>
        </Tabs>
      ) : null}
    </>
  )
}

export default Albums
