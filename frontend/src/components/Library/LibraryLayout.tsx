import Text from '@/components/shared/Text'
import { Checkbox } from '@/components/ui/checkbox'

import { SPOTIFY_FAVORITE_PLAYLISTS } from '@/lib/constants'
import { SPOTIFY_SPECIAL_PLAYLISTS } from '@/lib/constants'

const LibraryLayout = () => {
  const allPlaylists = [...SPOTIFY_FAVORITE_PLAYLISTS, ...SPOTIFY_SPECIAL_PLAYLISTS]

  return (
    <div className="flex gap-x-8 mt-16">
      <div className="w-1/3">
        <Text variant="h3" className="mb-8">
          Get favorite and Special playlists
        </Text>
        <div>
          {allPlaylists.map((playlist) => (
            <label key={playlist.id} className="flex items-center gap-x-2">
              <Checkbox
                className="data-[state=checked]:bg-slate-300 data-[state=checked]:text-black border-slate-400"
                defaultChecked
              />
              {playlist.name}
            </label>
          ))}
        </div>
      </div>

      <div className="w-1/3">
        <Text variant="h3" className="mb-8">
          Get liked songs
        </Text>
      </div>
      <div className="w-1/3">
        <Text variant="h3" className="mb-8">
          Something else
        </Text>
      </div>
    </div>
  )
}

export default LibraryLayout
