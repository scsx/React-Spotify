import Hyperlink from '@/components/shared/Hyperlink'
import Text from '@/components/shared/Text'

const LibrarySidebar = () => {
  return (
    <>
      <div className="mb-16">
        <Text variant="h2" className="mb-4">
          Liked songs
        </Text>
        <Text>
          For liked songs go to <Hyperlink href="/tracks">tracks</Hyperlink>. They're obtained via
          Skiley and have more data than this app can get.
        </Text>
      </div>
      <div className="mb-16">
        <Text variant="h2" className="mb-4">
          How it works
        </Text>
        <Text>Blah blah</Text>
      </div>
    </>
  )
}

export default LibrarySidebar
