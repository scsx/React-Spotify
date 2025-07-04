import React from 'react'

import { NavLink } from 'react-router-dom'

import Text from '@/components/Text'

interface PlaylistsNavItem {
  name: string
  path: string
}

const playlistNavItems: PlaylistsNavItem[] = [
  {
    name: 'All',
    path: '/playlists',
  },
  {
    name: 'Favorites',
    path: '/playlists/favorites',
  },
  {
    name: 'Your Top Songs',
    path: '/playlists/your-top-songs',
  },
  {
    name: 'By year',
    path: '/playlists/by-year',
  },
  {
    name: 'Discovery Weekly',
    path: '/playlists/discovery-weekly',
  },
  {
    name: 'Shazam',
    path: '/playlists/shazam',
  },
]

const PlaylistsNav: React.FC = () => {
  return (
    <div className="border-b my-8">
      {' '}
      <nav className="flex space-x-6 pb-2">
        {playlistNavItems.map((item) => (
          <Text key={item.path} variant="h6">
            <NavLink
              to={item.path}
              end={item.path === '/playlists'}
              className={({ isActive }) =>
                isActive ? 'text-primary cursor-default' : 'text-foreground hover:text-primary'
              }
            >
              {item.name}
            </NavLink>
          </Text>
        ))}
      </nav>
    </div>
  )
}

export default PlaylistsNav
