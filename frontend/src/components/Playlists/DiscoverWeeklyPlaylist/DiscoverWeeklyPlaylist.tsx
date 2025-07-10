import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'

Hyperlink
const DiscoverWeeklyPlaylist = () => {
  return (
    <div className="pt-8 flex space-x-8">
      <div className="w-2/3">
        <iframe
          src="https://open.spotify.com/embed/playlist/37i9dQZEVXcTkNtHwiM24j?utm_source=generator"
          width="100%"
          height="1200"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      </div>
      <div className="w-1/3">
        <Text variant="h3" as="h3" className="mb-8 leading-normal">
          Since 27/11/2024 apps without extended mode are not able to get algorithmic and
          Spotify-owned editorial playlists.
        </Text>
        <Text variant="h3" as="p" className="leading-normal">
          Here's the embed or{' '}
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
