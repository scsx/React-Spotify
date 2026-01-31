import React from 'react'

import { NavLink } from 'react-router-dom'

import { MdOutlineArrowOutward } from 'react-icons/md'
import { twMerge } from 'tailwind-merge'

import Text from '@/components/shared/Text'

type PlaylistsNavItem = {
  name: React.ReactNode
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
    name: 'Special',
    path: '/playlists/special',
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
    name: 'Discover Weekly',
    path: '/playlists/discover-weekly',
  },
  {
    name: 'Shazam',
    path: '/playlists/shazam',
  },
  {
    name: (
      <>
        Liked Songs <span className="ml-1 capitalize text-muted-foreground">(Tracks)</span>{' '}
        <sup className="text-muted-foreground">
          {' '}
          <MdOutlineArrowOutward className="text-lg" />
        </sup>
      </>
    ),
    path: '/tracks',
  },
]

const PlaylistsNav: React.FC = () => {
  return (
    <div className="border-b my-8">
      <nav className="flex space-x-6 pb-2">
        {playlistNavItems.map((item) => (
          <Text key={item.path} variant="h6">
            <NavLink
              to={item.path}
              end={item.path === '/playlists'}
              className={({ isActive }) =>
                twMerge(
                  'flex items-center gap-1',
                  isActive ? 'text-primary cursor-default' : 'text-foreground hover:text-primary'
                )
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
