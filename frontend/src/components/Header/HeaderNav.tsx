import { NavLink } from 'react-router-dom'

import { NavigationMenuItem } from '@/components/ui/navigation-menu'

type NavLinkClassNameFn = (props: { isActive: boolean }) => string

type NavItem = {
  to: string
  label: string
}

const navItems: NavItem[] = [
  { to: '/artists', label: 'Artists' },
  { to: '/albums', label: 'Albums' },
  { to: '/playlists', label: 'Playlists' },
  { to: '/genres', label: 'Genres' },
  { to: '/user', label: 'User' },
  { to: '/duplicates', label: 'Duplicates' },
  { to: '/backup', label: 'Backup' },
]

const HeaderNav = (): JSX.Element => {
  const linkClasses: NavLinkClassNameFn = ({ isActive }) => {
    return (
      'group inline-flex w-max items-center justify-center rounded-sm px-4 py-1 text-sm transition-colors ' +
      (isActive
        ? // Active
          'bg-primary text-white hover:bg-primary/90 dark:bg-primary dark:text-white dark:hover:bg-primary/90'
        : // Inactive
          'bg-transparent text-gray-900 hover:bg-primary hover:text-white dark:bg-transparent dark:text-gray-50 dark:hover:bg-primary dark:hover:text-white')
    )
  }

  return (
    <>
      {navItems.map((item) => (
        <NavigationMenuItem key={item.to}>
          <NavLink to={item.to} end className={linkClasses}>
            {item.label}
          </NavLink>
        </NavigationMenuItem>
      ))}
    </>
  )
}

export default HeaderNav
