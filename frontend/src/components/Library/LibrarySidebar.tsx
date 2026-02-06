import Hyperlink from '@/components/shared/Hyperlink'
import Text from '@/components/shared/Text'

const LibrarySidebar = ({ allPlaylists }: { allPlaylists: { id: string; name: string }[] }) => {
  console.log('Rendering LibrarySidebar with playlists:', allPlaylists)
  return (
    <>
      <div className="mb-16">
        <Text variant="h2" className="mb-4">
          Liked songs
        </Text>
        <Text>
          For liked songs go to <Hyperlink href="/tracks">tracks</Hyperlink>. They're obtained via
          Skiley and have more data than this app can get becayse Skiley has legacy access.
        </Text>
      </div>
      <div className="mb-16">
        <Text variant="h2" className="mb-4">
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
        <Text variant="h2" className="mb-4">
          Playlists
        </Text>
        <Text className="text-base">Favorite and Special playlists being fetched:</Text>
        <div className="mt-2">
          {allPlaylists.map((p, index) => (
            <span key={p.id}>
              <Hyperlink href={`/playlists/${p.id}`} variant="icon" className="text-sm">
                {p.name}
              </Hyperlink>
              {index < allPlaylists.length - 1 && ', '}
            </span>
          ))}
        </div>
      </div>
    </>
  )
}

export default LibrarySidebar
