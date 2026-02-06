import Hyperlink from '@/components/shared/Hyperlink'
import Text from '@/components/shared/Text'

const LibrarySidebar = () => {
  return (
    <>
      <div className="mb-16 mt-2">
        <Text variant="h3" className="mb-4">
          How it works
        </Text>
        <Text>
          Job is a request clicking "New job" that starts the synchronization process in the
          backend. That fetches the tracks for the specified playlists and updates the library
          accordingly. After that can be saved locally with IndexDB. See the{' '}
          <Hyperlink href="/dev-notes#library">dev notes</Hyperlink>
        </Text>
      </div>
      <div className="mb-16">
        <Text variant="h3" className="mb-4">
          Liked songs
        </Text>
        <Text>
          For liked songs go to <Hyperlink href="/tracks">tracks</Hyperlink>. They're obtained via
          Skiley and have more data than this app can get becayse Skiley has legacy access.
        </Text>
      </div>
    </>
  )
}

export default LibrarySidebar
