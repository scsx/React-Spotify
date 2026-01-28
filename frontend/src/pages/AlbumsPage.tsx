import AlbumsPageLayout from '@/components/Albums/AlbumsPageLayout'
import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'

const AlbumsPage = () => {
  return (
    <div className="container mb-2">
      <Text variant="h1">Albums</Text>
      <Text variant="h4" color="muted" className="mb-8">
        Albums heard last four weeks.{' '}
        <Hyperlink
          target="_blank"
          href="https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks"
        >
          More info.
        </Hyperlink>
      </Text>

      <AlbumsPageLayout />
    </div>
  )
}

export default AlbumsPage
