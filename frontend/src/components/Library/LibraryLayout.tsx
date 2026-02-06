import LibraryJobs from '@/components/Library/LibraryJobs'
import LibrarySidebar from '@/components/Library/LibrarySidebar'
import Hyperlink from '@/components/shared/Hyperlink'
import Text from '@/components/shared/Text'

import { SPOTIFY_FAVORITE_PLAYLISTS } from '@/lib/constants'
import { SPOTIFY_SPECIAL_PLAYLISTS } from '@/lib/constants'

const LibraryLayout = () => {
  const allPlaylists = [...SPOTIFY_FAVORITE_PLAYLISTS, ...SPOTIFY_SPECIAL_PLAYLISTS]

  return (
    <div className="flex gap-x-16 mt-16">
      <div className="w-3/4">
        <Text variant="h2" className="mb-8">
          Favorite and Special playlists
        </Text>

        <LibraryJobs />

        <div className="mt-16">
          <Text variant="h4" className="mb-4">
            Playlists being fetched
          </Text>
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
      </div>

      <div className="w-1/4">
        <LibrarySidebar />
      </div>
    </div>
  )
}

export default LibraryLayout
