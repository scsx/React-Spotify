import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { SpotifyAlbum } from '@/types/SpotifyAlbum'
import { getArtistAlbums } from '@/services/SpotifyGetArtistAlbums'
import Album from './Album'
import CoverMosaic from './CoverMosaic'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IoBatteryDeadSharp } from 'react-icons/io5'

interface AlbumsAndBioProps {
  biographyLastFM?: string
}

const AlbumsAndBio: React.FC<AlbumsAndBioProps> = ({ biographyLastFM = '' }): JSX.Element => {
  const { artistId } = useParams<string>()
  const [albums, setAlbums] = useState<SpotifyAlbum[] | []>([])
  const [singles, setSingles] = useState<SpotifyAlbum[] | []>([])
  const [albumsCovers, setAlbumCovers] = useState<string[] | []>([])
  const [activeTab, setActiveTab] = useState('albums')

  const onTabChange = (value: string) => {
    setActiveTab(value)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (artistId) {
          const fetchedAlbums = await getArtistAlbums(artistId)
          // Albums and singles info.
          const resultAlbums = fetchedAlbums.filter((album) => album.album_type === 'album')
          const resultSingles = fetchedAlbums.filter((album) => album.album_type === 'single')
          setAlbums(resultAlbums)
          setSingles(resultSingles)

          // Albums and singles covers.
          let allCovers: string[] = []
          fetchedAlbums.forEach((item) => {
            const cover = item.images[0].url
            if (cover) {
              allCovers.push(cover)
            }
          })
          setAlbumCovers(allCovers)
        }
      } catch (error) {
        console.error('Error fetching country details:', error)
      }
    }

    fetchData()
  }, [artistId, biographyLastFM])

  useEffect(() => {
    if (albums.length === 0 && singles.length !== 0) {
      setActiveTab('singles')
    } else {
      setActiveTab('albums')
    }
  }, [albums, singles])

  return (
    <>
      {albums.length > 0 || singles.length > 0 ? (
        <Tabs value={activeTab} onValueChange={onTabChange} className='w-full'>
          <TabsList className='mb-4'>
            <TabsTrigger value='albums'>Albums</TabsTrigger>
            <TabsTrigger value='singles'>Singles</TabsTrigger>
            {biographyLastFM && biographyLastFM !== '' && (
              <TabsTrigger value='bio'>Biography</TabsTrigger>
            )}
          </TabsList>
          {albumsCovers.length > 0 && <CoverMosaic covers={albumsCovers} />}
          
          <TabsContent value='albums'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {albums.length > 0 ? (
                albums.map((album) => <Album key={album.id} album={album} />)
              ) : (
                <p className='mt-10 flex items-center'>
                  <IoBatteryDeadSharp className='text-4xl mr-4' />
                  <span className='block'>No albums available</span>
                </p>
              )}
            </div>
          </TabsContent>
          <TabsContent value='singles'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {singles.length > 0 ? (
                singles.map((album) => <Album key={album.id} album={album} />)
              ) : (
                <p className='mt-10 flex items-center'>
                  <IoBatteryDeadSharp className='text-4xl mr-4' />
                  <span className='block'>No singles available</span>
                </p>
              )}
            </div>
          </TabsContent>
          {biographyLastFM && biographyLastFM !== '' && (
            <TabsContent value='bio'>
              <div
                className='text-sm mt-8'
                dangerouslySetInnerHTML={{ __html: biographyLastFM.replace(/\n/g, '<br>') }}
              />
            </TabsContent>
          )}
        </Tabs>
      ) : null}
    </>
  )
}

export default AlbumsAndBio
