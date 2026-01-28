import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { TSpotifyAlbum } from '@/types/SpotifyAlbum'
import { FaGoogle, FaSpotify } from 'react-icons/fa'
import { IoBatteryDeadSharp } from 'react-icons/io5'

import Hyperlink from '@/components/Hyperlink'
import Loading from '@/components/Loading'
import Text from '@/components/Text'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { getSpotifyArtistAlbums } from '@/services/spotify/getSpotifyArtistAlbums'

import AlbumCard from '../Album/AlbumCard'
import CoverMosaic from './CoverMosaic'

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
  const [isLoading, setIsLoading] = useState(true)

  const onTabChange = (value: string) => {
    setActiveTab(value)
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      try {
        if (artistId) {
          const fetchedAlbums = await getSpotifyArtistAlbums(artistId)
          // Albums and singles info.
          const resultAlbums = fetchedAlbums.filter((album) => album.album_type === 'album')
          const resultSingles = fetchedAlbums.filter((album) => album.album_type === 'single')
          setAlbums(resultAlbums)
          setSingles(resultSingles)

          // Albums and singles covers.
          const allCovers: string[] = []
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
      } finally {
        setIsLoading(false)
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
      {isLoading ? (
        <div className="mt-16">
          <Loading type="skeleton" gridSize="2x2" />
        </div>
      ) : albums.length > 0 || singles.length > 0 ? (
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
                <Hyperlink external href={`https://www.google.com/search?q=${artistName}`}>
                  <FaGoogle className="text-muted-foreground hover:text-red-500" />
                </Hyperlink>
              </div>
              <div className="inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-background">
                <Hyperlink external href={artistURI}>
                  <FaSpotify className="text-muted-foreground hover:text-primary" />
                </Hyperlink>
              </div>
            </div>
          </div>

          <TabsContent value="albums">
            {albums.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {albums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            ) : (
              <div className="min-h-[300px] flex items-center justify-center">
                <Text className="flex flex-col items-center">
                  <IoBatteryDeadSharp className="text-5xl mr-4" />
                  <span className="block text-2xl">No albums available</span>
                </Text>
              </div>
            )}
          </TabsContent>
          <TabsContent value="singles">
            {singles.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {singles.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            ) : (
              <div className="min-h-[300px] flex items-center justify-center">
                <Text className="flex flex-col items-center">
                  <IoBatteryDeadSharp className="text-5xl mr-4" />
                  <span className="block text-2xl">No singles available</span>
                </Text>
              </div>
            )}
          </TabsContent>
          {biographyLastFM && biographyLastFM !== '' && (
            <TabsContent value="bio">
              <Text
                dangerouslySetInnerHTML={{ __html: biographyLastFM.replace(/\n/g, '<br>') }}
                className="pt-16"
              />
            </TabsContent>
          )}
        </Tabs>
      ) : null}
    </>
  )
}

export default AlbumsAndBio
