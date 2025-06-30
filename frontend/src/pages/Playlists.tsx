import UserPlaylists from '@/components/Playlists/UserPlaylists'
import Text from '@/components/Text'

const Playlists = (): JSX.Element => {
  return (
    <div className="container">
      <Text variant="h1">Playlists</Text>
      <UserPlaylists />
    </div>
  )
}

export default Playlists
