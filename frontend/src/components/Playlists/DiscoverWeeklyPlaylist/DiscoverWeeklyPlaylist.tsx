import { useState } from 'react'

import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'

Hyperlink
const DiscoverWeeklyPlaylist = () => {
  const [iframeLoading, setIframeLoading] = useState(true)
  const spotifyEmbedSrc =
    'https://open.spotify.com/embed/playlist/37i9dQZEVXcTkNtHwiM24j?utm_source=generator'

  return (
    <div className="pt-8 flex space-x-8">
      <div className="relative w-2/3">
        {iframeLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 rounded-lg z-10">
            <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
            <Text className="ml-4 text-white">Loading...</Text>
          </div>
        )}

        {/* TODO: make ID more dynamic */}
        <iframe
          src={spotifyEmbedSrc}
          width="100%"
          height={iframeLoading ? 400 : 1200}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          onLoad={() => setIframeLoading(false)}
        ></iframe>
      </div>
      <div className="w-1/3">
        <Text variant="h3" as="h3" className="mb-8 leading-normal">
          Since 27/11/2024 apps without extended mode are not able to get algorithmic and
          Spotify-owned editorial playlists.
        </Text>
        <Text variant="h3" as="p" className="leading-normal">
          Check the embed or{' '}
          <Hyperlink href="https://open.spotify.com/playlist/37i9dQZEVXcTkNtHwiM24j?si=ba49edd40d6c49d5">
            open in Spotify
          </Hyperlink>
          .
        </Text>
      </div>
    </div>
  )
}

export default DiscoverWeeklyPlaylist
