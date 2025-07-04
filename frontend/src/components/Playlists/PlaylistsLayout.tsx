import { Outlet, useLocation } from 'react-router-dom'

import PlaylistsNav from '@/components/Playlists/PlaylistsNav'
import Text from '@/components/Text'

const PlaylistsLayout = (): JSX.Element => {
  const location = useLocation()

  const getPageTitle = (pathname: string): string => {
    const pathSegments = pathname.split('/').filter(Boolean)
    const lastSegment = pathSegments[pathSegments.length - 1]

    switch (lastSegment) {
      case 'playlists':
        return 'All Playlists'
      case 'discovery-weekly':
        return 'Discovery Weekly'
      case 'favorites':
        return 'Favorite Playlists'
      case 'your-top-songs':
        return 'Your Top Songs'
      case 'by-year':
        return 'By Year'
      case 'shazam':
        return 'Shazam'
      default:
        return 'Playlists'
    }
  }

  const currentTitle = getPageTitle(location.pathname)

  return (
    <div className="container">
      <Text variant="h1">{currentTitle}</Text>
      <PlaylistsNav />
      <Outlet />
    </div>
  )
}

export default PlaylistsLayout
