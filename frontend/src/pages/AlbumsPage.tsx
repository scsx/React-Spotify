import AlbumsPageLayout from '@/components/Albums/AlbumsPageLayout'
import Text from '@/components/Text'

const AlbumsPage = () => {
  return (
    <div className="container mb-2">
      <Text variant="h1">Albums</Text>
      <Text variant="h4" color="muted" className="mb-8">
        New releases, it's mostly bad.
      </Text>

      <AlbumsPageLayout />
    </div>
  )
}

export default AlbumsPage
