import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { TSpotifyAlbum } from '@/types/SpotifyAlbum'
import { FaGoogle } from 'react-icons/fa'
import { FaSpotify } from 'react-icons/fa'
import { IoBatteryDeadSharp } from 'react-icons/io5'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { getSpotifyArtistAlbums } from '@/services/spotify/getSpotifyArtistAlbums'

import Album from './Album'
import CoverMosaic from './Artist/CoverMosaic'

interface AlbumsAndBioProps {
  biographyLastFM?: string
  artistName: string
  artistURI: string
}

const AlbumsAndBio: React.FC<AlbumsAndBioProps> = ({
  biographyLastFM = '',
  artistName,
  artistURI,
}): JSX.Element => {
  const { artistId } = useParams<string>()
  const [albums, setAlbums] = useState<TSpotifyAlbum[] | []>([])
  const [singles, setSingles] = useState<TSpotifyAlbum[] | []>([])
  const [albumsCovers, setAlbumCovers] = useState<string[] | []>([])
  const [activeTab, setActiveTab] = useState('albums')

  const onTabChange = (value: string) => {
    setActiveTab(value)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (artistId) {
          const fetchedAlbums = await getSpotifyArtistAlbums(artistId)
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
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <div className="flex">
            <TabsList className="mb-4">
              <TabsTrigger value="albums">Albums</TabsTrigger>
              <TabsTrigger value="singles">Singles</TabsTrigger>
              {biographyLastFM && biographyLastFM !== '' && (
                <TabsTrigger value="bio">Biography</TabsTrigger>
              )}
            </TabsList>
            {albumsCovers.length > 0 && <CoverMosaic covers={albumsCovers} />}

            <div className="inline-flex h-10 rounded-md bg-muted ml-4 mb-0 p-1 text-muted-foreground">
              <div className="inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none hover:bg-background">
                <a
                  className="text-xl"
                  target="_blank"
                  href={`https://www.google.com/search?q=${artistName}`}
                >
                  <FaGoogle className="text-muted-foreground hover:text-red-500" />
                </a>
              </div>
              <div className="inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-background">
                <a className="text-xl" href={artistURI}>
                  <FaSpotify className="text-muted-foreground hover:text-primary" />
                </a>
              </div>
            </div>
          </div>

          <TabsContent value="albums">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {albums.length > 0 ? (
                albums.map((album) => <Album key={album.id} album={album} />)
              ) : (
                <p className="mt-10 flex items-center">
                  <IoBatteryDeadSharp className="text-4xl mr-4" />
                  <span className="block">No albums available</span>
                </p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="singles">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {singles.length > 0 ? (
                singles.map((album) => <Album key={album.id} album={album} />)
              ) : (
                <p className="mt-10 flex items-center">
                  <IoBatteryDeadSharp className="text-4xl mr-4" />
                  <span className="block">No singles available</span>
                </p>
              )}
            </div>
          </TabsContent>
          {biographyLastFM && biographyLastFM !== '' && (
            <TabsContent value="bio">
              <div
                className="text-sm mt-8"
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
