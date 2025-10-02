import { useEffect, useState } from 'react'

import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { SPOTIFY_TOP_SONGS_BY_YEAR } from '@/lib/constants'

const YourTopPlaylists = () => {
  const [activePlaylistId, setActivePlaylistId] = useState(SPOTIFY_TOP_SONGS_BY_YEAR[0]?.id || '')
  const [iframeLoading, setIframeLoading] = useState(true)

  useEffect(() => {
    setIframeLoading(true)
  }, [activePlaylistId])

  const baseEmbedUrl = 'https://open.spotify.com/embed/playlist/'
  const baseSpotifyUrl = 'https://open.spotify.com/playlist/'
  const spotifyEmbedSrc = `${baseEmbedUrl}${activePlaylistId}?utm_source=generator`
  const spotifyOpenUrl = `${baseSpotifyUrl}${activePlaylistId}`

  if (!SPOTIFY_TOP_SONGS_BY_YEAR || SPOTIFY_TOP_SONGS_BY_YEAR.length === 0) {
    return (
      <div className="pt-8 text-center">
        <Text variant="h2">SPOTIFY_TOP_SONGS_BY_YEAR não configurado.</Text>
      </div>
    )
  }

  return (
    <>
      <Tabs value={activePlaylistId} onValueChange={setActivePlaylistId}>
        <TabsList className="mb-8 bg-transparent flex space-x-4 justify-start">
          {SPOTIFY_TOP_SONGS_BY_YEAR.map((playlist) => (
            <TabsTrigger key={playlist.id} value={playlist.id} className="px-0 py-2 !bg-transparent data-[state=active]:text-primary hover:text-primary">
              <Text variant="h5" as="span" className='font-normal text-inherit'>
                {playlist.name}
              </Text>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activePlaylistId} className="mt-0">
          <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-8">
            <div className="relative w-full lg:w-2/3 min-h-[400px]">
              {iframeLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-75 rounded-lg z-10">
                  <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
                  <Text className="ml-4 text-white">Loading Playlist...</Text>
                </div>
              )}

              <iframe
                key={activePlaylistId}
                src={spotifyEmbedSrc}
                width="100%"
                height={iframeLoading ? 400 : 1200}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                onLoad={() => setIframeLoading(false)}
                className="rounded-lg"
                style={{ minHeight: '400px', opacity: iframeLoading ? 0.5 : 1 }}
              ></iframe>
            </div>

            <div className="w-full lg:w-1/3">
              <Text variant="h3" as="h3" className="mb-8 leading-normal">
                Since 27/11/2024 apps without extended mode are not able to get algorithmic and
                Spotify-owned editorial playlists.
              </Text>
              <Text variant="h3" as="p" className="leading-normal">
                Check the embed or <Hyperlink href={spotifyOpenUrl}>open in Spotify</Hyperlink>.
              </Text>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}

export default YourTopPlaylists
