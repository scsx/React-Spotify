import PlaylistsNav from '@/components/Playlists/PlaylistsNav'
import UserPlaylists from '@/components/Playlists/UserPlaylists'
import Text from '@/components/Text'

const Playlists = (): JSX.Element => {
  return (
    <div className="container">
      <Text variant="h1">Playlists</Text>
      <PlaylistsNav />
      <UserPlaylists />
    </div>
  )
}

export default Playlists
